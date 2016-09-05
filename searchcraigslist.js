console.log('Testing craigslist')
var request = require('request');
var cheerio = require('cheerio');
var _ = require("underscore");
var Promise = require('bluebird');

//promisifies  http request method to make code clearer
var request = Promise.promisify(request)


module.exports.getLinks = function(city,apartmenttypekey,cb){
	return new Promise(function(resolve,reject){
	//constructs search url based on city, apartment type
		var url = 'http://' + city + '.craigslist.org/search/' + apartmenttypekey;


		var listinglinks = []; //array to hold links to listings returned from search
		var requestbodies = [];	//array to hold request bodies
		var results = [];	///array to hold final results (listings plus request bodies)

		request(url).then(function(req){
			var $ = cheerio.load(req.body); //cheerio is a library that parses an html string to return a manipulable DOM
			$('.hdrlnk').each(function(index,link){
		 		listinglinks.push('http://'+city + '.craigslist.org/' + link.attribs.href)
		  	})	
		})
		.then(function(){

			  listinglinks.forEach(function(link,index){
			  	requestbodies[index] = request(link)
			  })

			Promise.all(requestbodies).then(function(){
				requestbodies.forEach(function(promise,index){
					promise.then(function(req){
						$ = cheerio.load(req.body);
						var postbodytext = decodeURIComponent($('#postingbody').html());
						var posttitle = $('#titletextonly').html();
						var postprice = $('.price').html()
						var map = $('#map')
						var postlatitude = map.attr('data-latitude');
						var postlongitude =map.attr('data-longitude');
						results[index] = {link:listinglinks[index],title:posttitle,price:postprice,lat:postlatitude,lon:postlongitude,text: postbodytext}
					})
				})

				return Promise.all(results).then(function(){
					resolve(results);
				})

				
			})

		})
	})
}



module.exports.getLinksCallback = function(city,apartmenttypekey,cb){
	//constructs search url based on city, apartment type
		var url = 'http://' + city + '.craigslist.org/search/' + apartmenttypekey;


		var listinglinks = []; //array to hold links to listings returned from search
		var requestbodies = [];	//array to hold request bodies
		var results = [];	///array to hold final results (listings plus request bodies)

		request(url).then(function(req){
			var $ = cheerio.load(req.body); //cheerio is a library that parses an html string to return a manipulable DOM
			$('.hdrlnk').each(function(index,link){
		 		listinglinks.push('http://'+city + '.craigslist.org/' + link.attribs.href)
		  	})	
		})
		.then(function(){

			  listinglinks.forEach(function(link,index){
			  	requestbodies[index] = request(link)
			  })

			Promise.all(requestbodies).then(function(){
				requestbodies.forEach(function(promise,index){
					promise.then(function(req){
						$ = cheerio.load(req.body);
						var postbodytext = decodeURIComponent($('#postingbody').html());
						var posttitle = $('#titletextonly').html();
						var postprice = $('.price').html()
						var map = $('#map')
						var postlatitude = map.attr('data-latitude');
						var postlongitude =map.attr('data-longitude');
						results[index] = {link:listinglinks[index],title:posttitle,price:postprice,lat:postlatitude,lon:postlongitude,text: postbodytext}
					})
				})

				return Promise.all(results).then(function(){
					cb(results);
				})

				
			})

		})
}





