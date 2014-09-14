//
// dear init
// Setup keys/services
//

var extend = require('../utils/extend');

module.exports = function(services, options){

	// format services if its just, service => client_id
	for( var x in services ){
		if( typeof services[x] !== 'object' ){
			services[x]['client_id'] = services[x];
		}
	}

	// Extend the current services
	extend( this.services, services );

};