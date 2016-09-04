var  craigslist = require('node-craigslist');
var print = function(err, listing) {
  if (err)
    return err;
  console.log(JSON.stringify(listing, null, 2))
}
var QueryCraigslist = module.exports = function(options, callback) {
 if (options.url) 
   options.fullListing = true

  client = craigslist({
     city : options.city ? options.city : ''
  })

  if (options.citiesOnly)
    options.allCities = true
  var url = options.url
  if (url) {
    var idx = url.indexOf('://') + 3;
    var idx1 = url.indexOf('/', idx);
    options.hostname = url.substring(idx, idx1)
    options.path = url.substring(idx1)
    options.fullListing = true
  }
  client.search(options, '', function (err, listings) {
  	if (!listings) {
      callback(null, {})
      return;
    }
    if (!callback)
      callback = print
    if (options.citiesOnly) {
      callback(err, listings)
      return;
    }

    var all = options.allCities

    if (all) {
    // play with listings here...
      listings.forEach(function (listing) {
        var options1 = { city: listing.city, cityName: listing.cityName }
        Object.keys(options).forEach(function(key) {
          if (key != 'allCities')
            options1[key] = options[key]
        })
        client.search(options1, '', function (err, l1) {
          if (l1) 
            callback(err, l1)
        })
      })
    }
    else {
      if (!options.fullListing) {
        callback(err, listings)
        return
      }  
      if (options.url) 
        return callback(err, listings)
      
      // For the listing with full description we need to run request per listings url and extract description from it
      listings.forEach(function(listing) {
        var idx = listing.url.indexOf('://') + 3;
        var idx1 = listing.url.indexOf('/', idx);
        options.hostname = listing.url.substring(idx, idx1)
        options.path = listing.url.substring(idx1)
        client.search(options, '', function (err, description) {
          listing.description = description
          callback(err, listing)
        })
      })
    }
  })
}