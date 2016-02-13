define(['./../index', '../../services/auth-service', '../../services/window-location-service'], function (controllers) {
controllers.controller('auth', ['captcha', '$scope', '$rootScope', '$location', 'auth', 'windowLocation', function (captcha, $scope, $rootScope, $location, auth, windowLocation) {
    'use strict';

    $scope.user = $scope.user || {};

    $scope.authStatus = {
        status: '',
        message: '',
        formStatus: '',
        useridStatus: ''
    };

    /**
     * handler for managing form displayed
     */
    $scope.setFormStatus = function (status) {
        var availableFormStatuses = ['simpleLogin', 'openIdLogin', 'simpleAuth', 'openIdAuth', ''];
        if (availableFormStatuses.indexOf(status) !== -1) {
            $scope.authStatus.formStatus = status;
        }
    };

    $scope.reset = function (event) {
        event.preventDefault();
        $scope.authStatus.status = '';
        $scope.authStatus.message = '';
        $scope.setFormStatus('');
    };

    /**
     * @param response API response JSON object
     */
    function handleRegisteredUser (response) {
        var openIdSettings = response.prefersOpenId;

        if (openIdSettings.isPreferred && openIdSettings.openIdUrl.length) {
            $scope.user.openIdUrl = openIdSettings.openIdUrl;
            handleOpenIdRedirect();
        } else {
            handleSimpleLogin();
        }
    }

    /**
     * redirects user to $scope.user.openIdUrl param
     */
    function handleOpenIdRedirect () {
        windowLocation.href($scope.user.openIdUrl);
    }

    /**
     * display simple login form
     */
    function handleSimpleLogin () {
        $scope.setFormStatus('simpleLogin');
    }

    /**
     * @param response API response JSON object
     */
    function handleUnregisteredUser (response) {
        var registration = response.registration;
        if (registration.openIdSupported.isSupported) {
            $scope.setFormStatus('openIdAuth');
            $scope.user.openIdUrl = registration.openIdSupported.openIdRegistrationUrl;
        } else {
            $scope.setFormStatus('simpleAuth');
        }
    }

    /**
     * @param response API response JSON object
     */
    function handleNotConfirmedUser (response) {
        //@TODO there will go some more hardcore logic
        $scope.authStatus.message = "Email not confirmed";
        $scope.authStatus.status = 'notConfirmed';
    }

    /**
     * @param response API response JSON object
     */
    function handleDisabledUser (response) {
        //@TODO there will go some more hardcore logic
        $scope.authStatus.message = 'Account disabled';
        $scope.authStatus.status = 'disabled';
    }

    /**
     * initial request to API::discover with email provided by user
     * @param email
     */
    $scope.discover = function (email) {
        //precheck email value
        if ($scope.discoverForm !== undefined && $scope.discoverForm.email.$invalid) return false;

        auth.discover(email, {
            redirectUrl: $location.absUrl().replace($location.path(), '/sso/home')// controller to handle logged in users
        }).success(function (result) {
            //switch based on user registration status
            switch (result.response.registration) {
                case true:
                    handleRegisteredUser(result.response);
                    break;
                case 'disabled':
                    handleDisabledUser(result.response);
                    break;
                case 'notConfirmed':
                    handleNotConfirmedUser(result.response);
                    break;
                default:
                    handleUnregisteredUser(result.response);
                    break;
            }

        }).error(function (error) {
            $scope.authStatus.status = error.status;
            $scope.authStatus.message = error.callStatus.error.message;
        });
    };

    /**
     * dispose open id registration
     */
    $scope.skipOpenId = function () {
        $scope.setFormStatus('simpleAuth');
    };

    /**
     * confirm intention of open id usage
     */
    $scope.useOpenId = function () {
        if ($scope.user.userId === undefined) return false;
        $scope.checkUsername($scope.user.userId, $scope.user.email, function () {
            //redirect user to openId authorisation url, after userid agreed
            handleOpenIdRedirect();
        });
    };

    /**
     * @param user object with user properties
     */
    $scope.register = function (user) {
        $scope.user.captchaChallenge = captcha.get_challenge();
        $scope.user.captchaResponse = captcha.get_response();

        auth.registerUserId(user)
            .success(function (result) {
                $scope.authStatus.message = 'Registration succeeded';
            }).error(function (error) {
                $scope.authStatus.status = error.status;
                $scope.authStatus.message = error.callStatus.error.message;
            });
    };

    /**
     * checks provided username for availability
     * @param userId
     * @param email
     */
    $scope.checkUsername = function (userId, email, successCallback) {
        //check userId against not allowed values
        if (['epek', 'support', 'payment', 'department', 'e-pek', 'tag', 'sell'].indexOf(userId) !== -1) {
            $scope.$broadcast('auth/error', 'failure', 'This userid is not allowed.');
            return false;
        }

        //we can check userid with or without email provided.
        //if it's set, userid becomes blocked for this email for a certain time
        if (!email) email = '';

        auth.checkUsernameAvailability(
            userId,
            email,
            function (result) {
                //handle userid field validation
                if (result.response.status === true) {
                    $scope.authStatus.useridStatus = 'success';
                    if (angular.isFunction(successCallback)) {
                        successCallback(result);
                    }
                } else {
                    $scope.authStatus.useridStatus = 'failure';
                }

            },
            function (error) {
                $scope.authStatus.useridStatus = '';
                $scope.authStatus.status = error.status;
                $scope.authStatus.message = error.callStatus.error.message;
            }
        );
    };


    /**
     * send email/pass to api
     * @param email
     * @param password
     */
    $scope.loginUser = function (email, password) {
        auth.authUserId(email, password)
            .success(function (result) {
                $scope.authStatus.message = 'Login success';
                $scope.authStatus.status = result.status;
                $scope.user.sessionId = result.response.sessionId;
                $scope.user.userId = result.response.userId;

                //@todo handle user authorisation
                $location.path("/home");
            }).error(function (error) {
                $scope.authStatus.status = error.status;
                $scope.authStatus.message = error.callStatus.error.message;
            });
    };

}]);
});
