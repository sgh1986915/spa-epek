define(['chai', 'app/directives/maps-input-directive', 'angular-mocks'], function(chai, MapsInputDirective) {

var expect = chai.expect;
var should = chai.should();
beforeEach(module('epek.directives'));

var placeResponse = {
        "address_components" : [
            {
            "long_name" : "1600",
            "short_name" : "1600",
            "types" : [ "street_number" ]
            },
            {
            "long_name" : "Amphitheatre Pkwy",
            "short_name" : "Amphitheatre Pkwy",
            "types" : [ "route" ]
            },
            {
            "long_name" : "Mountain View",
            "short_name" : "Mountain View",
            "types" : [ "locality", "political" ]
            },
            {
            "long_name" : "Santa Clara",
            "short_name" : "Santa Clara",
            "types" : [ "administrative_area_level_2", "political" ]
            },
            {
            "long_name" : "California",
            "short_name" : "CA",
            "types" : [ "administrative_area_level_1", "political" ]
            },
            {
            "long_name" : "United States",
            "short_name" : "US",
            "types" : [ "country", "political" ]
            },
            {
            "long_name" : "94043",
            "short_name" : "94043",
            "types" : [ "postal_code" ]
            }
        ],
        "formatted_address" : "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
        "geometry" : {
            "location" : {
            "lat" : 37.42291810,
            "lng" : -122.08542120
            },
            "location_type" : "ROOFTOP",
            "viewport" : {
            "northeast" : {
                "lat" : 37.42426708029149,
                "lng" : -122.0840722197085
            },
            "southwest" : {
                "lat" : 37.42156911970850,
                "lng" : -122.0867701802915
            }
            }
        },
        "types" : [ "street_address" ]
    };
var placeResult = {
    address_components: placeResponse.address_components
    , geometry: {
        location: {
            toString: function() {
                return '37.42291810, -122.08542120';
            }
        }
    }
};



describe('mapsInputDirective', function() {
    describe('init', function() {
        it('should exist', function(){

            should.exist(MapsInputDirective);

        });

    });
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
                var ac = null;
                var AC = function AC(input, opts) {
                    var self = {
                        input: input
                        ,opts: opts
                        ,name: 'ac'
                        ,events: {}
                        ,fire: function(e) {
                            this.events[e.event](e.data);
                        }
                        ,getPlace: function() { 
                            return placeResult;
                        }
                    };
                    ac = self;
                    return self;
                };
                
                var maps = {
                    places: {
                        Autocomplete: AC
                    }
                    ,'event': {
                        addListener: function(ctl, ev, fn) {
                            ctl.name.should.equal('ac');
                            ev.should.equal('place_changed');
                            ctl.events[ev]=fn;
                        }
                    }
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
                    $provide.value('googleMaps', maps);
                });
                inject(function(googleMapsLocale, googleMaps, $parse, $rootScope, $compile){
                    var scope = $rootScope.$new();
                    var el = '<input name="ac" type="text" data-maps-places="{\'myModel\':\'point\', \'deep.model\':\'cityState\'}" />';
                    var sut = $compile(el);
                    sut(scope);
                    ac.fire({
                        event: 'place_changed'
                        , data: placeResult
                    });
                    
                    var latLng = '37.42291810, -122.08542120';
                    scope['myModel'].should.equal(latLng);
                    scope.deep.model.should.equal('Mountain View, CA');
                });

            });

        });

    });

    describe('#link', function() {
        describe('given country restriction attribute', function() {
            it('should use current locale for result bias', function() {
                var elm = [
                    '<input type="text" name="ac"/>'
                ];
                var AC = function AC(input, opts) {
                    var self = {
                        input: input
                        ,opts: opts
                        ,name: 'ac'
                    };
                    return self;
                };
                
                var maps = {
                    places: {
                        Autocomplete: AC
                    }
                    ,'event': {
                        addListener: function(ctl, ev, fn) {
                            ctl.name.should.equal('ac');
                            ev.should.equal('place_changed');
                        }
                    }
                };
                var locale = {
                    calculateBounds: function(ll) {
                        if(ll.center && ll.center==='YY')
                            return '1,2';
                    }
                    ,getLocale: function() {
                        return {
                            countryCode: 'XX'
                            ,latLng: 'YY'
                        }
                    }
                };
                var sut = new MapsInputDirective(locale, maps);
                var attrs = {
                    mapsRestrict: 'country'
                };
                var ac = sut.link({}, elm, attrs);
                ac.input.should.equal('<input type="text" name="ac"/>');
                ac.opts.should.eql({
                    types: ['(cities)']
                    ,componentRestrictions: {
                        country: 'XX'
                    }
                });
            });
        });
        describe('given current bias attribute', function() {
            it('should use current locale for result bias', function() {
                var elm = [
                    '<input type="text" name="ac"/>'
                ];
                var AC = function AC(input, opts) {
                    var self = {
                        input: input
                        ,opts: opts
                        ,name: 'ac'
                    };
                    return self;
                };
                
                var maps = {
                    places: {
                        Autocomplete: AC
                    }
                    ,'event': {
                        addListener: function(ctl, ev, fn) {
                            ctl.name.should.equal('ac');
                            ev.should.equal('place_changed');
                        }
                    }
                };
                var locale = {
                    calculateBounds: function(ll) {
                        if(ll.center && ll.center==='YY')
                            return '1,2';
                    }
                    ,getLocale: function() {
                        return {
                            countryCode: 'XX'
                            ,latLng: 'YY'
                        }
                    }
                };
                var sut = new MapsInputDirective(locale, maps);
                var attrs = {
                    mapsBias: 'current'
                };
                var ac = sut.link({}, elm, attrs);
                ac.input.should.equal('<input type="text" name="ac"/>');
                ac.opts.should.eql({
                    types: ['(cities)']
                    ,bounds: '1,2'
                });
            });
        });

    });

});

});
