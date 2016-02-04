'use strict';

require('./src/auth-client/authClient.module');
require('./src/auth-client/services/authenticate-service');
require('./src/auth-client/services/authorize-service');

module.exports = 'authClient'; //this is the name of the angularjs module that 'contains' all of the controllers and directives
