// DataURI to Blob
// Converts a Data-URI to a Blob string

module.exports = function(){
	var reg = /^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i;
	var m = dataURI.match(reg);
	if(!m){
		return dataURI;
	}
	var binary = atob(dataURI.replace(reg,''));
	var array = [];
	for(var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	return new Blob([new Uint8Array(array)], {type: m[1]});
};