/**
 * Defines Services related to querying catalog.epek.com
 */
define(['./index'], function (services) {
    services.factory('catalog', ['$http', '$q', 'config', function ($http, $q, config) {
        'use strict';

        return {
            /**
             * calls api for category details
             *
             * @param sitename {string} received from locale as languageCode + '_' + countryCode
             * @param category {string} category name to load info of
             * @return {promise}
             */
            getCategory: function (sitename, category) {
                if (!category) throw 'Expected category to be passed (like: Root), got: ' + category;
                if (!sitename) throw 'Expected sitename to be passed (like: en-US), got: ' + sitename;

                return $http({url: config.CATALOG_ROOT + '/epek/' + sitename + '/' + category, method: 'GET'});
            }
        }
    }]);
});
