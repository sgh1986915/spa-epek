define(['./index'], function(services) {

/** decorates locale-service with google maps
 * structs; ie LatLng, LatLngBounds
 * **/
var GoogleMapsLocaleService = function(locale, googleMaps) {
    var LatLng = googleMaps.LatLng
        ,LatLngBounds = googleMaps.LatLngBounds
        ,spherical = googleMaps.geometry.spherical;
    var createLatLng = function(locationStr) {
        if(!locationStr || !locationStr.length) {
            throw new Error('location string is required');
        }
        var parts = locationStr.split(',');
        if(!parts.length || parts.length < 2) {
            throw new Error('invalid location string: '+locationStr);
        }
        return new LatLng(Number(parts[0]), Number(parts[1]));
    };
    var self =  {
        /** gets decorated locale 
         * inserting the google maps LatLng representative of current location
         * **/
        getLocale: function() {
            var src = locale.getLocale();
            src.latLng = createLatLng(src.location);
            return src;

        }
        /** calculates a square with the origin in the center
         * @param {Object} cfg : the arguments to use in calculation
         *  @param {Number} ?distance: the (optional) distance (in meters) to span the resulting box;
         *      the default is 10,000 meters
         *  @param {LatLng|String} ?center: the (optional) center point to use as the center of the box;
         *      if no center is specified the current locale latLng is used.
         *  **/
        , calculateBounds: function(cfg) {
            var headings = {
                ne: 45
                ,west: -90
                ,south: 180
                ,north: 0
                ,east: 90
            };
            var DEFAULT_DISTANCE = 10000; //meters
            var center = cfg.center;
            var distance = cfg.distance || DEFAULT_DISTANCE;
                
            if(!center) {
                //fetch user locale for default LatLng
                center = self.getLocale().latLng;
            } else if(!center.lat || !center.lng) {
                //convert str to LatLng
                center = createLatLng(center);
            } 
            //construct our box, with our origin (center) in the center
            var west = spherical.computeOffset(center, distance, headings.west);
            var southwest = spherical.computeOffset(west, distance, headings.south);
            var east = spherical.computeOffset(center, distance, headings.east);
            var northeast = spherical.computeOffset(east, distance, headings.north);

            return new LatLngBounds(southwest, northeast);

        }

    };
    return self;

};

services.service('googleMapsLocale', ['locale','googleMaps', GoogleMapsLocaleService]);

return GoogleMapsLocaleService;

});
