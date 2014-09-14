//
// Google service
//


module.exports = {

	// API base URI
	base : "https://www.googleapis.com/",

	// Map GET requests
	get : {
		'me'	: "plus/v1/people/me",
	},

	wrap : {
		'me'	: function(o){
			if(o.id){
				o.last_name = o.family_name || (o.name? o.name.familyName : null);
				o.first_name = o.given_name || (o.name? o.name.givenName : null);

				if( o.emails && o.emails.length ){
					o.email = o.emails[0].value;
				}

				formatPerson(o);
			}
			return o;
		}
	}
};




function formatPerson(o){
	o.name = o.displayName || o.name;
	o.picture = o.picture || ( o.image ? o.image.url : null);
	o.thumbnail = o.picture;
}