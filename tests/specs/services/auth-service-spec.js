define(['angular-mocks', 'app/services/auth-service'], function () {
//yeah, this needs to be implemented
describe('auth-service', function () {

    var $httpBackend, subject, scope,
        ROOT = 'http://signin.api.epek.com/',
        testUser = {
            userId: 1,
            password: 'test',
            email: 'test@test.com',
            captchaChallenge: 'xxx',
            captchaResponse: 'xxx'
        };

    beforeEach(module('epek.services'));

    describe('discover', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(ROOT + 'discover').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('discover', function () {
            it('should invoke POST request to discover api', function () {
                subject.discover('test@test.com', {});
                $httpBackend.flush();
            });
        });
    });

    describe('registerUserId', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(ROOT + 'registerUserId').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('registerUserId', function () {
            it('should invoke POST request to registerUserId api', function () {
                subject.registerUserId(testUser);
                $httpBackend.flush();
            });
        });
    });

    describe('checkUsernameAvailability', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(ROOT + 'checkUsernameAvailability?email=test%40test.com&userId=test').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('checkUsernameAvailability', function () {
            it('should invoke GET request to checkUsernameAvailability api', function () {
                subject.checkUsernameAvailability('test', 'test@test.com');
                $httpBackend.flush();
            });
        });
    });

    describe('forgotPassword', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(ROOT + 'forgotPassword').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('forgotPassword', function () {
            it('should invoke POST request to forgotPassword api', function () {
                subject.forgotPassword('test@test.com', 'xxx', 'xxx');
                $httpBackend.flush();
            });
        });
    });

    describe('confirmEmail', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET(ROOT + 'confirmEmail?token=token').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('confirmEmail', function () {
            it('should invoke GET request to confirmEmail api', function () {
                subject.confirmEmail('token');
                $httpBackend.flush();
            });
        });
    });

    describe('authUserId', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(ROOT + 'authUserId').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('authUserId', function () {
            it('should invoke POST request to authUserId api', function () {
                subject.authUserId('test@test.com', 'xxx');
                $httpBackend.flush();
            });
        });
    });

    describe('resetPassword', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(ROOT + 'resetPassword').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('resetPassword', function () {
            it('should invoke POST request to resetPassword api', function () {
                subject.resetPassword(testUser);
                $httpBackend.flush();
            });
        });
    });

    describe('changePassword', function () {

        beforeEach(inject(function (_$httpBackend_, $rootScope, auth) {
            subject = auth;
            $httpBackend = _$httpBackend_;
            $httpBackend.expectPOST(ROOT + 'changePassword').respond({});

            scope = $rootScope.$new();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('changePassword', function () {
            it('should invoke POST request to changePassword api', function () {
                subject.changePassword(testUser);
                $httpBackend.flush();
            });
        });
    });

});
});