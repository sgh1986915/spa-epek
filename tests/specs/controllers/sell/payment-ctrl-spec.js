define(['angular-mocks', 'app/controllers/sell/payment-ctrl'], function () {

    var stubAvailablePayments = [
        {
            paymentService: "paypal",
            paymentName: "PayPal"
        },
        {   paymentService: "payOnPickup",
            paymentName: "Pay on Pick-up"
        }
    ];

    var stubPaymentIds = {
        version: '2-0-0',
        callStatus: {
            status: 'success',
            timestamp: '2012-12-23T01:24:31.567150'
        },
        response: {
            paypalOauth: {
                timestamp: '2012-12-23T00:02:29.725800',
                phoneNumber: null,
                email: 'test@test.com',
                accountVerified: true
            }
        }
    };

    var stubUpdatePaymentId = {
        version: '2-0-0',
        callStatus: {
            status: 'success',
            timestamp: '2012-12-23T03:07:15.507910'
        }
    };

    var stubPaypalOauth = {
        version: '2-0-0',
        callStatus: {
            status: 'success',
            timestamp: '2012-12-23T03:34:14.408950'
        },
        response: {
            paypalOauthUrl: 'https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/' +
                'authorize?client_id=b758daa449dfd113d92dcd1ae5cedd6d&response_type=code&scope' +
                '=profile address email&redirect_uri=http://wallet.api.epek.com/paypalOauth?returnUrl' +
                '=http://www.epek.com&cancelUrl=http://www.epek.com&nonce=1356231978.29'
        }
    };

    describe('payment controller initial state', function () {

        var subject, scope, $rootScope, $controller;

        beforeEach(function () {
            module('epek.controllers');

            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');

                $rootScope.sellData = {
                    validity: { payment: 'pristine' },
                    item: {
                        paymentService: {
                            online: [],
                            offline: []
                        }
                    }
                };
                scope = $rootScope.$new();
                subject = $controller('payment', {$scope: scope, $rootScope: $rootScope});
            });
        });

        describe('check if controller is on it\'s place', function () {
            it('should have loaded the subject', function () {
                expect(subject).toBeDefined();
            });
        });

        describe('check if scope is also on it\'s place', function () {
            it('should test scope to be defined', function () {
                expect(scope).toBeDefined();
            });
        });

        describe('check initial controller state', function () {
            it('should setup initial userData space', function () {
                expect(scope.data).toEqual({
                    stepStatus: {
                        status: null,
                        message: null
                    },
                    availableIds: [],
                    paymentIds: {
                        paypalOauth: {
                            email: null
                        },
                        bankTransfer: null
                    },
                    payOnPickup: {
                        isSelected: false
                    },
                    paypal: {
                        returnUrl: 'http://epek.com/',
                        cancelUrl: 'http://epek.com/',
                        paypalPopup: null,
                        isPaypalConfirm: false,
                        isSelected: false,
                        isEdited: false
                    },
                });
            });
        });
    });

    describe('payment controller work', function () {
        var subject, scope, $rootScope, $controller;

        beforeEach(function () {
            module('epek.controllers');

            module(function($provide) {
                $provide.value('wallet', {
                    getPaymentId: function () {
                        var self = {
                            success: function (callback) {
                                callback(stubPaymentIds);
                                return self;
                            },
                            error: function () {
                                return self;
                            },
                            then: function () {
                                return self;
                            }
                        };
                        return self;
                    },
                    updatePaymentId: function () {
                        var self = {
                            success: function (callback) {
                                callback(stubUpdatePaymentId);
                                return self;
                            },
                            error: function () {
                                return self;
                            }
                        };
                        return self;
                    },
                    paypalOauth: function () {
                        var self = {
                            success: function (callback) {
                                callback(stubPaypalOauth);
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

            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');
                $window = $injector.get('$window');

                $rootScope.sellData = {
                    validity: { payment: 'pristine' },
                    item: {
                        paymentService: {
                            online: [],
                            offline: []
                        }
                    },
                    category: {
                        selectedCategory: {
                            categoryInfo: {
                                meta: {
                                    paymentInfo: stubAvailablePayments
                                }
                            }
                        }
                    }
                };
                scope = $rootScope.$new();
                subject = $controller('payment', {$scope: scope, $rootScope: $rootScope});
                $window.open = function(url) {
                    return {location: {href: url}, closed: false};
                }
            });
        });

        describe('test loadData success state', function () {
            beforeEach(function () {
                scope.loadData();
            });

            it('available payment ids should be defined', function () {
                expect(scope.data.availableIds).toBeDefined();
            });

            it('payment ids should be defined', function () {
                expect(scope.data.paymentIds).toBeDefined();
            });

            it('paypal email checking', function () {
                expect(scope.data.paymentIds.paypalOauth.email).toEqual('test@test.com');
            });
        });

        describe('the Link Paypal Account button', function() {
            beforeEach(function () {
                scope.loadData();
            });

            it('should show when account not linked and editing not in progress', function() {
                scope.data.paymentIds.paypalOauth.email = null;
                scope.data.paypal.isEdited = false;
                expect(scope.showLinkPaypalAccountButton()).toBeTruthy();
            });

            it('should not show when account not linked and editing in progress', function() {
                scope.data.paymentIds.paypalOauth.email = null;
                scope.data.paypal.isEdited = true;
                expect(scope.showLinkPaypalAccountButton()).toBeFalsy();
            });

            it('should not show when account linked and editing not in progress', function() {
                scope.data.paymentIds.paypalOauth.email = 'test@test.com';
                scope.data.paypal.isEdited = false;
                expect(scope.showLinkPaypalAccountButton()).toBeFalsy();
            });

            it('should not show when account linked and editing in progress', function() {
                scope.data.paymentIds.paypalOauth.email = 'test@test.com';
                scope.data.paypal.isEdited = true;
                expect(scope.showLinkPaypalAccountButton()).toBeFalsy();
            });
        });

        describe('the Edit Paypal Account button', function() {
            beforeEach(function () {
                scope.loadData();
            });

            it('should show when account linked and editing not in progress', function() {
                scope.data.paymentIds.paypalOauth.email = 'test@test.com';
                scope.data.paypal.isEdited = false;
                expect(scope.showEditPaypalAccountButton()).toBeTruthy();
            });

            it('should not show when account not linked and editing not in progress', function() {
                scope.data.paymentIds.paypalOauth.email = null;
                scope.data.paypal.isEdited = false;
                expect(scope.showEditPaypalAccountButton()).toBeFalsy();
            });

            it('should not show when account not linked and editing in progress', function() {
                scope.data.paymentIds.paypalOauth.email = null;
                scope.data.paypal.isEdited = true;
                expect(scope.showEditPaypalAccountButton()).toBeFalsy();
            });

            it('should not show when account linked and editing in progress', function() {
                scope.data.paymentIds.paypalOauth.email = 'test@test.com';
                scope.data.paypal.isEdited = true;
                expect(scope.showEditPaypalAccountButton()).toBeFalsy();
            });
        });

        describe('the Cancel Edit Paypal Account button', function() {
            beforeEach(function () {
                scope.loadData();
            });

            it('should show when editing in progress and confirmation not in progress', function() {
                scope.data.paypal.isEdited = true;
                scope.data.paypal.isPaypalConfirm = false;
                expect(scope.showCancelEditPaypalAccountButton()).toBeTruthy();
            });

            it('should not show when editing not in progress and confirmation not in progress', function() {
                scope.data.paypal.isEdited = false;
                scope.data.paypal.isPaypalConfirm = false;
                expect(scope.showCancelEditPaypalAccountButton()).toBeFalsy();
            });

            it('should show when editing in progress and confirmation in progress', function() {
                scope.data.paypal.isEdited = true;
                scope.data.paypal.isPaypalConfirm = true;
                expect(scope.showCancelEditPaypalAccountButton()).toBeFalsy();
            });

            it('should show when editing not in progress and confirmation in progress', function() {
                scope.data.paypal.isEdited = false;
                scope.data.paypal.isPaypalConfirm = true;
                expect(scope.showCancelEditPaypalAccountButton()).toBeFalsy();
            });
        });

        describe('when starting editing the Paypal account', function() {
            it('the editing flag should be set', function() {
                scope.data.paypal.isEdited = false;
                scope.startEditingPaypal();
                expect(scope.data.paypal.isEdited).toBeTruthy();
            });
        });

        describe('when stopping editing the Paypal account', function() {
            it('the editing flag should be unset', function() {
                scope.data.paypal.isEdited = true;
                scope.stopEditingPaypal();
                expect(scope.data.paypal.isEdited).toBeFalsy();
            });
        });

        describe('the Paypal Id details', function() {
            beforeEach(function () {
                scope.loadData();
            });

            it('should hide when editing in progress and account is linked', function() {
                scope.data.paypal.isEdited = true;
                scope.data.paymentIds.paypalOauth.email = 'test@test.com';
                expect(scope.hidePaypalId()).toBeTruthy();
            });

            it('should not hide when editing not in progress and account is linked', function() {
                scope.data.paypal.isEdited = false;
                scope.data.paymentIds.paypalOauth.email = 'test@test.com';
                expect(scope.hidePaypalId()).toBeFalsy();
            });

            it('should hide when editing not in progress and account is not linked', function() {
                scope.data.paypal.isEdited = false;
                scope.data.paymentIds.paypalOauth.email = null;
                expect(scope.hidePaypalId()).toBeTruthy();
            });

            it('should hide when editing in progress and account is not linked', function() {
                scope.data.paypal.isEdited = true;
                scope.data.paymentIds.paypalOauth.email = null;
                expect(scope.hidePaypalId()).toBeTruthy();
            });
        });

        describe('the Paypal edit screen', function() {
            beforeEach(function () {
            });

            it('should show when editing in progress', function() {
                scope.data.paypal.isEdited = true;
                expect(scope.showPaypalEditScreen()).toBeTruthy();
            });

            it('should not show when editing not in progress', function() {
                scope.data.paypal.isEdited = false;
                expect(scope.showPaypalEditScreen()).toBeFalsy();
            });
        });

        describe('the Confirm Paypal Account button', function() {
            it('should show when confirmation not in progress', function() {
                scope.data.paypal.isPaypalConfirm = false;
                expect(scope.showConfirmPaypalAccountButton()).toBeTruthy();
            });

            it('should not show when confirmation in progress', function() {
                scope.data.paypal.isPaypalConfirm = true;
                expect(scope.showConfirmPaypalAccountButton()).toBeFalsy();
            });
        });

        describe('the Cancel Confirm Paypal Account button', function() {
            it('should show when confirmation in progress', function() {
                scope.data.paypal.isPaypalConfirm = true;
                expect(scope.showCancelConfirmPaypalAccountButton()).toBeTruthy();
            });

            it('should not show when confirmation not in progress', function() {
                scope.data.paypal.isPaypalConfirm = false;
                expect(scope.showCancelConfirmPaypalAccountButton()).toBeFalsy();
            });
        });

        describe('test paypalOauth popup showing', function () {
            beforeEach(function () {
                scope.paypalOauth();
            });

            it('PayPal popup is showed', function () {
                expect(scope.data.paypal.isPaypalConfirm).toBeTruthy();
                expect(scope.data.paypal.paypalPopup).toBeDefined();
                expect(scope.data.paypal.paypalPopup.closed).toBeFalsy();
                expect(scope.data.paypal.paypalPopup.location.href).toEqual(stubPaypalOauth.response.paypalOauthUrl);
            });
        });

        describe('test paypalOauth popup closing', function () {
            beforeEach(function () {
                scope.paypalOauthCancel();
            });

            it('PayPal popup is showed', function () {
                expect(scope.data.paypal.isPaypalConfirm).toBeFalsy();
                expect(scope.data.paypal.paypalPopup).toBe(null);
            });
        });

//        describe('test validation', function () {
//            beforeEach(function () {
//                scope.data.paypal.isSelected = true;
//            });
//
//            it('controller is pristine', function () {
//                expect(scope.validate()).toEqual('valid');
//            });
//        });

    });

});
