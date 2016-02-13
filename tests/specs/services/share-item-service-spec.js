define(['angular-mocks', 'app/services/share-item-service'], function () {
describe('share item', function () {
    beforeEach(module('epek.services'));

    var subject;
    var scope;
    var $httpBackend;

    beforeEach(inject(function (_$httpBackend_, $rootScope, shareItem) {
        subject = shareItem;
        $httpBackend = _$httpBackend_;

        scope = $rootScope.$new();
    }));


    describe('share item', function() {
        it('should fire a get request to authorization status', function() {
            $httpBackend.expectGET('http://social.api.epek.com/authorizationStatus').respond();
            
            subject.getAuthorizationStatus().then();

            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();

        });

        it('should fire a get request to fetch auth tokens', function() {
            $httpBackend.expectGET('http://social.api.epek.com/getAuthToken?redirectURL=&service=facebook%2Ctwitter').respond();
            
            subject.getAuthToken(['facebook', 'twitter'], '').then();

            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should fire a post request to remove authorization', function() {
            $httpBackend.expectPOST('http://social.api.epek.com/removeAuthorization').respond();
            
            subject.removeAuthorization('facebook').then();

            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should fire a post request to post message', function() {
            $httpBackend.expectPOST('http://social.api.epek.com/share').respond();
            
            subject.share('twitter', 'http://ekek.com/#/item/view/nikolay/fixedpriceitem').then();

            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        
    });
});
});
