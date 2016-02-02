(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('authClient.config', [])
      .value('authClient.config', {
          debug: true
      });

  // Modules
  angular.module('authClient.services', ['ngStorage']);
  angular.module('authClient',
      [
          'authClient.config',
          'authClient.services',
          'ngResource',
          'ngCookies'
      ]);

})(angular);

angular.module('authClient.services')
  .service('authenticate',
    function($localStorage, $http, $location, $q, baseUrl) {

      var that = this;

      this.getToken = function() {
        return $localStorage.jwt;
      };

      this.check = function(next) {
        return $q(function(resolve, reject) {
          var jwt = that.getToken();
          if ( !jwt ) {
            jwt = $location.search().jwt;
            if (jwt) {
              $localStorage.jwt = jwt;
            }
          }
          var config = {params:{next:next}};
          jwt = that.getToken();
          if ( jwt ) {
            config.params.jwt = jwt;
          }
          $http
            .get(baseUrl.getBaseUrl()+'/oauth/check', config)
            .then(function(response) {
              var data = response.data;
              if ( data.authenticated ) {
                resolve(jwt);
              } else {
                reject(data.providers);
              }
          });
        });
      };
    });


angular.module('authClient.services')
  .service('authorize',
    function($http, $q, baseUrl) {

      this.check = function(token, service) {
        return $q(function(resolve, reject) {
          var config = {params:{jwt:token, service:service}};
          $http
            .get(baseUrl.getBaseUrl()+'/permit/check', config)
            .then(function(response) {
              var data = response.data;
              resolve(data);
            }, function() {
              reject({});
            });
        });
      };
    });


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
