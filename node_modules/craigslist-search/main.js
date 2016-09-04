// USAGE node main [city/www(for all cities)] [category] [start record] [hasPic]

var qc = require('./')

var argv = require('minimist')(process.argv.slice(2))
qc(argv)
/*
var citiesOnly = argv.citiesOnly
if (citiesOnly) {
  qc({citiesOnly: true})
  return
}

var url = argv.url
var all = argv.all
var city = argv.city
if (!city  &&  !all  &&  !url)
  throw new Error('No city')
var category = argv.category
if (!category  &&  !url)
  throw new Error('No category')
var offset = argv.offset
var hasPic = argv.hasPic
var query = argv.query
var fullListing = argv.fullListing

var options = {category: category};
if (url) {
  options.url = url
  options.fullListing = true
}
if (all)
  options.allCities = true 	
if (city)
  options.city = city
if (fullListing)
  options.fullListing = true
if (offset)
  options.s = offset
if (hasPic  &&  (hasPic == '1' || hasPic == 'true'))
  options.hasPic = 1
if (query)
	options.query = query
 qc(options)
*/