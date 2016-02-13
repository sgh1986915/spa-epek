// TODO: under construction

define(['angular-mocks', 'app/services/wallet-service'], function (chai) {
    describe('locale', function () {

        var $httpBackend, subject, scope;
        beforeEach(module('epek.services'));

        describe('Get payment ID', function () {
            beforeEach(inject(function (_$httpBackend_, $rootScope, wallet) {
                subject = wallet;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET('http://wallet.api.epek.com/getPaymentId').respond({});

                scope = $rootScope.$new();
            }));

            describe('getPaymentId', function () {
                it('should invoke get request', function () {
                    subject.getPaymentId();
                    $httpBackend.flush();
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });
            });
        });

        describe('PayPal oAuth', function () {
            beforeEach(inject(function (_$httpBackend_, $rootScope, wallet) {
                subject = wallet;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET('http://wallet.api.epek.com/paypalOauth').respond({});

                scope = $rootScope.$new();
            }));

            describe('paypalOauth', function () {
                var url = 'http://epek.com';
                it('should invoke get request', function () {
                    subject.paypalOauth(url, url);
                    $httpBackend.flush();
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });
            });
        });

        describe('Update Payment Id', function () {
            beforeEach(inject(function (_$httpBackend_, $rootScope, wallet) {
                subject = wallet;
                $httpBackend = _$httpBackend_;
                $httpBackend.expectPOST('http://wallet.api.epek.com/updatePaymentId').respond({});

                scope = $rootScope.$new();
            }));

            describe('updatePaymentId', function () {
                it('should invoke get request', function () {
                    subject.updatePaymentId({});
                    $httpBackend.flush();
                    $httpBackend.verifyNoOutstandingExpectation();
                    $httpBackend.verifyNoOutstandingRequest();
                });
            });
        });
    });
});