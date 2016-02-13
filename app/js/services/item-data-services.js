/*
 * Define services related to item viewing
 */


define(['./index', '../config'], function (services) {
services.factory('itemData', ['config', '$http', function(config, $http) {
    
    return {
        /*
         * @param sellerId {string} mandatory
         * @param slug {string} mandatory
         * @return {*} http promise
         */
        get_info: function(sellerId, slug) {
            return $http({
                url: config.ITEM_ROOT + "/" + sellerId + "/" + slug + "/info",
                method: "GET"
            });
        },

        /*
         * @param sellerId {string} mandatory
         * @param slug {string} mandatory
         * @return {*} http promise
         */
        get_description: function(sellerId, slug) {
            return $http({
                url: config.ITEM_ROOT + "/" + sellerId + "/" + slug + "/description.txt.json",
                method: "GET"
            });
        }
    };
}]);
});
