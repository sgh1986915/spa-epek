define(['chai', 'app/services/cookie-service'], function (chai, Cookies) {
    var should = chai.should();
    describe('cookie-service', function () {
        var sut;
        beforeEach(function () {
            sut = new Cookies({COOKIE_DOMAIN: undefined});
        });
        describe('getting and putting a simple cookie', function () {
            it('should store and retrieve okay', function () {
                sut.put('simple', 'epeK');
                expect(sut.get('simple')).toBe('epeK')
            });

        });
        describe('getting and putting an complex cookie', function () {
            it('should store and retrieve okay', function () {
                sut.put('complex', {a:1,b:'2'});
                sut.get('complex').should.eql({a:1,b:'2'});
            });

        });

    });

});
