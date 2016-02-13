define(['angular-mocks', 'app/controllers/sso/changePassword-ctrl'], function (chai) {
describe('changePassword', function () {

    var captchaServiceMock = {
            get_challenge: function () { return 'aaa'; }
            ,get_response: function () { return 'aaa'; }
            ,create: function () { return true; }
        };

    beforeEach(module('epek.controllers'));

    describe('init', function () {
        var scope;
        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    changePassword: function (params) {
                        var data = {
                            status: 'success'
                        };
                        var self = {
                            success: function (callback) {
                                callback(data);
                                return self;
                            },
                            error: function () {
                                return self;
                            }
                        };
                        return self;
                    }
                });
                $provide.value('captcha', captchaServiceMock);
            });
            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('changePassword', { $scope: scope });
            });
        });

        it('should check initial value of changeParams object', function () {
            scope.changeParams.should.eql({
                email: null
                , oldPassword: null
                , newPassword: null
                , newPasswordConfirm: null
                , captchaChallenge: null
                , captchaReset: null
            });
        });

        it('should check initial value of changeStatus object', function () {
            scope.changeStatus.should.eql({
                status: ''
                , message: ''
            });
        });

        it('should check that scope.passwordChanged is set to false', function () {
            scope.passwordChanged.should.eql(false);
        });

    });


    describe('when user changes password with valid form', function () {
        var scope;
        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    changePassword: function (params, success, error) {
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
                            error: function () {
                                return self;
                            }
                        };
                        return self;
                    }
                });
                $provide.value('captcha', captchaServiceMock);
            });

            inject(function ($rootScope, $controller, auth, captcha) {
                scope = $rootScope.$new();
                var ctl = $controller('changePassword', { $scope: scope });
            });
        });

        it('should display success message', function () {
            scope.changePassword();
            scope.passwordChanged.should.eql(true);
        });
        
        it('should notify `success` status', function () {
            scope.changePassword();
            scope.changeStatus.status.should.equal('success');
        });

    });


    describe('when user resetsPassword with invalid form', function () {
        var scope;
        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    changePassword: function (params, success, error) {
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
                                return self;
                            }
                        };
                        return self;
                    }
                });
                $provide.value('captcha', captchaServiceMock);
            });

            inject(function ($rootScope, $controller, auth, captcha) {
                scope = $rootScope.$new();
                var ctl = $controller('changePassword', { $scope: scope });
            });
        });

        it('should not display success message', function () {
            scope.changePassword();
            scope.passwordChanged.should.eql(false);

        });

        it('should notify `success` status', function () {
            scope.changePassword();
            scope.changeStatus.status.should.equal('failure');
            scope.changeStatus.message.should.equal('bad captcha');
        });

    });

});
});