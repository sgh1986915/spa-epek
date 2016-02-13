define(['chai', 'angular-mocks', 'app/controllers/sso/resetPassword-ctrl'], function (chai) {
describe('resetPassword', function () {
    var expect = chai.expect;
    var should= chai.should();
    beforeEach(module('epek.controllers'))
    describe('init', function () {
        var scope;
        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    resetPassword: function (resetArgs) {
                        var self = {
                            success: function (callback) {
                                callback({status: 'success'});
                                return self;
                            },
                            error: function () {
                                return self;
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
            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('resetPassword', {
                    $scope: scope
                    , $routeParams: {
                        token: '123'
                    }
                });
            });
        });
        it('should place token into fields scope', function () {
            scope.reset.should.eql({
                email: null
                ,newPassword: null
                ,token: '123'

            });

        });

    });


    describe('when user resetsPassword with valid form', function () {
        var scope;
        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    resetPassword: function (resetArgs) {
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
                $provide.value('captcha', {
                    get_challenge: function () { return 'aaa'; }
                    ,get_response: function () { return 'aaa'; }
                });
                    
            });
            inject(function ($rootScope, $controller, auth, captcha) {
                scope = $rootScope.$new();
                var ctl = $controller('resetPassword', {
                    $scope: scope
                    , $routeParams: {
                        token: '123'
                    }
                });
            });
        });
        
        it('should notify `success` status', function () {
            scope.resetPassword({
                token: '123'
                , email: 'me@example.com'
                , newPassword: 'meh'
            });
            scope.resetStatus.status.should.equal('success')
        });

    });


    describe('when user resetsPassword with invalid form', function () {
        var scope;
        beforeEach(function () {
            module(function($provide) {
                $provide.value('auth', {
                    resetPassword: function (resetArgs, success, error) {
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
                $provide.value('captcha', {
                    get_challenge: function () { return 'aaa'; }
                    ,get_response: function () { return 'bbb'; }
                });
                    
            });
            inject(function ($rootScope, $controller, auth, captcha) {
                scope = $rootScope.$new();
                var ctl = $controller('resetPassword', {
                    $scope: scope
                    , $routeParams: {
                        token: '123'
                    }
                });
            });
        });
        
        it('should notify `failure` status', function () {
            scope.resetPassword({
                token: '123'
                , email: 'me@example.com'
                , newPassword: 'meh'
            });
            scope.resetStatus.status.should.equal('failure')
            scope.resetStatus.message.should.equal('bad captcha');
        });

    });

});
});