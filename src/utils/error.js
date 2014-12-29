//
// Create a standard error object
//


module.exports = function(code,message){
	var promise = this;
	process.nextTick(function(){
		promise.reject({
			error : {
				code : code,
				message : message
			}
		});
	},0);
	return this;
};