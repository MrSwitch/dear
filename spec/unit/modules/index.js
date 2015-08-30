// Run the module tests from hellojs
// 

// Setup tests
var dear = require('../../../index');
global.expect = require('expect.js');

// Overwrite the request
var request = require('../../../src/utils/request');
var _request = request.fn;
var fs = require('fs');

require("define");

describe("API Mocks", function(){

	before(function(){
		request.fn = function(req){
			var stub, suffix = '';
			if (req.stub) {
				stub = req.stub;
			}
			else{
				if (req.options.stubType) {
					suffix += '-unauth';
				}
				stub = req.network+'/'+req.method+'/'+req.path+suffix+'.json';
			}
			var path = 'hellojs/tests/specs/stubs/'+stub;
			var data;
			try{
				data = require(path);
			}
			catch(e) {
				data = fs.readFileSync("node_modules/" + path).toString();
			}
			this.on = function(_event, handler){
				if(_event.match(/\b(end|error)\b/)){
					setTimeout(function(){
						handler(data);
					});
				}
				return this;
			};
			return this;
		};
	});

	after(function(){
		request.fn = _request;
	});

	require("hellojs/tests/specs/unit/modules/index");
});