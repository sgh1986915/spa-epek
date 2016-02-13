define(['chai', 'angular-mocks', 'app/controllers/sso/auth-ctrl'], function (chai) {
describe('auth', function () {
    var expect = chai.expect;
    var should= chai.should();

    beforeEach(function () {
        module('epek.controllers');
        module(function($provide) {
            $provide.value('captcha', {
                get_challenge: function () { return 'test'; }
                , get_response: function () { return 'test'; }
                , create: function () { return true; }
            });
        });
    });

    describe('init', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {});
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        it("authStatus properties should be empty", function () {
            scope.authStatus.should.eql({
                status: '',
                message: '',
                formStatus: '',
                useridStatus: ''
            });
        });

    });



    describe('when discover request returns info that user account was deleted/suspended', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    discover: function (email, options) {
                        var data = {
                            response: {
                                registration: 'disabled'
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        it("should notify 'disabled' status", function () {
            scope.discover('test@test.com');
            scope.authStatus.status.should.equal('disabled');
        });

    });



    describe('when discover request returns info that user account is not confirmed', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    discover: function (email, options) {
                        var data = {
                            response: {
                                registration: 'notConfirmed'
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        it("should notify 'notConfirmed' status", function () {
            scope.discover('test@test.com');
            scope.authStatus.status.should.equal('notConfirmed');
        });

    });



    describe('when user login failed', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    authUserId: function (email, password, success, failure) {
                        var data = {
                            response: null,
                            status: 'failure',
                            callStatus: {
                                error: {
                                    errorCode: "001",
                                    errorType: "requestError",
                                    message: "Authentication failed!",
                                    severityCode: "warning"
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        it("should notify 'failure' status", function () {
            scope.loginUser('test@test.com', 'test');
            scope.authStatus.status.should.equal('failure');
        });

    });



    describe('when user login success', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    authUserId: function (email, password, success, failure) {
                        var data = {
                            response: {
                                sessionId: 'sessionId',
                                userId: 'userId'
                            },
                            status: 'success'
                        };
                        var self = {
                            success: function (callback) {
                                callback(data);
                                return self;
                            },
                            error: function (callback) {
                                return self;
                            }
                        };
                        return self;
                    }
                });
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        it("should notify 'success' status", function () {
            scope.loginUser('test@test.com', 'test');
            scope.authStatus.status.should.equal('success');
        });

        it("should set user.userId property to 'userId'", function () {
            scope.loginUser('test@test.com', 'test');
            scope.user.userId.should.equal('userId');
        });

        it("should set user.sessionId property to 'sessionId'", function () {
            scope.loginUser('test@test.com', 'test');
            scope.user.sessionId.should.equal('sessionId');
        });

    });



    describe('when user is not registered and discover says that openID is supported let him decide to use openId or not', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    discover: function (email, options) {
                        var data = {
                            response: {
                                registration: {
                                    isRegistered: false,
                                    openIdSupported: {
                                        isSupported: true,
                                        openIdRegistrationUrl: 'test'
                                    }
                                }
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
                    },
                    checkUsernameAvailability: function (userId, email, success) {}
                });
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        describe('user prefers not to use openId', function () {
            it("should set authStatus.formStatus to 'simpleAuth'", function () {
                scope.discover('test@test.com');
                scope.skipOpenId();
                scope.authStatus.formStatus.should.equal('simpleAuth');
            });
        });

        describe('user prefers to use openId', function () {
            it("should set user.openIdUrl to 'test'", function () {
                scope.discover('test@test.com');
                scope.useOpenId();
                scope.user.openIdUrl.should.equal('test');
            });
        });

    });



    describe('when user is not registered and discover says that openID is not supported', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    discover: function (email, options) {
                        var data = {
                            response: {
                                registration: {
                                    isRegistered: false,
                                    openIdSupported: {
                                        isSupported: false
                                    }
                                }
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });


       it("should notify 'simpleAuth' authStatus.formStatus", function () {
           scope.discover('test@test.com');
           scope.authStatus.formStatus.should.equal('simpleAuth');
       });

    });



    describe('when user is registered and prefers openID', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('windowLocation', {
                    href: function(url) {
                        this.url = url;
                    }
                });
                $provide.value('auth', {
                    discover: function (email, options, callback) {
                        var data = {
                            response: {
                                registration: true,
                                prefersOpenId: {
                                    isPreferred: true,
                                    openIdUrl: "test"
                                }
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        it("should set user.openIdUrl to 'test'", inject(function (windowLocation) {
            scope.discover('test@gmail.com');
            scope.user.openIdUrl.should.equal('test');
            windowLocation.url.should.equal('test');
        }));

    });

    describe('when user is registered and do not prefers openID', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    discover: function (email, options, callback) {
                        var data = {
                            response: {
                                prefersOpenId: {
                                      openIdUrl: null,
                                      isPreferred: false
                                },
                                registration: true
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('auth', {
                    $scope: scope
                });
            });

        });

        it("should set authStatus.formStatus to 'simpleLogin'", function () {
            scope.discover('test@test.com');
            scope.authStatus.formStatus.should.equal('simpleLogin');
        });

    });



});
});
