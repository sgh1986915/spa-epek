define(['./../index'], function (controllers) {
/**
 * controller fired on /sso/confirmEmail/:token route
 * sends :token value to backend to provide confirmation
 */
controllers.controller('confirmEmail', ['$scope', 'auth', '$routeParams', function ($scope, auth, $routeParams) {
    'use strict';

    $scope.status = '';
    $scope.statusMessage = '';
    $scope.token = $routeParams.token;

    /**
     * handles successful confirmation,
     * displays status
     * @param response - XHR response JSON object
     */
    var confirmSuccess = function (response) {
        console.log('confirmSuccess', response);
        $scope.status = response.status;
    };

    /**
     * handles unsuccessful confirmation,
     * displays status and failure message
     * @param response - XHR response JSON object
     */
    var confirmError = function (response) {
        console.log('confirmError', response);
        $scope.status = response.status;
        $scope.statusMessage = response.callStatus.error.message;
    };

    $scope.confirmEmail = function () {
        auth.confirmEmail($scope.token)
            .success(confirmSuccess)
            .error(confirmError);
    };

    //fire confirmation action if token provided in url
    if ($scope.token !== undefined) {
        $scope.confirmEmail();
    }
}]);
});
