define(['./../index', '../../services/item-data-services', '../../services/share-item-service', '../../services/window-location-service'], function (controllers) {
    "use strict";

/**
 * controller fired on /view/item route
 */
controllers.controller('itemView', ['$scope', '$route', '$routeParams', '$q', 'windowLocation', 'itemData', 'shareItem', function ($scope, $route, $routeParams, $q, windowLocation, itemData, shareItem) {
    'use strict';
    
    // set seller id
    $scope.sellerId = $routeParams.sellerId;
    // set item slug
    $scope.slug = $routeParams.slug;
    // set data for displaying messages
    $scope.data = {};

    /*
     * Wrapper for $window.location.replace
     * Why? In order to test redirect if the user clicks on button of service on which he is not authorized
     */
    $scope.redirect = function(url) {
        $scope.redirectURL = url;
        windowLocation.replace(url);
    };

    /*
     * Error handler if loading item data fails
     *
     * @param response {Object}
     */
    var loadItemDataError = function(response) {
        // some error happened, cannot go on
        $scope.data.status = 'error';
        $scope.data.message = 'Could not load data from item api.';
    };

    /*
     * Success handler for item data loading
     *
     * @param results {Array} contains results of promises
     */
    var loadItemDataSuccess = function(results) {
        // set item info
        $scope.info = results[0].data;
        // set item description
        $scope.description = results[1].data.description;
        
        // update state status
        $scope.data.status = 'success';
        $scope.data.message = '';
    };

    /*
     * Success handler on requesting authorization status
     *
     * @param {Object} result HTTP response
     */
    var shareItemSuccess = function(result) {
        if(result.data.callStatus && result.data.callStatus.status === 'success') {
            // Save info about what services authenticate us to post on behalf of user
            $scope.shareAuth = {
                facebook: result.data.response.facebookAuth,
                twitter: result.data.response.twitterAuth
            };
            $scope.shareDialogForAuthenticated = true;
        } else {
            $scope.shareDialogForUnauthenticated = true;
        }
    };

    /*
     * Success handler for removing authorization
     *
     * @param {Object} result HTTP response
     */
    var removeAuthorizationSuccess = function(result) {
        $scope.shareAuth = {facebook: false, twitter: false};
    };

    /*
     * Fail handler for all requests involved in item sharing
     */
    var shareItemFail = function(result) {
        // some error happened, cannot go on
        $scope.data.status = 'error';
        $scope.data.message = 'Could not load data from social api.';
    };

    /*
     * Success handler for gettings auth tokens
     *
     * @param {Object} result HTTP response
     */
    var getAuthTokenSuccess = function(result) {
        $scope.redirect(result.data.response.facebookAuthURL || result.data.response.twitterAuthURL);
    };

    /*
     * Load item data into $scope from Epek API
     *
     * @param sellerId {string} mandatory
     * @param slug {string} mandatory
     */
    $scope.loadItemData = function(sellerId, slug) {
        var promise = $q.all([
            itemData.get_info(sellerId, slug),
            itemData.get_description(sellerId, slug)
        ]).then(
            loadItemDataSuccess, 
            loadItemDataError
        );
    };

    /*
     * Show share dialog
     */
    $scope.showShareDialog = function() {
        shareItem.getAuthorizationStatus().then(
            shareItemSuccess,
            shareItemFail
        );
    };

    /*
     * Share on Facebook
     */
    $scope.shareOnFacebook = function() {
        if(!$scope.shareAuth.facebook) {
            shareItem.getAuthToken(['facebook'], document.location.href).then(
                getAuthTokenSuccess,
                shareItemFail
            );
        } else {
            shareItem.share('facebook', $scope.shareMessage, document.location.href);
        }
    };

    /*
     * Share on Twitter
     */
    $scope.shareOnTwitter = function() {
        // If user is not authorized, get token and redirect for auth
        if(!$scope.shareAuth.twitter) {
            shareItem.getAuthToken(['twitter'], document.location.href).then(
                getAuthTokenSuccess,
                shareItemFail
            );
        } else {
            shareItem.share('twitter', $scope.shareMessage, document.location.href);
        }
    };

    /*
     * Revoke authorization
     */
    $scope.removeAuthorization = function() {
        var promise = $q.all([
            shareItem.removeAuthorization('facebook'),
            shareItem.removeAuthorization('twitter')
        ]).then(
            removeAuthorizationSuccess,
            shareItemFail
        );
    };


    $scope.loadItemData($scope.sellerId, $scope.slug);
}]);
});
