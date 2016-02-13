/**
 * Defines Services related to querying wallet.epek.com
 */

define(['./index'], function (services) {
    'use strict';

    services.factory('wallet', ['$http', 'config', function ($http, config) {
        return {
            getPaymentId: function () {
                return $http({
                    withCredentials: true,
                    url: config.WALLET_ROOT + '/getPaymentId',
                    method: 'GET'
                });
            },

            updatePaymentId: function (data) {
                if (!data) {
                    throw 'Parameter is expected we got:' + data;
                }
                return $http({
                    withCredentials: true,
                    url: config.WALLET_ROOT + '/updatePaymentId',
                    data: data,
                    method: 'POST'
                });
            },

            paypalOauth: function (returnUrl, cancelUrl) {
                if (!returnUrl || !cancelUrl) {
                    throw 'Two parameters are expected, ' +
                        'we got: {returnUrl: '+ returnUrl +', cancelUrl: '+ cancelUrl +'}';
                }
                return $http({
                    withCredentials: true,
                    url: config.WALLET_ROOT + '/paypalOauth',
                    method: 'GET'
                });
            }
        };
    }]);

});
