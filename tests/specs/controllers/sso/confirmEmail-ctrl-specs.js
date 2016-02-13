define(['chai', 'angular-mocks', 'app/controllers/sso/confirmEmail-ctrl'], function (chai) {
describe('confirmEmail', function () {
    var expect = chai.expect;
    var should= chai.should();

    beforeEach(module('epek.controllers'));
    describe('init', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    confirmEmail: function (token) {
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('confirmEmail', {
                    $scope: scope,
                    $routeParams: {
                        token: '123'
                    }
                });
            });

        });

        it('should place token into fields scope', function () {
            scope.token.should.equal('123');
        });

    });



    describe('when user confirms email with valid token', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    confirmEmail: function (token) {
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
            });

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('confirmEmail', {
                    $scope: scope,
                    $routeParams: {
                        token: '123'
                    }
                });
            });

        });

        it('should notify `success` status', function () {
            scope.confirmEmail();
            scope.status.should.equal('success')
        });

    });



    describe('when user confirms email with invalid token', function () {
        var scope;

        beforeEach(function () {

            module(function($provide) {
                $provide.value('auth', {
                    confirmEmail: function (token) {
                        var data = {
                            status: 'failure',
                            callStatus: {
                                error: {
                                    message: 'errorMessage'
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
                var ctl = $controller('confirmEmail', {
                    $scope: scope,
                    $routeParams: {
                        token: '123'
                    }
                });
            });

        });

        it('should notify `failure` status', function () {
            scope.confirmEmail();
            scope.status.should.equal('failure')
        });

    });

});
});
