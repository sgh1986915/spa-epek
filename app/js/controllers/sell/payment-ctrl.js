define([
    './../index',
    '../../services/wallet-service'
], function (controllers) {
    'use strict';

    /**
     * Sell Step 8: Payment
     * PayPal, Pay on Pick-up
     */
    controllers.controller('payment', ['$scope', '$rootScope', 'wallet', 'sellApi', '$window', function ($scope, $rootScope, wallet, sellApi, $window) {

        // setup controller userData space
        if (!$rootScope.sellData[$scope.activeStep]) {

            $rootScope.sellData[$scope.activeStep] = {
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
                }
            };
        }

        // Setup scope
        $scope.data = $rootScope.sellData[$scope.activeStep];

        /**
         * @private
         * @description Common error handler for payment controller
         * @param {Object} response
         */
        var errorHandler = function (response) {
            // TODO it should be improved
            if (response.callStatus) {
                $scope.data.stepStatus.status = response.callStatus.status || 'unrecognized';
            }
            $scope.data.stepStatus.message = 'Error: data was not loaded';
        };

        /**
         * @private
         * @description setPaypalConfirm setter
         * @param {Boolean} state
         */
        var setPaypalConfirm = function (state) {
            $scope.data.paypal.isPaypalConfirm = !!state;
        };

        /**
         * @private
         * @description Shows paypal oAuth popup
         * @param {String} url paypal url
         */
        var paypalPopupCreate = function (url) {
            setPaypalConfirm(true);
            // Here is only one possible solution how to login on PayPal through popup
            // because we can't do the same using iframe, popup + iframe, due
            // "refused to display document because display forbidden by X-Frame-Options".
            // if you know theoretically possible solution please provide it.
            $scope.data.paypal.paypalPopup = $window.open(url, '_blank', 'width=500, height=600');
            var isPopupClosed = setInterval(function () {
                if ($scope.data.paypal.paypalPopup.closed) {
                    $scope.$apply(function () {
                        $scope.paypalOauthCancel();
                        $scope.getPaymentId();
                    });
                    clearInterval(isPopupClosed);
                }
            }, 1000);
        };

        /**
         * @description Payment scope initialization
         */
        $scope.loadData = function () {
            if ($rootScope.$eval('sellData.category.selectedCategory.categoryInfo.meta.paymentInfo')) {
                $scope.data.availableIds = $rootScope.sellData.category.selectedCategory.categoryInfo.meta.paymentInfo;
                $scope.data.stepStatus = 'success';
                $scope.data.stepStatus.message = '';
                $scope.getPaymentId().then(function () {
                });
            } else {
                $scope.data.stepStatus.status = 'failure';
                $scope.data.stepStatus.message =
                    'To fill in specifications You have to choose category at step 4 first.';
                $scope.data.availableIds = [];
            }
        };

        /**
         * @description sellData.item builder
         */
        $scope.$watch(function () {
            return {
                online: (function () {
                    var arr = [];
                    if ($scope.data.paypal.isSelected) {
                        arr.push('paypal');
                    }
                    return arr;
                }()),
                offline: $scope.data.payOnPickup.isSelected ? ['payOnPickup'] : []
            };
        }, function (payments) {
            $rootScope.sellData.item.paymentService = payments;
        }, true);

        /**
         * @description Get payment ids
         */
        $scope.getPaymentId = function () {
            return wallet.getPaymentId().success(function (response) {
                angular.extend($scope.data.paymentIds, response.response);
            }).error(function (response) {
                errorHandler(response);
            });
        };

        /**
         * @description true if 'Link Paypal Account' button should be shown
         */
        $scope.showLinkPaypalAccountButton = function() {
            return !$scope.data.paymentIds.paypalOauth.email && !$scope.data.paypal.isEdited;
        };

        /**
         * @description true if 'Edit Paypal Account' button should be shown
         */
        $scope.showEditPaypalAccountButton = function() {
            return $scope.data.paymentIds.paypalOauth.email && !$scope.data.paypal.isEdited;
        };

        /**
         * @description true if 'Cancel Edit Paypal Account' button should be shown
         */
        $scope.showCancelEditPaypalAccountButton = function() {
            return $scope.data.paypal.isEdited && !$scope.data.paypal.isPaypalConfirm;
        };

        /**
         * @description starts the editing of the PayPal account details
         */
        $scope.startEditingPaypal = function() {
            $scope.data.paypal.isEdited = true;
        };

        /**
         * @description cancels the editing of the PayPal account details
         */
        $scope.stopEditingPaypal = function() {
            $scope.data.paypal.isEdited = false;
        };

        /**
         * @description true if PayPal account details should be hidden
         */
        $scope.hidePaypalId = function() {
            return $scope.data.paypal.isEdited || !$scope.data.paymentIds.paypalOauth.email;
        };

        /**
         * @description true if PayPal account editing screen should be shown
         */
        $scope.showPaypalEditScreen = function() {
            return $scope.data.paypal.isEdited;
        };

        /**
         * @description true if 'Confirm PayPal account' button should be shown
         */
        $scope.showConfirmPaypalAccountButton = function() {
            return !$scope.data.paypal.isPaypalConfirm;
        };

        /**
         * @description true if 'Cancel Confirm PayPal account' button but should be shown
         */
        $scope.showCancelConfirmPaypalAccountButton = function() {
            return $scope.data.paypal.isPaypalConfirm;
        };

        /**
         * @description PayPal authentication
         */
        $scope.paypalOauth = function () {
            wallet.paypalOauth(
                $scope.data.paypal.returnUrl,
                $scope.data.paypal.cancelUrl
            ).success(function (response) {
                if (!response.response.paypalOauthUrl) {
                    return;
                }
                paypalPopupCreate(response.response.paypalOauthUrl);
            }).error(function (response) {
                errorHandler(response);
            });
        };

        /**
         * @description PayPal authentication cancel
         */
        $scope.paypalOauthCancel = function () {
            if ($scope.data.paypal.paypalPopup) {
                $scope.data.paypal.paypalPopup.close();
            }
            setPaypalConfirm(false);
        };

        $scope.listItem = function() {
            var listFunction = $scope.sellData.listingType === 'auction'
                ? sellApi.listItem : sellApi.listFixedPriceItem;

            listFunction($rootScope.sellData.item).success(function (data, status) {
                    console.log('saved item: ' + data + ' with status: ' + status);
                }
            ).error(function (data, status) {
                    console.log('failed to save item: ' + data + ' with status: ' + status);
                }
            );
        };

        /**
         * @description Updates scope validation property
         * @return {Object} enum
         */
        $scope.validate = function () {
            var scope = $scope.data;
            $rootScope.sellData.validity[$scope.activeStep] = 'invalid';
            if (scope.payOnPickup.isSelected ||
                (scope.paypal.isSelected && scope.paymentIds.paypalOauth.email)) {
                $rootScope.sellData.validity[$scope.activeStep] = 'valid';
            }
            return $rootScope.sellData.validity[$scope.activeStep];
        };
    }]);
});
