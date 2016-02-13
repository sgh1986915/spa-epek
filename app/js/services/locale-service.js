define(['./index', 'moment', 'accounting', './cookie-service'], function (services) {
/**
 **locale service** provides locale information based on user IP
 and handles storage of locale information into a cookie
 */
function LocaleService($rootScope, config, cookies, $http, $q) {

    var LOCALE_COOKIE_KEY = 'locale.epek.com';
    /*storage for locale having been cached
     * this is set either upon `init` or upon user changing locale
     * */
    var cachedLocale;

    /* 
     * calls API getLocaleByLocation and stores location in cookie
     * @param {String} location_ (required)
     * @returns Promise object which
     *  `then` @resolves to a new `Locale` object on success
     * */
    var setLocaleByLocation = function setLocaleByLocation(location_) {
        if(!location_) {
            throw new Error('location is required');
        }
        var deferred = $q.defer();
        var handleSuccess = function(response) {
            //body is namespaced to `.response`
            var res = response.data.response;
            res.location = location_;
            cachedLocale = new Locale(res);
            cookies.put(LOCALE_COOKIE_KEY, {location: cachedLocale.location});
            deferred.resolve(cachedLocale);
        };
        var handleError = function(data) {
            deferred.reject(data);
        };
        var xhr = {
            params: {
                location: location_
            }
        };
        $http.get(config.UTIL_ROOT + 'getLocaleByLocation', xhr).
            then(handleSuccess,handleError);
        return deferred.promise;
    };
    /* 
     * calls API getLocaleByIp and stores location in cookie
     * @returns Promise object which
     *  `then` @resolves to a new `Locale` object on success
     * */
    var setLocaleByIp = function setLocaleByIp() {
        var deferred = $q.defer();
        var handleSuccess = function(response) {
            //body is namespaced to `.response`
            var res = response.data.response;
            cachedLocale = new Locale(res);
            cookies.put(LOCALE_COOKIE_KEY, {location: cachedLocale.location});
            deferred.resolve(cachedLocale);
        };
        var handleError = function(data) {
            deferred.reject(data);
        };
        $http.get(config.UTIL_ROOT + 'getLocaleByIp').
            then(handleSuccess,handleError);
        return deferred.promise;
    };

    

    /* Locale object
     * namespaces response from API 
     * and sets language Code as default to first countryLocale's lang code
     * */
    var Locale = function Locale(res) {
        var self = {
            countryCode: res.countryCode
            ,languageCode: res.countryLocale[0].languageCode
            ,countryLocales: (res.countryLocale || [])
            ,currency: {
                symbol: res.currencySymbol
                ,id: res.currencyId
                ,decimalSeparator: (res['.'] || '.')
                ,thousandsSeparator: (res[','] || ',')
            }
            ,location:(res.location || location_)
        };
        
        return self;

    };
    return {
        /* for testing, force locale object */
        _cacheLocale: function(locale) {
            cachedLocale = locale;
            cookies.put(LOCALE_COOKIE_KEY, cachedLocale.location);
        }

        /* creates Locale object from api response
         * no change to app state here
         * */
        ,createLocale: Locale

        /* gets the current Locale for user */
        ,getLocale: function() {
            if(!cachedLocale) {
                throw new Error('locale has not been cached');
            }
            return cachedLocale;
        }

        /** sets locale based on `location_` parameter (required)
         */
        ,setLocale: function(location_) {
            if(!location_) {
                return setLocaleByIp();
            } else {
                return setLocaleByLocation(location_);
            }
        }
        /** *getNearbyCities*
         * gets nearby cities based on user location (async)
         * @returns {Promise} 
         *  @onSuccess returns {Array} of city objects, each:
         *     @params {String} toponymName
         *     @params {String} name
         *     @params {String} location
         *     @params {String} population
         *     @params {String} countryCode
         *     @params {Number} distance
         */
        ,getNearbyCities: function (location_) {
            var deferred = $q.defer();
            if(!location_ && !cachedLocale) {
                throw new Error('location has not been initialized');
            }
            location_ = (location_ || cachedLocale.location);
            var xhr = {
                params: {
                    location: location_
                    ,maxRows: 10 //default count
                }
            };
            
            var onSuccess = function(res) { deferred.resolve(res.data.response); }
            var onError = function(res) { deferred.reject(res.data); }
            $http.get(config.UTIL_ROOT+'nearbyCity', xhr).then(onSuccess, onError);
            return deferred.promise;
        }
        /** **init**; if locale cookie is not present, 
         fetches locale info by IP and stores in cookie. (async)
         if multiple languageCodes are available the _first_ languageCode
         is considered the `default`
         */
        ,init: function() {
            var cookie = cookies.get(LOCALE_COOKIE_KEY);
            var location_ = cookie ? cookie.location : undefined;
            this.setLocale(location_).then(function(locale) {
                $rootScope.serviceReady('locale');
            });
        }
    }
};
services.factory('locale', ['$rootScope', 'config', 'cookies', '$http', '$q', LocaleService]);

return LocaleService;

});
