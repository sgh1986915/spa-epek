define(['chai', 'app/services/pending-services'], function (chai, pendingServices) {
describe('pending services', function () {
    var expect = chai.expect;
    var should = chai.should();

    describe('when running pending services', function () {
        var $rootScope,
            localeInvoked;
        beforeEach(function () {
            localeInvoked = false;
            $rootScope = {};
            var locale = {
                init: function () { localeInvoked = true; }
            };
            pendingServices.init($rootScope, locale);
        });

        it('should setup pending services', function () {
            $rootScope.pendingServices.should.eql(['locale']);
        });

        it('should expose serviceReady call', function() {
            expect($rootScope.serviceReady).to.be.defined;
        });
         
        it('should invoke locale service fn', function () {
            localeInvoked.should.be.true;
        });
    });

    describe('when invoking serviceReady', function () {
        var $rootScope;
        beforeEach(function () {
            var localeInvoked = false;
            $rootScope = {
                pendingServices: ['locale', 'meh']
            };
            var locale = {
                init: function () {}
            };
            pendingServices.init($rootScope, locale);
        });

        it('should be removed from the collection', function () {
            $rootScope.serviceReady('locale');
            $rootScope.pendingServices.should.eql(['meh']);
        });

    });

});
});
