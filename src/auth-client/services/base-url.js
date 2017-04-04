angular.module('authClient.services')
  .service('baseUrl', function() {
    var _baseUrl = '//next.openspending.org';

    this.setBaseUrl = function(baseUrl) {
      _baseUrl = baseUrl;
    };

    this.getBaseUrl = function() {
      return _baseUrl;
    };
  });
