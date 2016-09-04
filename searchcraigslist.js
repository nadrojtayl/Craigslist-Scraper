console.log('Testing craigslist')
var request = require('request');
var cheerio = require('cheerio');
var _ = require("underscore");
var Promise = require('bluebird');

var request = Promise.promisify(request)

var apartmenttypekey = 'roo'
//Craigslist apartment type
//roo=rooms and shares
//sbw = sublets and temps
//apa = apartments/housing wanted
var city = "sfbay"
//roo

var url = 'http://' + city + '.craigslist.org/search/' + apartmenttypekey;

var listinglinks = [];
var requestbodies = [];
var results = [];

request(url).then(function(req){
	var $ = cheerio.load(req.body);
	//console.log($.html())
	$('.hdrlnk').each(function(index,link){
 		listinglinks.push('http://'+city + '.craigslist.org/' + link.attribs.href)
  	})	
  	//console.log(listinglinks);
})
.then(function(a){

	  listinglinks.forEach(function(link,index){
	  	requestbodies[index] = request(link)
	  })

	Promise.all(requestbodies).then(function(){
		requestbodies.forEach(function(promise,index){
			promise.then(function(req){
				$ = cheerio.load(req.body);
				var bodytext = $('#postingbody').html();
				//console.log(index);
				results[index] = {link:listinglinks[index],text: bodytext}
			})
		})

		Promise.all(results).then(function(){
			console.log(results);
		})

		
	})

})





//WORKING CALLBACK VERSION

// request(url, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//    	var $ = }
// cheerio.load(body) // Print the body of response.

//   $('.hdrlnk').each(function(index,link){
//  	listinglinks.push(link.attribs.href)
//   })

//   listinglinks = listinglinks.map(function(link){
//   	return 'http://seattle.craigslist.org' + link
//   })

  // listinglinks.forEach(function(link,index){
  // 	request(link,function(err,resp,body){
  // 		$ = cheerio.load(body)
  // 		requestbodies[index] = $('#postingbody').html();

  // 		if(index = 99){
  // 			console.log('Listing',listinglinks[0],'Body',requestbodies[0])
  // 		}
  // 	})
  // })

//   // })