define(['./index', 'angular'], function(directives, angular) {
'use strict';

/***
 * @usage: 
 *   <!--provide ngModel as string to attribute (ie, 'locationModel') -->
 *   <input type='text' data-maps-places='locationModel' data-maps-restrict='country' data-maps-bias='current' />
 *   <!--provide format map as object to attribute -->
 *   <!--this formats the place object before assigning to the model in the hash -->
 *   <input type='text' data-maps-places='{locationModel: "point"}' data-maps-restrict='country' data-maps-bias='current' />
 * @attrs:
 *    @params {Object} maps-input: The scope object to bind the google 'placeResult' object to
 *      @ref : https://google-developers.appspot.com/maps/documentation/javascript/reference#PlaceResult
 *    @params {String} maps-restrict: {'country'} restrict results to _current_ country
 *    @params {String} maps-bias: {'current'} bias results toward current city
 *    **/
var MapsInputDirective = function MapsInputDirective(googleMapsLocale, googleMaps, $parse) {
    /*** formatters available for maps
     * reference these in the DOM element as part of a 
     * hash of model to format
     * eg,
     * {myLocationModel: 'point'}
     * // this would format the place using the 'point'
     * // formatter before applying to the 'myLocationModel'
     * ***/
    var formatters = {
        /***
         * formats `place` returned by google api
         * in format : <{city},[space]{state}>
         * **/
        cityState: function(place) {
            //https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
            var firstOfType = function (type){
                for(var i = 0;i<place.address_components.length;i++) {
                    var comp = place.address_components[i];
                    for(var j=0;j < comp.types.length; j++) {
                        var t = comp.types[j];
                        if(t===type) {
                            return comp;
                        }
                    }
                }
                return null;
            };
            var city = firstOfType('locality');
            var state = firstOfType('administrative_area_level_1');
            if(!city || !state) {
                throw new Error('city and state could not be determined');
            }
            return [city.long_name,state.short_name].join(', ');
        }
        /***
         * formats `place` returned by google api
         * in format : <{latitude},[space]{longtitude}>
         * **/
        , point: function(place) {
            return place.geometry.location.toString();
        }
    };
    /***
     * does heavy lifting for applying formatted
     * place (if applicable) to model
     * ***/
    var applyPlace = function (scope, attrs, place){
        scope.$apply(function (){
            var target = scope.$eval(attrs.mapsPlaces);
            //is target an object?
            if(target === Object(target)) {
                    for(var k in target) {
                        var fmt = formatters[target[k]];
                        //format place
                        var formatted = fmt(place);
                        //get out setter for the attribute's model refernece
                        var set = $parse(k).assign;
                        set(scope, formatted);
                    }
            } else {
                var set = $parse(attrs.mapsPlaces).assign;
                
                set(scope, place);
            }
        });
    };

    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            var input = elm[0];
            var bindEvent = function(control, eventName) {
                googleMaps.event.addListener(control, eventName, function() {
                    applyPlace(scope, attrs, control.getPlace());
                });
            }
            var locale= googleMapsLocale.getLocale();
            var options = {
                types: ['(cities)']
            };

            if(attrs.mapsRestrict && attrs.mapsRestrict==='country') {
                options.componentRestrictions = {
                    country: locale.countryCode
                };
            };
            if(attrs.mapsBias && attrs.mapsBias==='current') {
                var cfg = {
                    center: locale.latLng
                }
                options.bounds = googleMapsLocale.calculateBounds(cfg);
            };
            var autocomplete = new googleMaps.places.Autocomplete(input, options);
            bindEvent(autocomplete, 'place_changed');
            return autocomplete;
        }
    };
};
directives.directive('mapsPlaces', ['googleMapsLocale', 'googleMaps', '$parse', MapsInputDirective]);


return MapsInputDirective;
});
