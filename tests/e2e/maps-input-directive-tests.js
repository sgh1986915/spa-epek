define(['chai',  'app/directives/maps-input-directive', 'app/services/vendor-services', 'angular-mocks'], function (chai, MapsInputDirective) {
    beforeEach(module('epek.directives'));


    describe('place_changed', function() {
        describe('given hash map to format', function (){
            it('should format accordingly', function (){
                var locale = {
                    countryCode: "US"
                    ,latLng: {
                        Ya: 33.7227
                        ,Za: -85.79352
                    }
                    ,location: '33.7227, -85.79352'
                };

                module(function($provide){
                    $provide.value('googleMapsLocale', {
                        getLocale: function() {
                            return locale;
                        }
                        , calculateBounds: function (){ 
                            return null;
                        }
                    });
                });
                inject(function($compile, $rootScope){
                    var scope = $rootScope.$new();
                    var element = $compile('<input id="meh" type="text" data-maps-places="{myModel:\'point\'}" />')(scope);
                    element.text('B');
                    console.log('doc', document.getElementById('meh'));
                    waitsFor(function() {
                        var els = document.getElementsByClassName('.pac-container');
                        return scope['myModel']!=null;
                    }, "model value never set", 5000);
                    runs(function (){
                        scope['myModel'].should.equal('33.7227, -85.79352');
                    });
                });

            });

        });

    });

//                var map =  {
//                    'my.model': 'point'
//                    , 'anothermodel': 'cityState'
//                };
//                var place = {
//                        "address_components" : [
//                            {
//                            "long_name" : "1600",
//                            "short_name" : "1600",
//                            "types" : [ "street_number" ]
//                            },
//                            {
//                            "long_name" : "Amphitheatre Pkwy",
//                            "short_name" : "Amphitheatre Pkwy",
//                            "types" : [ "route" ]
//                            },
//                            {
//                            "long_name" : "Mountain View",
//                            "short_name" : "Mountain View",
//                            "types" : [ "locality", "political" ]
//                            },
//                            {
//                            "long_name" : "Santa Clara",
//                            "short_name" : "Santa Clara",
//                            "types" : [ "administrative_area_level_2", "political" ]
//                            },
//                            {
//                            "long_name" : "California",
//                            "short_name" : "CA",
//                            "types" : [ "administrative_area_level_1", "political" ]
//                            },
//                            {
//                            "long_name" : "United States",
//                            "short_name" : "US",
//                            "types" : [ "country", "political" ]
//                            },
//                            {
//                            "long_name" : "94043",
//                            "short_name" : "94043",
//                            "types" : [ "postal_code" ]
//                            }
//                        ],
//                        "formatted_address" : "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
//                        "geometry" : {
//                            "location" : {
//                            "lat" : 37.42291810,
//                            "lng" : -122.08542120
//                            },
//                            "location_type" : "ROOFTOP",
//                            "viewport" : {
//                            "northeast" : {
//                                "lat" : 37.42426708029149,
//                                "lng" : -122.0840722197085
//                            },
//                            "southwest" : {
//                                "lat" : 37.42156911970850,
//                                "lng" : -122.0867701802915
//                            }
//                            }
//                        },
//                        "types" : [ "street_address" ]
//                    };

});
