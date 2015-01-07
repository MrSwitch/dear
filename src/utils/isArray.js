//
// isArray
//
module.exports = function (o){
	return Object.prototype.toString.call(o) === '[object Array]';
};