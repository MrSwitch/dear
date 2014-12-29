//
// Spec dear.api
//

var dear = require('../../../src/dear');
var request = require('../../../src/utils/request');
var param = require('../../../src/utils/param');
var expect = require("expect.js");

var mock_response = {
	'me' : {
		id : '80087355',
		name: 'Andrew'
	}
};


describe('dear.api()', function(){

	// Test Provider service

	var port = 3333;
	var localhost = 'http://localhost:'+port+'/';

	before(function(){
		dear.init({
			test : {
				base : localhost,
				get : {
					'me' : 'me'
				}
			}
		});
	});


	it('should be a function', function(){

		// Includes events
		expect( dear.api ).to.be.a( 'function' );

	});

	it('should return a promise', function(){

		expect( dear('test').api() ).to.have.property( 'then' );

	});


	it('should be available via `dear.api` or `dear( network ).api`', function(){


		// Should add the service
		expect( dear('test').api ).to.be.a( 'function' );

	});


	describe('invalid arguments', function(){


		function errorObject(code,done){

			return function(e){
				// Chech for an error Response
				expect( e ).to.be.an( 'object' );
				expect( e ).to.have.property( 'error' );
				expect( e.error ).to.have.property( 'code', code );
				done();
			};
		}


		it('should trigger an error code invalid_arguments, when called with no data', function(done){

			// Should 
			dear('test').api().then( null, errorObject('invalid_arguments', done) );

		});


		it('should trigger an error code required_path, when there is no path attribute', function(done){

			// Should 
			dear('test').api('').then( null, errorObject('required_path', done) );

		});


		it('should trigger an error code invalid_network, when called with a non-recognised network', function(done){

			// Should 
			dear('wrong').api('path').then( null, errorObject('invalid_network', done) );

		});

	});


	describe('request mocked', function(){

		var _request = request.fn;

		before(function(){

			request.fn = function(p){
				this.on = function(_event, handler){
					if(_event.match(/\bend\b/)){
						setTimeout(function(){
							handler(p);
						});
					}
					return this;
				};
				return this;
			};

			dear.init({
				'test.api' : {
					base : localhost,
					get : {
						me : 'me'
					}
				}
			});

		});


		after(function(){

			request.fn = _request;

		});


		it('should pass through a complete event once the request has been fullfilled', function(done){

			// Should
			dear('test.api').api('me').then( function(res){

				expect( res ).to.be.an( Object );
				expect( res.url ).to.eql( localhost + 'me' );
				expect( res.method ).to.eql( 'get' );

				done();
			});

		});

		it('should define the request properties, url, method, query', function(done){

			var query = {
				access_token : 'secret'
			};

			// Should
			dear('test.api')
			.api('query',query)
			.then( function(res){

				expect( res ).to.be.an( Object );
				expect( res.url ).to.eql( localhost + 'query' );
				expect( res.method ).to.eql( 'get' );
				expect( res.query ).to.eql( query );

				done();
			});

		});

	});

});
