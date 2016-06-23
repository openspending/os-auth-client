angular.module('authClient.services')
  .service('authorize', ['$http', '$q', 'baseUrl',
    function($http, $q, baseUrl) {

      this.check = function(token, service) {
        return $q(function(resolve, reject) {
          var config = {
            params: {jwt:token, service:service},
            withCredentials: false
          };
          $http
            .get(baseUrl.getBaseUrl()+'/user/authorize', config)
            .then(function(response) {
              var data = response.data;
              resolve(data);
            }, function() {
              reject({});
            });
        });
      };
    }]);

