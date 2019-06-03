/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
/* A message from the API that i'm using : " Thank you for using Alpha Vantage! 
  Our standard API call frequency is 5 calls per minute and 500 calls per day. 
  Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency. " */ 
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          
         assert.equal(res.status, 200);
         assert.equal(res.type, 'application/json');
         assert.property(res.body, 'stockData');
         assert.property(res.body.stockData, 'stock');
         assert.property(res.body.stockData, 'price');
         assert.property(res.body.stockData, 'likes');

         assert.equal(res.body.stockData.stock, 'GOOG');
         assert.typeOf(res.body.stockData.price, 'string');
         assert.typeOf(res.body.stockData.likes, 'number');
         
          
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'msft', like: true})
         .end(function(err, res) {
/* The first call will pass but the second call will fail because only 1 like per ip, and now it only sends 
the message that inform the user, that they already like the stock */
         assert.equal(res.status, 200);
         assert.property(res.body, 'stockData');
         assert.property(res.body.stockData, 'stock');
         assert.property(res.body.stockData, 'price');
         assert.property(res.body.stockData, 'likes');

         assert.equal(res.body.stockData.stock, 'MSFT');
         assert.typeOf(res.body.stockData.price, 'string');
         assert.typeOf(res.body.stockData.likes, 'number');
         assert.equal(res.body.stockData.likes, 1);
          
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'msft', like: true})
         .end(function(err, res) {
          
         assert.equal(res.status, 200);
         assert.equal(res.type, 'text/plain');
         assert.equal(res.text, 'You already liked this stock');
         
          
          done();
        });      
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: ['amzn', 'fb']})
         .end(function(err, res) {
          //console.log(res.body)
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel-likes');
          
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel-likes');
          
          assert.equal(res.body.stockData[0].stock, 'AMZN');
          assert.typeOf(res.body.stockData[0].price, 'string');
          assert.typeOf(res.body.stockData[0]['rel-likes'], 'number');
          
          assert.equal(res.body.stockData[1].stock, 'FB');
          assert.typeOf(res.body.stockData[1].price, 'string');
          assert.typeOf(res.body.stockData[1]['rel-likes'], 'number');
          
          done();
        });      
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: ['amzn', 'fb'], like: true})
         .end(function(err, res) {
/* The first call will pass but the second call will fail because only 1 like per ip, and now it only sends 
the message that inform the user, that they already like the stock */
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel-likes');
          
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel-likes');
          
          assert.equal(res.body.stockData[0].stock, 'AMZN');
          assert.typeOf(res.body.stockData[0].price, 'string');
          assert.typeOf(res.body.stockData[0]['rel-likes'], 'number');
          assert.equal(res.body.stockData[0]['rel-likes'], 0);
          
          assert.equal(res.body.stockData[1].stock, 'FB');
          assert.typeOf(res.body.stockData[1].price, 'string');
          assert.typeOf(res.body.stockData[1]['rel-likes'], 'number');
          assert.equal(res.body.stockData[0]['rel-likes'], 0);
          
          done();
        });      
      });
      
    });

});
