define(['./../index', '../../services/auth-service'], function (controllers) {
    /**
     * controller handling /sso/resetPassword?token=:token
     * resets password with token from url
     */
    controllers.controller('resetPassword', ['captcha', '$scope', '$routeParams', 'auth', function ResetPasswordCtrl (captcha, $scope, $routeParams, auth) {
        'use strict';

        $scope.resetStatus = {
            status: ''
            , message: ''
        };

        $scope.reset = {
            email: null
            , newPassword: null
            , token: $routeParams.token
        };

        /**
         * handles successful reset,
         * displays status
         * @param response - XHR response JSON object
         */
        var resetSuccess = function (response) {
            $scope.passwordResetted = true;
            $scope.resetStatus.status = response.callStatus.status;
            $scope.resetStatus.message = 'Success';
        };

        /**
         * handles unsuccessful reset,
         * displays status and failure message
         * @param response - XHR response JSON object
         */
        var resetError = function (response) {
            $scope.resetStatus.status = response.callStatus.status;
            $scope.resetStatus.message = response.callStatus.error.message;
        };

        $scope.passwordResetted = false;

        /** handles password reset
         * @param reset - {Object} form fields
         */
        $scope.resetPassword = function (reset) {
            $scope.reset.captchaChallenge = captcha.get_challenge();
            $scope.reset.captchaResponse = captcha.get_response();
            //call api
            auth.resetPassword(reset).success(resetSuccess).error(resetError);
        };

    }]);
});
