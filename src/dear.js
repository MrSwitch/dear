//
// dear.js
//

var Events = require('./utils/events');


function dear(network){

	return dear.use(network);
}


// Events
Events.call(dear);


// Default settings

dear.settings = {};


// Internal collection of services

dear.services = {};


// Use this to intiiate services

dear.init = require('./methods/init');


// Set a new instance

dear.use =  require('./methods/use');


// API

dear.api = require('./methods/api');



module.exports = dear;