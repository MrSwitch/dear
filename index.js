//
// Dear components into one library
//

var dear = require('./src/dear.js');


// Define the modules which Dear supports

dear.init({
	google		: require('./src/modules/google'),
	windows		: require('./src/modules/windows'),
	facebook	: require('./src/modules/facebook'),
	yahoo		: require('./src/modules/yahoo')
});



// Return

module.exports = dear;