describe('authorize', function() {

  var $httpBackend, authorize, authRequestHandler;

  // load the module
  beforeEach(module('authClient.services'));

  beforeEach(inject(function($injector, baseUrl) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    authRequestHandler = $httpBackend.when('GET', function(url) {
      var pattern = baseUrl.getBaseUrl()+'/user/authorize';
      return url.substr(0, pattern.length) === pattern;
    }).respond(function(method, url, data, headers, params) {
        console.log('GET',url);
        params = url.split('?')[1];
        params = params.split('&');
        var search = {};
        for ( var i = 0 ; i < params.length ; i++ ) {
          var x = params[i];
          x = x.split('=');
          search[x[0]] = x[1];
        }
        params = search;
        if ( !params || !params.jwt || !params.service ) {
          console.log('500 ERROR');
          return [500, null];
        }
        if ( params.jwt === 'auth-ok' && params.service === 'test-service' ) {
          console.log('200 GOT PERMS');
          return [200, {permissions: {access:true}, token: 'perm-ok'}];
        } else {
          console.log('200 AUTH ERR');
          return [200, {permissions: {access:false}}];
        }
      });
  }));

  // inject the service
  beforeEach(inject(function(_baseUrl_, _authorize_ ) {
    authorize = _authorize_;
    baseUrl = _baseUrl_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function() {
    expect(authorize).to.be.ok;
  });

  it('should have a method called check', function() {
    expect(authorize.check).to.be.a('function');
  });

  it('should call the API with check', function() {
    $httpBackend.expectGET(baseUrl.getBaseUrl()+'/user/authorize?jwt=auth-ok&service=test-service');
    authorize.check('auth-ok','test-service');
    $httpBackend.flush();
  });

  it('should return permissions and token when authorized', function() {
    $httpBackend.expectGET(baseUrl.getBaseUrl()+'/user/authorize?jwt=auth-ok&service=test-service');
    var resp = authorize.check('auth-ok','test-service');
    resp.then(function(ret) {
      expect(ret.permissions.access).to.equal(true);
      expect(ret.token).to.equal('perm-ok');
    });
    $httpBackend.flush();
  });

  it('bad-auth should return unauthenticated', function() {
    $httpBackend.expectGET(baseUrl.getBaseUrl()+'/user/authorize?jwt=auth-bad&service=test-service');
    var resp = authorize.check('auth-bad','test-service');
    resp.then(null, function(resp) {
      expect(resp).to.exist;
      expect(resp).to.be.empty;
    });
    $httpBackend.flush();
  });


});
