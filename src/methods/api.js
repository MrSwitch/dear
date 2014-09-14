//
// dear api method
//

var args   = require('../utils/args');
var request   = require('../utils/request');
var extend   = require('../utils/extend');
var error = require('../utils/error');


module.exports = function(){

	// Create a new service

	var self = this.use();


	//
	// Construct the args
	// 

	var p = args({
		path : 's!',
		method : 's',
		data:'o',
		timeout:'i',
		callback:"f"
	}, arguments);


	// There has to be an object
	if(!p){
		return error.call( self, "invalid_arguments", "Could not interpret the incoming parameters" );
	}


	// Default method is GET

	p.method = (p.method || 'get').toLowerCase();


	// Default data = {}

	p.data = p.data || {};


	// Default query = {}

	p.query = p.query || {};


	// Default headers = {}

	p.headers = p.headers || {};


	// Add the callback
	
	if( p.callback ){
		self.on('complete', p.callback);
	}


	// Path
	// Remove the network from path, e.g. facebook:/me/friends
	// results in { network : facebook, path : me/friends }
	
	p.path = p.path ? p.path.replace(/^\/+/,'') : '';

	var a = (p.path.split(/[\/\:]/,2)||[])[0].toLowerCase();



	if(a in self.services){
		p.network = a;
		var reg = new RegExp('^'+a+':?\/?');
		p.path = p.path.replace(reg,'');
	}


	if( !p.path ){
		return error.call( self, "required_path", "Missing the path parameter" );
	}



	// Network & Provider
	// Define the network that this request is made for

	p.network = p.network || self.settings.default_service;


	var provider = self.services[p.network];

	if( !provider ){
		return error.call( self, "invalid_network", "Could not match the service requested: " + p.network );
	}



	// Extrapolate the QueryString
	// Provide a clean path
	// Move the querystring into the data

	if(p.method==='get'){
		var reg = /[\?\&]([^=&]+)(=([^&]+))?/ig,
			m;
		while((m = reg.exec(p.path))){
			p.data[m[1]] = m[3];
		}
		p.path = p.path.replace(/\?.*/,'');
	}


	// URL Mapping
	// Is there a map for the given URL?

	var actions = provider[{"delete":"del"}[p.method]||p.method] || {},
		url = actions[p.path] || actions['default'] || p.path;



	// If the url is a function it needs to be specially handled
	if( typeof( url ) === 'function' ){
		// Process the path in the function
		url = url(p);
	}


	// Format the string if it needs it
	// Replace typical parameters will their counterparts

	url = url.replace(/\@\{([a-z\_\-]+)(\|.+?)?\}/gi, function(m,key,defaults){
		var val = defaults ? defaults.replace(/^\|/,'') : '';
		if(key in p.data){
			val = p.data[key];
			delete p.data[key];
		}
		else if(typeof(defaults) === 'undefined'){
			error.call(self, "missing_attribute_"+key, "The attribute " + key + " is missing from the request" );

			return '';
		}
		return val;
	});



	// Add base
	// if needed

	if( !url.match(/^https?:\/\//) ){
		url = provider.base + url;
	}
	

	// 

	if( p.method === 'get' || p.method === 'delete' ){
		extend( p.query, p.data );
		p.data = {};
	}


	// Make request

	request({
		url : url,
		method : p.method,
		query : p.query,
		data : p.data,
		headers : p.headers,

		// Add the providers processing script
		xhr : provider.xhr

	}).on('uploadprogress', function(res){
		self.emit('uploadprogress', res);
	}).on('progress', function(res){
		self.emit('progress', res);
	}).on('end error', function(r, headers){


		// FORMAT RESPONSE?
		// Does self request have a corresponding formatter
		if( provider.wrap && ( (p.path in provider.wrap) || ("default" in provider.wrap) )){

			var wrap = (p.path in provider.wrap ? p.path : "default");

			// FORMAT RESPONSE
			var b = provider.wrap[wrap](r,headers,p);

			// Has the response been utterly overwritten?
			// Typically self augments the existing object.. but for those rare occassions
			if(b){
				r = b;
			}
		}

		// Is there a next_page defined in the response?
		if( r && "paging" in r && r.paging.next ){
			// Repeat the action with a new page path
			// This benefits from otherwise letting the user follow the next_page URL
			// In terms of using the same callback handlers etc.
			r.paging.next = (r.paging.next.match(/^\?/)?p.path:'') + r.paging.next;
		}

		//
		// Dispatch to listeners
		// Emit events which pertain to the formatted response
		self.emit("complete " + (!r || "error" in r ? 'error' : 'success'), r);

	});


	return self;
};