//
// Is Empty
//
module.exports = function (obj){
	// scalar?
	if(!obj){
		return true;
	}

	// Array?
	if(obj && obj.length>0) return false;
	if(obj && obj.length===0) return true;

	// object?
	for (var key in obj) {
		if (obj.hasOwnProperty(key)){
			return false;
		}
	}
	return true;
};