/**
 * Defines the main routes in the application. The routes you see here will be anchors '#/sso/home' unless specifically configured otherwise.
 */
define(['./app'], function (app) {
    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/home', { templateUrl: 'partials/home.html', controller: 'home' });
        $routeProvider.when('/sso/register', { templateUrl: 'partials/sso/register.html', controller: 'auth' });
        $routeProvider.when('/sso/forgotPassword', { templateUrl: 'partials/sso/forgotPassword.html', controller: 'forgotPassword' });
        $routeProvider.when('/sso/confirmEmail/:token', { templateUrl: 'partials/sso/confirmEmail.html', controller: 'confirmEmail' });
        $routeProvider.when('/sso/resetPassword/:token', { templateUrl: 'partials/sso/resetPassword.html', controller: 'resetPassword' });
        $routeProvider.when('/sso/changePassword', { templateUrl: 'partials/sso/changePassword.html', controller: 'changePassword' });
        $routeProvider.when('/sell/:step', {templateUrl:'partials/sell/sell.html', controller:'sell'});
        $routeProvider.when('/sell', {redirectTo:'/sell/video'});
        $routeProvider.otherwise({ redirectTo: '/home' });

        $routeProvider.when('/item/view/:sellerId/:slug', {templateUrl: 'partials/item/view.html', controller: 'itemView'});

        //$locationProvider.html5Mode(true);
    }]);
});
