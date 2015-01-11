
# dear web apis

`dear` is a npm package which standardizes requests to many known API's. It inherits endpoints used by the [HelloJS](http://adodson.com/hello.js) project and makes them available within Node environments.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]


# methods

* `dear.init` - Configure a web service
* `dear.api` - Make HTTP requests



# use case

A typical use case might be to verify a users email address. If you have signed the user in the browser (via HelloJS for example) the client will have received an OAuth2 "access_token". This token can be used to make API requests for the data in the server. So, if the token can be delievered to the server, then the users credentials can be verified.

Below is an illustration of some ConnectJS/ExpressJS middleware which will store the users verified email address.

	
	var dear = require('dear');

	... // setup connectjs

	app.get('register', function(){

		var token = req.params.access_token;
		var network = req.params.network;

		dear( network )
		.api('me', {
			access_token: token
		})
		.then(function(response){

			var email = response.email;

			// do something with the verified email address
		});

	});

For example the request would look like `HTTP /register?access_token=1212121&network=facebook`



# setup


## Signing OAuth1 requests

OAuth1 is supported by a number of services. These must be signed with a secret key to create a unique requests each and every time. Therefore for those we must register the secret before making any API requests.

	dear.init({
		yahoo : {
			client_id : 'registered app id',
			client_secret : 'ssssssshhhhh'
		}
	});


If HelloJS was *not* used to generate the `access_token`'s for an OAuth1 service. Then a single 'access_token' needs to to be created. `dear` will correctly sign OAuth1 requests when the access_token presented has the format "oauth_token:oauth_token_secret@oauth_consumer_key".



# specs / docs

For requests made by `dear.api` please refer to [hello.api](http://adodson.com/hello.js/#helloapi).

The specs of `dear` methods are defined in [Travis CI](https://travis-ci.org/MrSwitch/dear).



# note

This project inherits code from a clientside javascript project [HelloJS](https://github.com/MrSwitch/hello.js). It is therefore neccessary to include `hello` in the global namespace. It is hoped that this will no longer be the case in future.


[npm-image]: https://img.shields.io/npm/v/dear.svg?style=flat&branch=master
[npm-url]: https://npmjs.org/package/dear
[travis-image]: https://img.shields.io/travis/MrSwitch/dear.svg?style=flat
[travis-url]: https://travis-ci.org/MrSwitch/dear
