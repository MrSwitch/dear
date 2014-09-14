//
// Create a standard error object
//


module.exports = function(code,message){
	var self = this;
	process.nextTick(function(){
		self.emit('error complete',{
			error : {
				code : code,
				message : message
			}
		});
	},0);
	return this;
};