console.log('Testing craigslist')
var request = require('request');
var cheerio = require('cheerio');
var _ = require("underscore");
var Promise = require('bluebird');

//promisifies  http request method to make code clearer
var request = Promise.promisify(request)


//helper method 
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


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


module.exports.getLinkswithSigWord = function(city,apartmenttypekey){
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
							var postbodytext = $('#postingbody').html();
							var posttitle = $('#titletextonly').html();
							var postprice = $('.price').html()
							var map = $('#map')
							var postlatitude = map.attr('data-latitude');
							var postlongitude =map.attr('data-longitude');
							results[index] = {link:listinglinks[index],title:posttitle,price:postprice,lat:postlatitude,lon:postlongitude,text: postbodytext}
						})
					})

					return Promise.all(results).then(function(){
						results.forEach(function(obj){
							var newtext = obj.text.replace(/\n/g,' ').replaceAll("&amp;"," ").replaceAll('<br>'," ").replaceAll('&apos;',"'")
							obj.text = newtext;
							obj.wordcount = countWords(obj.text)
						})

						var commonwords = {};
						results.forEach(function(obj){
							var wordcount = obj.wordcount;
							for(var word in wordcount){
								if(word in commonwords){
									commonwords[word] = commonwords[word] + wordcount[word];
								} else {
									commonwords[word] = wordcount[word];
								}
							}
						})



						results.forEach(function(obj){
							var wordcount = obj.wordcount;
							for(var word in wordcount){
								obj['wordcount'][word] = wordcount[word]/commonwords[word];
							}

						})

						results.forEach(function(obj){
							var common = [];
							for(var word in obj.wordcount){
								common.push([word,obj.wordcount[word]]);
							}
							common.sort(function(a,b){
								if(a[1]>b[1]){
									return 1;
								} 
								if(a[1]<b[1]){
									return -1
								}
								return 0;
							})
							obj['common'] = common;
							obj['sig'] = obj['common'].slice(obj['common'].length-20).map(function(obj){return obj[0]})
						})
						resolve(results);


					})

					
				})

			})
	})
}

function countWords(string){
	var arr = string.split(' ');
	var results = {};
	arr.forEach(function(word){
		if(word in results){
			results[word] = results[word] + 1;
		} else {
			results[word] = 1;
		}
	})

	return results;
}



module.exports.getLinkswithSigWord('sfbay','roo').then(function(results){console.log(results.length)})

