define(['angular-mocks', 'app/services/catalog-service'], function (chai) {
describe('locale', function () {

    var $httpBackend, subject, scope;

    beforeEach(module('epek.services'));

    describe('catalog service', function () {
        beforeEach(inject(function (_$httpBackend_, $rootScope, catalog) {
            subject = catalog;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('http://catalog.epek.com/epek/en-US/Root').respond({});

            scope = $rootScope.$new();
        }));

        describe('getCategory', function () {
            it('should invoke get request', function () {
                subject.getCategory('en-US', 'Root');
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });
        });
    });
});
});