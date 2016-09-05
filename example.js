var CL = require('./searchcraigslist');
//To get results from Craigslist, use either getLinks or getLinksCallback

//first argument for both is the city
//second is craigslist search category


//getLinks returns a promise that resolves to the array of first 100 listings 


//getLinksCallback takes as its third argument a callback to perform on the array of listings

//use whichever pattern makes more sense


//getLinks example, see all room shares in Boston
CL.getLinks('boston','roo').then(function(res){console.log(res)})


//getLinksCallback example
CL.getLinksCallback('boston','roo',function(res){console.log(res)})

