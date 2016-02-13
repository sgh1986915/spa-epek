define(['./../index', '../../services/auth-service'], function (controllers) {
/**
 * controller handling /sso/changePassword
 */
controllers.controller('changePassword', ['captcha', 'auth', '$scope', function ChangePasswordCtrl (captcha, auth, $scope) {
    'use strict';

    $scope.changeStatus = {
        status: ''
        , message: ''
    };

    $scope.changeParams = {
        email: null
        , oldPassword: null
        , newPassword: null
        , newPasswordConfirm: null
        , captchaChallenge: null
        , captchaReset: null
    };

    /**
     * handles successful password change,
     * displays status
     * @param response {object} XHR response JSON
     */
    var success = function (response) {
        $scope.passwordChanged = true;
        $scope.changeStatus.status = response.callStatus.status;
        $scope.changeStatus.message = 'success';
    };

    /**
     * handles unsuccessful password change,
     * displays status and failure message
     * @param response {object} XHR response JSON
     */
    var error = function (response) {
        $scope.changeStatus.status = response.callStatus.status;
        $scope.changeStatus.message = response.callStatus.error.message;
    };

    $scope.passwordChanged = false;

    /**
     * handles password change
     */
    $scope.changePassword = function () {
        $scope.changeParams.captchaChallenge = captcha.get_challenge();
        $scope.changeParams.captchaResponse = captcha.get_response();
        // call api
        auth.changePassword($scope.changeParams).success(success).error(error);
    };

}]);
});