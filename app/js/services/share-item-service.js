/*
 * Define services related to item sharing
 */


define(['./index', '../config'], function (services) {
services.factory('shareItem', ['config', '$http', function(config, $http) {

    return {
        /*
         * Returns the status of the authorization
         * https://epekltd.jira.com/wiki/display/SOCIALNET/social.api#social.api-authorizationStatus
         *
         * @return {{facebookAuth: {boolean}, twitterAuth: {boolean}} http promise
         */
        getAuthorizationStatus: function() {
            return $http({
                url: config.SHARE_ROOT + "/authorizationStatus",
                withCredentials: true,
                method: "GET"
            });
        },

        /*
         * Get token(s) in order to authorize on a specific service
         * https://epekltd.jira.com/wiki/display/SOCIALNET/social.api#social.api-getAuthToken
         *
         * @param {Array} service ["facebook", "twitter"]
         * @param {string} redirectURL Where should be user redirected after authorization?
         *
         * @return {*} http promise
         */
        getAuthToken: function(service, redirectURL) {
            return $http({
                url: config.SHARE_ROOT + "/getAuthToken",
                method: "GET",
                withCredentials: true,
                params: {
                    service: service.join(','),
                    redirectURL: redirectURL
                }
            });
        
        },

        /*
         * Remove authorization
         * https://epekltd.jira.com/wiki/display/SOCIALNET/social.api#social.api-removeAuthorization
         *
         * @param service {string} "facebook" and/or "twitter"
         * @return {*} http promise
         */
        removeAuthorization: function(service) {
            return $http({
                url: config.SHARE_ROOT + "/removeAuthorization",
                method: "POST",
                withCredentials: true,
                data: {
                    service: service
                }
            });
         },

        /*
         * Post message on a specific service
         * https://epekltd.jira.com/wiki/display/SOCIALNET/social.api#social.api-share
         *
         * @param service {string} facebook or twitter
         * @param message {string} text to be posted
         * @param image {string} image url
         */
        share: function(service, message, image) {
            return $http({
                url: config.SHARE_ROOT + "/share",
                method: "POST",
                withCredentials: true,
                data: {
                    service: service,
                    message: message,
                    image: image
                }
            });
        }
    };
}]);
});

