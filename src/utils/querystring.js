//
// querystring
//

var isEmpty = require('./isEmpty');
var param = require('./param');

module.exports = function(url, params){
	if(params){
		var reg;
		for(var x in params){
			if(url.indexOf(x)>-1){
				var str = "[\\?\\&]"+x+"=[^\\&]*";
				reg = new RegExp(str);
				url = url.replace(reg,'');
			}
		}
	}
	return url + (!isEmpty(params) ? ( url.indexOf('?') > -1 ? "&" : "?" ) + param(params) : '');
};