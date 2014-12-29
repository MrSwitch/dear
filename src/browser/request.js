//
// Request
//
module.exports = function(){
	// request function
	return module.exports.fn.apply(this, arguments);
};

module.exports.fn = function(){
	console.log('REQUEST');
	return;
};