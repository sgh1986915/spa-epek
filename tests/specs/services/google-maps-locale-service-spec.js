define(['chai', 'app/services/google-maps-locale-service', 'gmaps'], function(chai, LocaleService, googleMaps) {
'use strict';
var expect = chai.expect;
var should = chai.should();

describe('googleMapsLocaleService', function() {
    var googleMapsMock = {
        LatLng: function (lat, lng){
            return { lat: lat, lng: lng };
        }
        ,LatLngBounds: function(sw,ne) {
            return {
                sw: sw
                ,ne: ne
            };
        }
        ,geometry: {
            spherical: {
                calculateOffset: function(latLng, distance, heading) {
                    return {latLng:latLng, distance:distance, heading:heading};
                }
            }
        }
    };
    describe('init', function() {
        it('should exist', function() {
            should.exist(LocaleService);
        });

    });

    describe('getLocale', function() {
        var result, userLocation;
        beforeEach(function() {
            var userLocation = '33.7227, -85.79352';
            var inner = {
                getLocale: function() {
                    return {
                        location: userLocation
                    }
                }
            };
            var sut = new LocaleService(inner, googleMapsMock);
            result = sut.getLocale();
            result.location.should.equal(userLocation);
        });
        it('should decorate underlying location with coordinates', function(){
            should.exist(result.latLng);
            result.latLng.lat.should.equal(33.7227);
            result.latLng.lng.should.equal(-85.79352);
        });

    });

    describe('calculateBounds', function() {
        describe('given origin latLng', function() {
            it('should construct rectangle with origin in center', function() {
                var sut = new LocaleService({}, googleMaps);

                var cfg = {
                    center: new googleMaps.LatLng(33.7227, -85.79352)
                }


                var rect = sut.calculateBounds(cfg);
                rect.contains(cfg.center).should.be.true;

                var center = rect.getCenter();
                var centerStr = center.toString();
                var split = centerStr
                    .replace('(','')
                    .replace(')','')
                    .replace(' ','')
                    .split(',');

                Number(split[0]).toFixed(4).should.equal('33.7227');
                Number(split[1]).toFixed(4).should.equal('-85.7935');

            });
        });

    });

});

});
