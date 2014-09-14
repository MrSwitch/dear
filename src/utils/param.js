//
// Param
// Explode/Encode the parameters of an URL string/object
// @param string s, String to decode
//
module.exports = function(s){
	var b,
		a = {},
		m;
	
	if(typeof(s)==='string'){

		m = s.replace(/^[\#\?]/,'').match(/([^=\/\&]+)=([^\&]+)/g);
		if(m){
			for(var i=0;i<m.length;i++){
				b = m[i].match(/([^=]+)=(.*)/);
				a[b[1]] = decodeURIComponent( b[2] );
			}
		}
		return a;
	}
	else {
		var o = s;
	
		a = [];

		for( var x in o ){if(o.hasOwnProperty(x)){
			if( o.hasOwnProperty(x) ){
				a.push( [x, o[x] === '?' ? '?' : encodeURIComponent(o[x]) ].join('=') );
			}
		}}

		return a.join('&');
	}
};