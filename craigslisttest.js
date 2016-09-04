var CL = require('node-craigslist');

var client = new CL.Client({city:'sfbay',category:'roo'});

client.list({category:'roo'}).then(function(data){
	console.log(data);
})