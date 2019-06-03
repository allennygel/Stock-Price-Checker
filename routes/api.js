/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const StockHandler = require('../controllers/stockHandler.js')

const MONGO_URI = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
const stockHandler = new StockHandler();
  
  app.set('trust proxy', true);
  
  app.route('/api/stock-prices')
    
     .get(function (req, res, next) {
    const symbol = req.query.stock
    const like = req.query.like
    const ip = req.ip
    
    
    const dbChecker = async function() {
      
    const DBchecker = await stockHandler.dbChecker(symbol);
    const getPrice = await stockHandler.getStock(symbol);
    const get2ndPrice = await stockHandler.get2ndStock(symbol);
      
      
      MongoClient.connect(MONGO_URI, function(err, db) {
        
        if(!Array.isArray(symbol) && like === 'true') {
         db.collection('stocks').find(DBchecker).toArray(function(err, data) {
           if(err) console.log(err);
           
           if(data.length === 0 ) {next()}
           
           else if(data.length === 1) {
             
             
           let arrOfIp = [...data[0].ip];
             
           let ipChecker = arrOfIp.map(x => x === ip).filter(i => i === true)
             
           if(ipChecker[0] === true) {res.type('text').send("You already liked this stock")}
             
           if(ipChecker.length === 0) {
            db.collection('stocks').findOneAndUpdate(DBchecker,{$inc: {likes: 1}, $push: {ip: ip}, $set: {price: getPrice.price}}, {returnOriginal: false}, function(err, data) {
              if(err) console.log(err);
              res.json({stock: data.value.stock, price: data.value.price, likes: data.value.likes})
              db.close()
            })
           }
             
           }
         });
        }
        
        else if(Array.isArray(symbol) && like === 'true') { 
         db.collection('stocks').find(DBchecker).toArray(function(err, data) {
         if(err) console.log(err);
           
         if(data.length === 0) {next()}
           
         else if(data.length === 2) {
           
         let arrOfIp = [...data[0].ip];
         let arrOfIp2 =  [...data[1].ip];
           
         let ipChecker = arrOfIp.map(x => x === ip).filter(i => i === true);
         let ipChecker2 = arrOfIp2.map(x => x === ip).filter(i => i === true);
           
         if(ipChecker[0] === true) {return res.type('text').send("You already liked this stock: " + data[0].stock)};
         if(ipChecker2[0] === true) {return res.type('text').send("You already liked this stock: " + data[1].stock)};
           
         if(ipChecker.length === 0 && ipChecker2.length === 0) {
           
           db.collection('stocks').updateMany(DBchecker, {$inc: {likes: 1}, $push: {ip: ip}});
           db.collection('stocks').find(DBchecker).project({_id: 0, ip: 0}).toArray(function(err, data) {
             if(err) console.log(err);
             
             if(data[0].likes === data[1].likes) {
               
             res.json({
               stockData: [
                 {stock: data[0].stock, price: getPrice.price, 'rel-likes': 0},
                 {stock: data[1].stock, price: get2ndPrice.price, 'rel-likes': 0 }
               ]});
               db.close()
             }
             
             else if(data[0].likes  > data[1].likes) {
               
              let likeDifference = [(data[1] - data[0].likes).toString()]
             
              likeDifference.push(likeDifference[0].split('-').join(''))
             
              let result = likeDifference.map(x => Number(x))
               
               res.json({
                 stockData: [
                   {stock: data[0].stock, price: getPrice.price, 'rel-likes': result[1]},
                   {stock: data[1].stock, price: get2ndPrice.price, 'rel-likes': result[0]}
                 ]});
               db.close()
             }
             
             else if(data[1].likes > data[0].likes) {
               
              let likeDifference = [(data[0] - data[1].likes).toString()]
             
              likeDifference.push(likeDifference[0].split('-').join(''))
             
             let result = likeDifference.map(x => Number(x))
               res.json({
                 stockData: [
                   {stock: data[0].stock, price: getPrice.price, 'rel-likes': result[0]},
                   {stock: data[1].stock, price: get2ndPrice, 'rel-likes': result[1] }
                 ]});
               db.close()
             } 
             
             
            })
           }
           
           }
         });
        }
        
        else {
          
        db.collection('stocks').find(DBchecker).project({_id: 0, ip:0}).toArray(function(err, data) {
          if(err) console.log(err);
          
          if(data.length === 0) {next()}
          
          else if(Array.isArray(symbol) && data.length === 1) {
            req.stockToFind = symbol.filter(i => !(i.toUpperCase() === data[0].stock))
            next()
          }
          else if(Array.isArray(symbol) && data.length === 2) {
             
             if(data[0].likes === data[1].likes) {
               //console.log(data)
             res.json({
               stockData: [
                 {stock: data[0].stock, price: getPrice.price, 'rel-likes': 0},
                 {stock: data[1].stock, price: get2ndPrice.price, 'rel-likes': 0 }
               ]});
               db.close()
             }
             
             else if(data[0].likes  > data[1].likes) {
               //console.log('1nd condition')
              let likeDifference = [(data[1].likes - data[0].likes).toString()];
             
              likeDifference.push(likeDifference[0].split('-').join(''));
             
              let result = likeDifference.map(x => Number(x));
               
               res.json({
                 stockData: [
                   {stock: data[0].stock, price: getPrice.price, 'rel-likes': result[1]},
                   {stock: data[1].stock, price: get2ndPrice.price, 'rel-likes': result[0]}
                 ]});
               db.close()
             }
             
             else if(data[1].likes > data[0].likes) {
               //console.log('2nd condition')
              let likeDifference = [(data[0].likes - data[1].likes).toString()];
             
              likeDifference.push(likeDifference[0].split('-').join(''));
             
             let result = likeDifference.map(x => Number(x));
               res.json({
                stockData: [
                  {stock: data[0].stock, price: getPrice.price,'rel-likes': result[0]},
                  {stock: data[1].stock, price: get2ndPrice.price, 'rel-likes': result[1]}
                ]});
               db.close()
             } 
             
          
          }
          else {
            
            res.json({stockData: data[0]});
            db.close()
          }
          
     })
    }
           
    })
   } 

    dbChecker()
    
    })
    
    .get(function (req, res) {
    
    const ip = req.ip
    const symbol = req.query.stock
    const like = req.query.like
    
    const getStock = async function() {
      
      let passedsymbol = req.stockToFind
      
      if(Array.isArray(passedsymbol) && passedsymbol.length === 1) {
      
        const passedSymbol = await stockHandler.passedSymbol(passedsymbol, like, ip)
        
        let newArr = symbol.map(x => x.toUpperCase())
        
        if(passedSymbol === 'Cannot find Stock,  please check the stock name and try again.')  res.type('text').send(passedSymbol);
      
        else {
        MongoClient.connect(MONGO_URI, function(err, db) {
         db.collection('stocks').insertOne(passedSymbol); 
         db.collection('stocks').find({stock: {$in : newArr}}).project({_id: 0, ip:0}).toArray(function(err, data) {
          if(err) console.log(err);
          res.json(data)
          db.close()
         })
        })
       }
        
      }
      else if(Array.isArray(symbol)) {
        
        const getStock = await stockHandler.getStock(symbol, like, ip);
        const get2ndStock = await stockHandler.get2ndStock(symbol, like, ip);
        
        let message = 'Cannot find Stock,  please check the stock name and try again.';
        let newArr = symbol.map(x => x.toUpperCase())
        //console.log(getStock, get2ndStock)
        if(getStock === message || get2ndStock === message) {return res.type('text').send(message)}
        
        MongoClient.connect(MONGO_URI, function(err, db) {
        db.collection('stocks').insertMany([getStock, get2ndStock]);
        db.collection('stocks').find({stock: {$in: newArr}}).project({_id: 0, ip:0}).toArray(function(err, data) {
         if(err) console.log(err);
          
         res.json({stockData : [{stock: data[0].stock, price: data[0].price, 'rel-likes': 0},{stock: data[1].stock, price: data[1].price, 'rel-likes': 0}]})
         
         })
        })
      }
      
      else {
        
      const getStock = await stockHandler.getStock(symbol, like, ip);
  
      if(getStock === 'Cannot find Stock,  please check the stock name and try again.') { 
        res.type('text').send(getStock)
      } else {
 
       MongoClient.connect(MONGO_URI, function(err, db) {
        db.collection('stocks').insertOne(getStock, function(err, data) {
          if(err) console.log(err);
          res.json({ stock: data.ops[0].stock, price: data.ops[0].price, likes: data.ops[0].likes })
          db.close()
        })
      })
      }
     }
    } 
    
    getStock()
    
    });
    
};
