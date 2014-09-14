//
// Spec dear.api
//

var dear = require('../src/dear.js');
var param = require('../src/utils/param.js');
var expect = require("expect.js");
var http = require("http");
var url = require("url");

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
	var srv;

	before(function(done){
		srv = http.createServer(function(req,res){

			var path = req.url.replace(/^\//,'');

			var json = mock_response[path] || {};

			json.request = req.url;

			res.end(JSON.stringify( json ));

		}).listen(port, function(){
//			console.log(localhost + " connected");
			done();
		});
	});

	after(function(done){
		srv.close(function(){
			done();
		});
	});


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
			dear('test').api().on('error', errorObject('invalid_arguments', done) );

		});


		it('should trigger an error code required_path, when there is no path attribute', function(done){

			// Should 
			dear('test').api('').on('error', errorObject('required_path', done) );

		});


		it('should trigger an error code invalid_network, when called with a non-recognised network', function(done){

			// Should 
			dear('wrong').api('path').on('error', errorObject('invalid_network', done) );

		});

	});


	describe('requests', function(){

		before(function(){

			// Setup the test environment with meta data

			dear.init({
				'test.api' : {
					base : localhost,
					get : {
						me : 'me'
					}
				}
			});

		});


		it('should trigger a success event, with the response', function(done){

			// Should
			dear('test.api').api('me').on('success', function(res){

				expect( res ).to.be.eql( mock_response['me'] );

				done();
			});

		});

		it('should convert data to URI query', function(done){

			// Should
			dear('test.api').api('query',{
				access_token : 'secret'
			}).on('success', function(res){

				expect( res.request ).to.contain( 'access_token=secret' );

				done();
			});

		});

	});

});
