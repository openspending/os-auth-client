describe('authenticate', function() {

  var authenticate;

  // load the module
  beforeEach(module('authClient.services'));

  // inject the service
  beforeEach(inject(function(_authenticate_) {
    authenticate = _authenticate_;
  }));

  it('should exist', function() {
    expect(authenticate).to.be.ok;
  });

  it('should have a method called foo', function() {
    expect(authenticate.check).to.be.a('function');
  });

});
