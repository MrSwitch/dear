//
// request
//


var Events	= require('./events'),
	http	= require('http'),
	https	= require('https'),
	URL		= require('url'),
	qs		= require('./querystring'),
	oauth	= require('./oauth'),
	error   = require('./error');


module.exports = function (opts){

	return module.exports.fn.apply(this, arguments);

};


module.exports.fn = function(opts){

	// Format the response as though its for XHR

	if( opts.provider.xhr && typeof( opts.provider.xhr ) === 'function' ){
		opts.provider.xhr(opts, opts.query);
	}


	var url;

	// Do we need to sign this request first?

	if( opts.provider.oauth && parseInt( opts.provider.oauth.version, 10 ) === 1 ){

		// This is an OAuth 1, request and therefore must be signed.
		var client_id		= opts.provider.client_id;
		var client_secret	= opts.provider.client_secret;

		// Sign the OAuth Request
		var token = opts.query.access_token.match(/^([^:]+)\:([^@]+)@(.+)$/);

		delete opts.query.access_token;

		url = qs(opts.url, opts.query||{} );

		if( client_secret && token[1] && token[2] ){
			url = oauth( url,{
				oauth_token: token[1],
				oauth_consumer_key : client_id
			}, client_secret, token[2], null, opts.method.toUpperCase(), opts.data);
		}

	}
	else{

		// Format the URL request into a string

		url = qs(opts.url, opts.query||{} );

	}




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