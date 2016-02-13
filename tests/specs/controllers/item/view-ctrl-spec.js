define(['angular-mocks', 'app/controllers/item/view-ctrl'], function () {
describe('item view controller', function() {

    var fixedPriceInfoMock = {"locale":{"countryCode":"AO","currencyId":"AOA","currencySymbol":"AOA"},"categoryId":["1","2"],"title":"FixedPriceItem","sellerId":"nikolay","listingType":"fixedPrice","paymentService":{"online":["paypal"],"offline":[]},"startTime":"2012-12-20T09:19:27+00:00","endTime":"2012-12-24T09:19:27+00:00","shipping":[{"shippingService":"someservice","dispatchTimeMax":"4","shippingCost":"19.99"}],"titleSlug":"fixedpriceitem","variations":[{"fixedPrice":19.99,"quantity":1,"color":"red","size":20.0}]};
    var fixedPriceDescriptionMock = {description: 'description'};

    var unauthStatusMock = {"callStatus":{"status":"failure","error":{"errorType":"systemError","errorCode":"auth","severityCode":"error","message":"User not authenticated"},"timestamp":"1/2/13 5:26 PM"}};
    var authStatusMock = {"version":"2-0-0","callStatus":{"status":"success","error":[null],"timestamp":"2013-01-08T10:01:56+00:00"},"response":{"facebookAuth":false,"twitterAuth":true}};
    var getAuthTokenMock = {"version":"2-0-0","callStatus":{"status":"success","error":[null],"timestamp":"2013-01-08T10:01:56+00:00"},"response":{"facebookAuthURL":"https://www.facebook.com/dialog/oauth?client_id\u003d303050809746432\u0026redirect_uri\u003dhttp%3A%2F%2Fsocial.api.epek.com%2Foauthcallback%3Fservice%3Dfacebook\u0026scope\u003dpublish_stream"}};

    var rootScope;
    var scope;
    var controller;
    var $httpBackend;


    beforeEach(function () {
        module('epek.controllers');

        module(function($provide) {
            $provide.value('windowLocation', {
                replace: function(url) {
                    this.url = url;
                }
            });
        });
        inject(function (_$httpBackend_, $rootScope, $controller) {
            // prepare backend to catch this requests
            $httpBackend = _$httpBackend_;
            $httpBackend.expect('GET', 'http://item.epek.com/nikolay/fixedpriceitem/info').respond(200, fixedPriceInfoMock);
            $httpBackend.expect('GET', 'http://item.epek.com/nikolay/fixedpriceitem/description.txt.json').respond(200, fixedPriceDescriptionMock);

            // save rootScope
            rootScope = $rootScope;
            
            // start controller
            scope = $rootScope.$new();
            subject = $controller('itemView', {
                $scope: scope, 
                $routeParams: {sellerId: 'nikolay', slug: 'fixedpriceitem'}, 
                $rootScope: rootScope
            });
        });
    });
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }); 

    describe('check if controller gets initialized', function () {
        it('should have title and description from mock data', function() {

            // execute all async requests
            $httpBackend.flush();
            
            // check
            expect(scope.info.title).toBe('FixedPriceItem');
            expect(scope.description).toBe('description');
        });
    });

    describe('check sharing', function() {
        it('should show dialog for unauthenticated user', function() {
            $httpBackend.expect('GET', 'http://social.api.epek.com/authorizationStatus').respond(200, unauthStatusMock);
            scope.showShareDialog();
            // execute all async requests
            $httpBackend.flush();

            expect(scope.shareDialogForUnauthenticated).toBe(true);
        });

        it('should show share dialog for authenticated user', function() {
            $httpBackend.expect('GET', 'http://social.api.epek.com/authorizationStatus').respond(200, authStatusMock);
            scope.showShareDialog();
            // execute all async requests
            $httpBackend.flush();

            expect(scope.shareDialogForAuthenticated).toBe(true);
            expect(scope.shareAuth.facebook).toBe(false);
            expect(scope.shareAuth.twitter).toBe(true);
        });

        it('should redirect to facebook for authorization', inject(function(windowLocation) {
            $httpBackend.expect('GET', 'http://social.api.epek.com/authorizationStatus').respond(200, authStatusMock);
            scope.showShareDialog();
            $httpBackend.flush();
            
            $httpBackend.expect('GET', 'http://social.api.epek.com/getAuthToken?redirectURL=http%3A%2F%2Flocalhost%3A9876%2Fcontext.html&service=facebook').respond(200, getAuthTokenMock);
            scope.shareOnFacebook();
            $httpBackend.flush();

            expect(scope.redirectURL.indexOf('www.facebook.com') >= 0).toBe(true);
            expect(windowLocation.url.indexOf('www.facebook.com') >= 0).toBe(true);
        }));

        it('should send POST-request to social API', function() {
            $httpBackend.expect('GET', 'http://social.api.epek.com/authorizationStatus').respond(200, authStatusMock);
            scope.showShareDialog();
            $httpBackend.flush();

            $httpBackend.expectPOST('http://social.api.epek.com/share').respond(200);
            scope.shareOnTwitter();
            $httpBackend.flush();
        });

        it('should sent POST-request to remove auth permissions', function() {
            $httpBackend.expect('GET', 'http://social.api.epek.com/authorizationStatus').respond(200, authStatusMock);
            scope.showShareDialog();
            $httpBackend.flush();

            $httpBackend.expectPOST('http://social.api.epek.com/removeAuthorization').respond(200);
            $httpBackend.expectPOST('http://social.api.epek.com/removeAuthorization').respond(200);
            scope.removeAuthorization();
            $httpBackend.flush();

            expect(scope.shareAuth.facebook).toBe(false);
            expect(scope.shareAuth.twitter).toBe(false);
        });
    });
});

});
