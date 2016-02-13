define(['angular-mocks', 'app/services/video-upload-service'], function () {
describe('video', function () {
    beforeEach(module('epek.services'));

    var subject;
    var scope;
    var $httpBackend;
    var uploadData = {
        response: {
            token: 'token',
            uploadUrl: 'http/foo.com/bar'
        }
    };

    beforeEach(inject(function (_$httpBackend_, $rootScope, videoUpload) {
        subject = videoUpload;
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('http://video.api.epek.com/getUploadData').respond(uploadData);

        scope = $rootScope.$new();
    }));


    describe('getUploadData', function () {
        it('should fire a get request', function () {
            subject.uploadData.get();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        })
    });
});
});
