define(['./../index', '../../services/auth-service'], function (controllers) {
controllers.controller('forgotPassword', ['captcha', '$scope', '$rootScope', '$location', '$log', 'auth', function (captcha, $scope, $rootScope, $location, $log, auth) {
    'use strict';

    $scope.forgotStatus = {
        status: '',
        message: '',
        forgotFormSent: false
    };

    /**
     * forgot password action
     * @type {Boolean}
     */
    $scope.forgotPassword = function (email) {
        auth.forgotPassword(email, captcha.get_challenge(), captcha.get_response())
            .success(function (result) {
                $scope.forgotStatus.forgotFormSent = true;
            }).error(function (error) {
                $scope.forgotStatus.status = error.callStatus.status;
                $scope.forgotStatus.message = error.callStatus.error.message;
            });
    };

}]);
});