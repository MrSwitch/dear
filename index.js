//
// Dear components into one library
//

var dear = require('./src/dear.js');


// Create the HelloJS environment for these modules
// We're loading non-commonjs scripts here, because these are written for the client-side

global.hello = dear;


// Define some hello.utils.[methods] via `dear`
// These are used within some hellojs modules
dear.utils = {
	param		: require('./src/utils/param'),
	isArray		: require('./src/utils/isArray'),
	hasBinary	: require('./src/utils/hasBinary'),
	toBlob		: require('./src/utils/toBlob'),
	store		: function(){}
};

require('hellojs/src/modules/dropbox');
require('hellojs/src/modules/facebook');
require('hellojs/src/modules/flickr');
require('hellojs/src/modules/foursquare');
require('hellojs/src/modules/github');
require('hellojs/src/modules/google');
require('hellojs/src/modules/instagram');
require('hellojs/src/modules/linkedin');
require('hellojs/src/modules/soundcloud');
require('hellojs/src/modules/tumblr');
require('hellojs/src/modules/twitter');
require('hellojs/src/modules/windows');
require('hellojs/src/modules/yahoo');


// Return

module.exports = dear;