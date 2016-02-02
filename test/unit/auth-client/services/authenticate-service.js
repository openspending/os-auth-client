describe('authenticate', function() {

  var $httpBackend, authenticate, authRequestHandler, $localStorage, $location, $browser;

  // load the module
  beforeEach(module('authClient.services'));

  beforeEach(inject(function($injector, baseUrl) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    authRequestHandler = $httpBackend.when('GET', function(url) {
      var pattern = baseUrl.getBaseUrl()+'/oauth/check';
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
        if ( !params || !params.next ) {
          console.log('500 ERROR');
          return [500, null];
        }
        if ( params && params.jwt === 'auth-ok' ) {
          console.log('200 AUTH OK');
          return [200, {authenticated: true}];
        } else {
          console.log('200 AUTH ERR');
          return [200, {authenticated: false, providers: {google: 'http://google-url'}}];
        }
      });
    $localStorage = $injector.get('$localStorage');
    $localStorage.$reset();
    $location = $injector.get('$location');
    $browser = $injector.get('$browser');
  }));

  // inject the service
  beforeEach(inject(function(_baseUrl_, _authenticate_ ) {
    authenticate = _authenticate_;
    baseUrl = _baseUrl_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function() {
    expect(authenticate).to.be.ok;
  });

  it('should have a method called check', function() {
    expect(authenticate.check).to.be.a('function');
  });

  it('should call the API with check', function() {
    $httpBackend.expectGET(baseUrl.getBaseUrl()+'/oauth/check?next=next-url');
    authenticate.check('next-url');
    $httpBackend.flush();
  });

  it('should return the jwt from the URL', function() {
    $location.search({jwt:'auth-ok'});
    $browser.poll();
    $httpBackend.expectGET(baseUrl.getBaseUrl()+'/oauth/check?jwt=auth-ok&next=next-url');
    var resp = authenticate.check('next-url');
    resp.then(function(jwt) {
      expect(jwt).to.equal('auth-ok');
      expect($localStorage.jwt).to.equal('auth-ok');
    });
    $httpBackend.flush();
  });

  it('bad-auth should return unauthenticated', function() {
    $location.search({jwt:'auth-bad'});
    $browser.poll();
    $httpBackend.expectGET(baseUrl.getBaseUrl()+'/oauth/check?jwt=auth-bad&next=next-url');
    var resp = authenticate.check('next-url');
    resp.then(null, function(providers) {
      expect(providers).to.exist;
      expect(providers.google).to.exist;
    });
    $httpBackend.flush();
  });


});
