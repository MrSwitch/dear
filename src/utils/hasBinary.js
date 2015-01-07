
//
// Some of the providers require that only MultiPart is used with non-binary forms.
// This function checks whether the form contains binary data
module.exports = function (data){
	for(var x in data ) if(data.hasOwnProperty(x)){
		if( isBinary(data[x]) ){
			return true;
		}
	}
	return false;
};


// Determines if a variable Either Is or like a FormInput has the value of a Blob
function isBinary(data){

	return data instanceof Object && (
			(this.domInstance('input', data) && data.type === 'file') ||
			("FileList" in window && data instanceof window.FileList) ||
			("File" in window && data instanceof window.File) ||
			("Blob" in window && data instanceof window.Blob));

}