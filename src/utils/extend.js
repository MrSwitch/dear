//
// Extend
//

module.exports = extend;


function extend(r /*, a[, b[, ...]] */){

	// Get the arguments as an array but ommit the initial item
	var args = Array.prototype.slice.call(arguments,1);

	for(var i=0;i<args.length;i++){
		var a = args[i];
		if( r instanceof Object && a instanceof Object && r !== a ){
			for(var x in a){
				//if(a.hasOwnProperty(x)){
				r[x] = extend( r[x], a[x] );
				//}
			}
		}
		else{
			r = a;
		}
	}
	return r;
}