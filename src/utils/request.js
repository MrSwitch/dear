//
// request
//


var Events	= require('./events'),
	http	= require('http'),
	https	= require('https'),
	URL		= require('url'),
	qs		= require('./querystring'),
	error   = require('./error');


module.exports = function (opts){

	// Format the response as though its for XHR

	if( opts.xhr && typeof( opts.xhr ) === 'function' ){
		opts.xhr(opts);
	}


	// Format the URL request into a string

	var url = qs(opts.url, opts.query||{} );


	// Initiate the Event object

	var self = new Events();


	// Create an HTTP request Object

	var protocol = opts.url.indexOf('https') === 0 ? 'https' : 'http';

//	console.log(url);

	var request = URL.parse(url);
	request.method = opts.method.toUpperCase();



	// Initiate the HTTP request

	var req = (protocol === 'https'? https : http ).request( request, function(res){

		var data = '';
		res.on('data', function(chunk){
			data += chunk;
			self.emit('progress');
		});
		res.on('end', function(){

			// Convert to JSON
			try{
				data = JSON.parse(data);
			}
			catch(e){
				error.call(self, 'server_error', 'Unrecognised response');
				return;
			}

			// Trigger
			self.emit('end', data, res.headers);
		});

	}).on('error', function(){
		error.call(self, 'server_error', 'Could not make connection');
	});



	// Send the HTTP request,
	// There is no more info to give

	req.end();

	return self;
};