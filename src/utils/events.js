
var separator = /[\s\,]+/;



module.exports = function(){

	// If this doesn't support getProtoType then we can't get prototype.events of the parent
	// So lets get the current instance events, and add those to a parent property
	this.parent = {
		events : this.events,
		findEvents : this.findEvents,
		parent : this.parent
	};


	this.events = {};


	//
	// On, Subscribe to events
	// @param evt		string
	// @param callback	function
	//
	this.on = function(evt, callback){

		if(callback&&typeof(callback)==='function'){
			var a = evt.split(separator);
			for(var i=0;i<a.length;i++){

				// Has this event already been fired on this instance?
				this.events[a[i]] = [callback].concat(this.events[a[i]]||[]);
			}
		}

		return this;
	};


	//
	// Off, Unsubscribe to events
	// @param evt		string
	// @param callback	function
	//
	this.off = function(evt, callback){

		this.findEvents(evt, function(name, index){
			if( !callback || this.events[name][index] === callback){
				this.events[name][index] = null;
			}
		});

		return this;
	};

	//
	// Emit
	// Triggers any subscribed events
	//
	this.emit = function(evt /*, data, ... */){

		// Get arguments as an Array, knock off the first one
		var args = Array.prototype.slice.call(arguments, 1);
		args.push(evt);

		// Handler
		var handler = function(name, index){

			// Replace the last property with the event name
			args[args.length-1] = (name === '*'? evt : name);

			// Trigger
			this.events[name][index].apply(this, args);
		};

		// Find the callbacks which match the condition and call
		var proto = this;
		while( proto && proto.findEvents ){

			// Find events which match
			proto.findEvents(evt + ',*', handler);

			// proto = this.utils.getPrototypeOf(proto);
			proto = proto.parent;
		}

		return this;
	};

	this.findEvents = function(evt, callback){

		var a = evt.split(separator);

		for(var name in this.events){if(this.events.hasOwnProperty(name)){

			if( a.indexOf(name) > -1 ){

				for(var i=0;i<this.events[name].length;i++){

					// Does the event handler exist?
					if(this.events[name][i]){
						// Emit on the local instance of this
						callback.call(this, name, i);
					}
				}
			}
		}}
	};

	return this;
	
};