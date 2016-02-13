define(['./index'], function(services) {
    function NearbyCitiesService(locale, $q) {
        var toGeo = function(cities) {
            cities = cities || [];
            var nearby = cities.shift();

            return {
                nearestCity: nearby
                , nearbyCities: cities
            };
        };
        var loadCities = function (location_) {
            var deferred = $q.defer();
            locale.getNearbyCities(location_).then(function(res) {
                return deferred.resolve(toGeo(res));
            }, function (res) { 
                return deferred.reject(res);
            });
            return deferred.promise;
        };
        
        var svc = {
            initialize: function() { 
                return loadCities(); 
            }
            , selectCity: function(location_) { 
                locale.setLocale(location_);
                return loadCities(location_); 
            }
        }
        return svc;

    };

    services.factory('nearbyCities', ['locale', '$q', NearbyCitiesService]);

    return NearbyCitiesService;
});
