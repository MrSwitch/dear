//
// Test dear
//

var dear = require('../../../src/dear');
var expect = require("expect.js");



//
describe('dear()', function(){

	it('should create a new instance', function(){

		var inst = dear('test');

		// Sets the default_network
		expect( inst.settings ).to.have.property( 'default_service', 'test' );

		// Includes events
		expect( inst ).to.have.property( 'on' );

	});

});