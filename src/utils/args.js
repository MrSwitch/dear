//
// Args utility
// Makes it easier to assign parameters, where some are optional
// @param o object
// @param a arguments
//
module.exports = function(o,args){

	var p = {},
		i = 0,
		t = null,
		x = null;
	
	// define x
	// x is the first key in the list of object parameters
	for(x in o){if(o.hasOwnProperty(x)){
		break;
	}}

	// Passing in hash object of arguments?
	// Where the first argument can't be an object
	if((args.length===1)&&(typeof(args[0])==='object')&&o[x]!='o!'){

		// Could this object still belong to a property?
		// Check the object keys if they match any of the property keys
		for(x in args[0]){if(o.hasOwnProperty(x)){
			// Does this key exist in the property list?
			if( x in o ){
				// Yes this key does exist so its most likely this function has been invoked with an object parameter
				// return first argument as the hash of all arguments
				return args[0];
			}
		}}
	}

	// else loop through and account for the missing ones.
	for(x in o){if(o.hasOwnProperty(x)){

		t = typeof( args[i] );

		if( ( typeof( o[x] ) === 'function' && o[x].test(args[i]) ) || ( typeof( o[x] ) === 'string' && (
				( o[x].indexOf('s')>-1 && t === 'string' ) ||
				( o[x].indexOf('o')>-1 && t === 'object' ) ||
				( o[x].indexOf('i')>-1 && t === 'number' ) ||
				( o[x].indexOf('a')>-1 && t === 'object' ) ||
				( o[x].indexOf('f')>-1 && t === 'function' )
			) )
		){
			p[x] = args[i++];
		}
		
		else if( typeof( o[x] ) === 'string' && o[x].indexOf('!')>-1 ){
			// ("Whoops! " + x + " not defined");
			return false;
		}
	}}
	return p;
};