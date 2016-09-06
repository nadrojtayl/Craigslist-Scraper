var CL = require('./searchcraigslist');
//To get results from Craigslist, use either getLinks or getLinksCallback, both return listings based on city and craigslist search category
//To get results with significant words in body text listed use getLinkswithSigWord, which will return each array along with an array listing the top 
//20 most significant word in that listing (Significance defined with Tf-idf:https://en.wikipedia.org/wiki/Tf%E2%80%93idf)

//first argument for both is the city
//second is craigslist search category


//getLinks returns a promise that resolves to the array of first 100 listings 


//getLinksCallback takes as its third argument a callback to perform on the array of listings

//getLinkswithSigWords returns a promise that resolves to the array of listings

//use whichever pattern makes more sense




//getLinks example, see all room shares in Boston
CL.getLinks('boston','roo').then(function(res){console.log(res)})


//getLinksCallback example
CL.getLinksCallback('boston','roo',function(res){console.log(res)})

