//
// Facebook service
//

module.exports = {

	// API Base URL
	base : 'https://graph.facebook.com/',

	// Map GET requests
	get : {
		'me' : 'me',
	},

	wrap : {
		me : formatUser,
	},

	// special requirements for handling XHR
	xhr : function(p){
		if(p.method==='get'||p.method==='post'){
			p.headers['Content-Type'] = 'application/json';
			p.query.suppress_response_codes = true;
		}
	}
};


function formatUser(o){
	if(o.id){
		o.thumbnail = o.picture = 'http://graph.facebook.com/'+o.id+'/picture';
	}
	return o;
}