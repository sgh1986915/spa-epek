define(['angular-mocks', 'app/controllers/sso/forgotPassword-ctrl'], function (chai) {
describe('forgotPassword', function () {
    beforeEach(module('epek.controllers'));

    describe('init', function () {
        var scope;
        beforeEach(function () {
            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('forgotPassword', {$scope: scope});
            });
        });

        it('should test initial values of forgotStatus', function () {
            expect(scope.forgotStatus).toEqual({
                    status: '',
                    message: '',
                    forgotFormSent: false
                });
        });
    });

    describe('when user restores forgotten password with valid form', function () {
        var scope;
        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    forgotPassword: function (email, captchaChallenge, captchaResponse) {
                        var data = {
                            callStatus: {
                                status: 'success'
                            }
                        };
                        var self = {
                            success: function (callback) {
                                callback(data);
                                return self;
                            },
                            error: function () {}
                        };
                        return self;
                    }
                });
                $provide.value('captcha', {
                    get_challenge: function () { return 'aaa'; }
                    ,get_response: function () { return 'aaa'; }
                    ,create: function () { return true; }
                });
            });
            inject(function ($rootScope, $controller, auth, captcha) {
                scope = $rootScope.$new();
                var ctl = $controller('forgotPassword', {$scope: scope});
            });
        });

        it('should notify `success` status', function () {
            scope.forgotPassword('me@example.com');
            expect(scope.forgotStatus.forgotFormSent).toBeTruthy();
        });

    });


    describe('when user resetsPassword with invalid form', function () {
        var scope;

        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    forgotPassword: function (email, captchaChallenge, captchaResponse) {
                        var data = {
                            callStatus: {
                                status: 'failure',
                                error: {
                                    message: 'bad captcha'
                                }
                            }
                        };
                        var self = {
                            success: function () {
                                return self;
                            },
                            error: function (callback) {
                                callback(data);
                            }
                        };
                        return self;
                    }
                });
                $provide.value('captcha', {
                    get_challenge: function () { return 'aaa'; }
                    ,get_response: function () { return 'aaa'; }
                    ,create: function () { return true; }
                });
            });
            inject(function ($rootScope, $controller, auth, captcha) {
                scope = $rootScope.$new();
                var ctl = $controller('forgotPassword', {$scope: scope});
            });
        });

        it('should notify `failure` status', function () {
            scope.forgotPassword('me@example.com');
            expect(scope.forgotStatus.status).toEqual('failure');
            expect(scope.forgotStatus.message).toEqual('bad captcha');
            expect(scope.forgotStatus.forgotFormSent).toBeFalsy();
        });

    });

});
});