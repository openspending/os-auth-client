angular.module('authClient.services')
  .service('authenticate',
    function($localStorage, $http, $location, $q, $window, baseUrl) {

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
          var config = {
              params:{next:next},
              withCredentials: false
          };
          jwt = that.getToken();
          if ( jwt ) {
            config.params.jwt = jwt;
          }
          $http
            .get(baseUrl.getBaseUrl()+'/oauth/check', config)
            .then(function(response) {
              var data = response.data;
              if ( data.authenticated ) {
                resolve({token:jwt, profile:data.profile});
              } else {
                delete $localStorage.jwt;
                reject(data.providers);
              }
          });
        });
      };

      this.login = function(url, target) {
        $window.open( url,  target );
      };
    });

