//
// Windows
//
module.exports = {
	// API Base URL
	base : 'https://apis.live.net/v5.0/',

	// Map GET requests
	get : {
		"me"	: "me",
	},

	wrap : {
		me : function(o, headers, req){
			formatUser(o, headers, req);
			return o;
		}
	}
};


function formatUser(o, headers, req){
	if(o.id){
		var token = req.query.access_token;
		if(o.emails){
			o.email =  o.emails.preferred;
		}
		// If this is not an non-network friend
		if(o.is_friend!==false){
			// Use the id of the user_id if available
			var id = (o.user_id||o.id);
			o.thumbnail = o.picture = 'https://apis.live.net/v5.0/'+id+'/picture?access_token='+token;
		}
	}
}