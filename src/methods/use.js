//
// dear use, creates a new instance

var Events = require('../utils/events');

module.exports = function(network){


	// Create a new instance
	var self = Object.create(this);

	// Create a new settings instance
	self.settings = Object.create(this.settings);

	// Update the settings with a network
	if(network){
		self.settings.default_service = network;
	}

	// Add new events
	Events.call(self);

	return self;

};