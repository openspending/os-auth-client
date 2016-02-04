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
          'authClient.services'
      ]);

})(angular);
