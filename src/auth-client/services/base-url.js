angular.module('authClient.services')
  .service('baseUrl', function() {
    var _baseUrl = 'http://s145.okserver.org';

    this.setBaseUrl = function(baseUrl) {
      _baseUrl = baseUrl;
    };

    this.getBaseUrl = function() {
      return _baseUrl;
    };
  });
