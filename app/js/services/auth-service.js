/**
 * Defines services related to authentication
 */
define(['./index', '../config'], function (services) {
services.factory('auth', ['config', '$http', function(config, $http) {

    return {

        /**
         *
         * @param email {string}
         * @param options {object} contains optional request properties
         * @return {*} http promise
         */
        discover: function (email, options) {
            var data = {
                email: email
            };

            //handle optional request parameters
            if (typeof options.redirectUrl !== 'undefined') {
                data.redirectUrl = encodeURIComponent(options.redirectUrl);
            }

            return $http({
                withCredentials: true,
                url: config.SERVICE_ROOT + 'discover',
                method: 'POST',
                data: data
            });
        },

        /**
         *
         * @param user {object} user properties
         * @return {*} http promise
         */
        registerUserId: function (user) {
            return $http({
                withCredentials: true,
                url: config.SERVICE_ROOT + 'registerUserId',
                method: 'POST',
                data: {
                    userId: user.userId,
                    password: user.password,
                    email: user.email,
                    captchaChallenge: user.captchaChallenge,
                    captchaResponse: user.captchaResponse
                }
            });
        },

        /**
         * @param userId {string} required
         * @param email {string} optional
         * @return {*} http promise
         */
        checkUsernameAvailability: function (userId, email) {
            var data = {userId: userId};
            if (email) data.email = email;
            return $http({
                withCredentials: true,
                url: config.SERVICE_ROOT + 'checkUsernameAvailability',
                method: 'GET',
                params: data
            });
        },

        /**
         * @param email
         * @param captcha_challenge
         * @param captcha_response
         * @return {*} http promise
         */
        forgotPassword: function (email, captcha_challenge, captcha_response) {
            return $http({
                withCredentials: true,
                url: config.SERVICE_ROOT + 'forgotPassword',
                method: 'POST',
                data: {
                    email: email,
                    captchaChallenge: captcha_challenge,
                    captchaResponse: captcha_response
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        /**
         * @param token {string}
         * @return {*} http promise
         */
        confirmEmail: function (token) {
            return $http({
                withCredentials: true,
                url: config.SERVICE_ROOT + 'confirmEmail',
                method: 'GET',
                params: {
                    token: token
                }
            });
        },

        /**
         * @param email
         * @param password
         * @param success
         * @param failure
         */
        authUserId: function (email, password) {
            return $http({
                withCredentials: true,
                url: config.SERVICE_ROOT + 'authUserId',
                method: 'POST',
                data: {
                    email: email,
                    password: password
                }
            });
        },

        /**
         * sends POST to API::resetPassword
         */
        resetPassword: function (reset) {
            return $http({
                withCredentials: true,
                url: config.SERVICE_ROOT + 'resetPassword',
                method: 'POST',
                data: {
                    email: reset.email
                    , resetToken: reset.token
                    , newPassword: reset.newPassword
                    , captchaChallenge: reset.captchaChallenge
                    , captchaResponse: reset.captchaResponse
                }
            });
        },

        /**
         * sends POST to API::changePassword
         * @param params {object} values to be sent to api
         * @return {*} http promise
         */
        changePassword: function (params) {
            return $http({
                url: config.SERVICE_ROOT + 'changePassword',
                withCredentials: true,
                method: 'POST',
                data: {
                    email: params.email
                    , oldPassword: params.oldPassword
                    , newPassword: params.newPassword
                    , captchaChallenge: params.captchaChallenge
                    , captchaResponse: params.captchaResponse
                }
            });
        }

    };

}]);
});
