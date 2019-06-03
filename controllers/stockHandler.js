const fetch = require('node-fetch');

function stockhandler() {
  
  this.getStock = async function(symbol, like, ip) {
    
    if(Array.isArray(symbol)) {
      
    const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ symbol[0] +'&apikey=XFL025DTWS7WSX7D';
    const getData = await fetch(url);
    const data = await getData.json()
    //console.log('1st stock', data);
    if(data.hasOwnProperty('Global Quote')) {
     if(!data['Global Quote'].hasOwnProperty('01. symbol') || data.hasOwnProperty('Note')) {
       
      return 'Cannot find Stock,  please check the stock name and try again.';
      
      } else if(like === 'true') {
       
       return {
       stock: data['Global Quote']['01. symbol'],
       price: data['Global Quote']['05. price'],
       likes: 1,
       ip: [ip]
       };
      
      } else {
       
      return {
      stock: data['Global Quote']['01. symbol'],
      price: data['Global Quote']['05. price'],
      likes: 0,
      ip: []
      };
         
      }
     }
      
    } else if(!Array.isArray(symbol)) {
      
     const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ symbol +'&apikey=XFL025DTWS7WSX7D';
     const getData = await fetch(url);
     const data = await getData.json()
     
     if(data.hasOwnProperty('Global Quote')) {
       
      if(!data['Global Quote'].hasOwnProperty('01. symbol')) {
       
      return 'Cannot find Stock,  please check the stock name and try again.';
      
      } else if(like === 'true') {
       
       return {
       stock: data['Global Quote']['01. symbol'],
       price: data['Global Quote']['05. price'],
       likes: 1,
       ip: [ip]
       };
      
      } else {
       
      return {
      stock: data['Global Quote']['01. symbol'],
      price: data['Global Quote']['05. price'],
      likes: 0,
      ip: []
      };
         
     }
    }
   }
  }
  
  this.get2ndStock = async function(symbol, like, ip) {
    
   if(Array.isArray(symbol)) {
     
   const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ symbol[1] +'&apikey=XFL025DTWS7WSX7D';
   const getData = await fetch(url);
   const data = await getData.json()
   
   if(data.hasOwnProperty('Global Quote')) {
     
   if(!data['Global Quote'].hasOwnProperty('01. symbol')) {
       
      return 'Cannot find Stock,  please check the stock name and try again.';
      
      } else if(like === 'true') {
       
       return {
       stock: data['Global Quote']['01. symbol'],
       price: data['Global Quote']['05. price'],
       likes: 1,
       ip: [ip]
       };
        
      } else {
       
       return {
       stock: data['Global Quote']['01. symbol'],
       price: data['Global Quote']['05. price'],
       likes: 0,
       ip: []
      };
         
    }
   }
  
   }
  }
  
  this.dbChecker = async function(symbol) {
    if(Array.isArray(symbol)) {
      
      let newArr =  symbol.map(i => i.toUpperCase());
      
      return { stock: { $in: newArr }}
      
      } else {
        
      return { stock: symbol.toUpperCase() }
      }
  }
  
  this.passedSymbol = async function(passedsymbol, like, ip) {
    const url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+ passedsymbol[0] +'&apikey=XFL025DTWS7WSX7D';
    const getData = await fetch(url);
    const data = await getData.json()
    
    
    if(data.hasOwnProperty('Global Quote')) {
    
     if(!data['Global Quote'].hasOwnProperty('01. symbol') || data.hasOwnProperty('Note')) {
       
      return 'Cannot find Stock,  please check the stock name and try again.';
      
     } else if(like === 'true') {
       
       return {
       stock: data['Global Quote']['01. symbol'],
       price: data['Global Quote']['05. price'],
       likes: 1,
       ip: [ip]
       };
       
      } else {
       
      return {
      stock: data['Global Quote']['01. symbol'],
      price: data['Global Quote']['05. price'],
      likes: 0,
      ip: []
      };
         
     }
    }
  }

};


module.exports = stockhandler