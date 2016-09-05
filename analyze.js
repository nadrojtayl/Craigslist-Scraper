var CL = require('./searchcraigslist');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

CL.getLinks('boston','roo').then(function(res){
	res.forEach(function(obj){
		var newtext = obj.text.replace(/\n/g,' ').replaceAll("&amp;"," ").replaceAll('<br>'," ").replaceAll('&apos;',"'")
		obj.text = newtext;
		obj.wordcount = countWords(obj.text)
	})
	//console.log(res);

	var commonwords = {};
	res.forEach(function(obj){
		var wordcount = obj.wordcount;
		for(var word in wordcount){
			if(word in commonwords){
				commonwords[word] = commonwords[word] + wordcount[word];
			} else {
				commonwords[word] = wordcount[word];
			}
		}
	})

	res.forEach(function(obj){
		var wordcount = obj.wordcount;
		for(var word in wordcount){
			obj['wordcount'][word] = wordcount[word]/commonwords[word];
		}

	})

	res.forEach(function(obj){
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
		obj['common'] = JSON.stringify(common);
		obj['sig'] = obj['common'].slice(obj['common'].length-20,obj['common'].length)
	})

	console.log(res);

})

function countWords(string){
	var count = {};
	var arr = string.split(' ');
	arr.forEach(function(word){
		if (word in count){
			count[word] = count[word] + 1;
		} else {
			count[word] = 1;
		}
	})
	return count;
}

function objFilter(obj,cb){
	var results = {};
	for (var key in obj){
		if (cb(obj[key],key)){
			results[key] = obj[key]
		}
	}
	return results;

}