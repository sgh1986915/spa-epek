define(['angular-mocks', 'app/services/image-upload-service'], function () {
describe('image', function () {
    beforeEach(module('epek.services'));

    var subject;
    var scope;
    var $httpBackend;

    beforeEach(inject(function (_$httpBackend_, $rootScope, imageUpload) {
        subject = imageUpload;
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://uploadimg.api.epek.com/deleteImage').respond();

        scope = $rootScope.$new();
    }));


    describe('deleteImage', function () {
        it('should fire a get request', function () {
            subject.deleteImage.get();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        })
    });
});
});
