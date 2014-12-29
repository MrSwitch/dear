//
// Test dear
//

var dear = require('../../../src/dear');
var expect = require("expect.js");


describe('dear.init()', function(){

	it('should be a function', function(){

		// Includes events
		expect( dear.init ).to.be.a( 'function' );

	});


	it('should set the services', function(){

		var config = {
			prop : 'value'
		};

		dear.init({
			'test.init' : config
		});

		// Should add the service
		expect( dear.services ).to.have.property( 'test.init', config );

	});
});
