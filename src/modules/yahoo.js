//
// Yahoo
//
module.exports = {

	// Ensure that you define an oauth_proxy
	oauth : {
		version : "1.0a",
		auth	: "https://api.login.yahoo.com/oauth/v2/request_auth",
		request : 'https://api.login.yahoo.com/oauth/v2/get_request_token',
		token	: 'https://api.login.yahoo.com/oauth/v2/get_token'
	},

	base	: "https://social.yahooapis.com/v1/",

	get : {
		"me"	: yql('select * from social.profile(0) where guid=me')
	},

	wrap : {
		me : function(o){
			formatError(o);
			if(o.query&&o.query.results&&o.query.results.profile){
				o = o.query.results.profile;
				o.id = o.guid;
				o.name = o.givenName + ' ' +o.familyName;
				o.last_name = o.familyName;
				o.first_name = o.givenName;
				o.email = o.emails?o.emails.handle:null;
				o.thumbnail = o.image?o.image.imageUrl:null;
			}
			return o;
		},
	}
};

function yql(q){
	return 'https://query.yahooapis.com/v1/yql?q=' + (q + ' limit @{limit|100} offset @{start|0}').replace(/\s/g, '%20') + "&format=json";
}

function formatError(o){
	if(o && "meta" in o && "error_type" in o.meta){
		o.error = {
			code : o.meta.error_type,
			message : o.meta.error_message
		};
	}
}