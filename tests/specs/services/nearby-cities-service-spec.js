define(['chai', 'app/services/nearby-cities-service', 'angular-mocks'], function(chai, NearbyCitiesService) {
var expect = chai.expect;
var should= chai.should();
    
describe('nearby cities service', function() {
    
    describe('when initializing cities', function() {
        var geo, sut;
        beforeEach(function() {
            var locale = {
                getNearbyCities: function () {
                    return {
                        then: function (success){
                            var res = {
                                data: {
                                    response: [
                                        { name: 'Anniston' }
                                        , {name: 'Rome' }
                                        , {name: 'Jacksonville' }
                                    ]
                                }
                            };
                            success(res.data.response);
                        }
                    }
                }
            }
            inject(function($q) {
                sut = new NearbyCitiesService(locale, $q);
            });

        });
        it('should select closest city as location', function() {
            sut.initialize().then(function(geo) {
                geo.nearestCity.should.eql({
                    name: 'Anniston'
                });

            });
        });
        it('should provide nearby cities based on location', function () {
            sut.initialize().then(function(geo) {
                geo.nearbyCities.should.eql([
                    {name: 'Rome' }
                    , {name: 'Jacksonville' }
                ]);
            });
        });

    });

    describe('when selecting city', function() {
        var cityList, sut, localeSetting;

        beforeEach(function() {
            cityList = [
                [
                    {name: 'Alexandria'}
                    ,{name: 'Troy'}
                ]
                ,[
                    { name: 'Anniston' }
                    , {name: 'Rome' }
                    , {name: 'Jacksonville' }
                ]
            ];
            var locale = {
                setLocale: function(location_){
                    localeSetting = location_;
                }
                ,getNearbyCities: function (location_) {
                    return {
                        then: function (success){
                            if(location_==='234,-234') {
                                return success(cityList[1]);
                            }
                            return success(cityList[0]);
                        }
                    }
                }
            }
            inject(function($q) {
                sut = new NearbyCitiesService(locale, $q);
            });

        });
        it('should change nearestCity to selection', function () {
            sut.selectCity('234,-234').then(function(geo) {
                geo.nearestCity.should.eql({
                    name: 'Anniston'
                });
            });
        });

        it('should reload nearby cities based on selection', function () {
            sut.selectCity('234,-234').then(function(geo) {
                geo.nearbyCities.should.eql([
                    {name: 'Rome' }
                    ,{name: 'Jacksonville' }
                    ]);
            });
        });
        it('should set locale', function() {
            localeSetting.should.equal('234,-234');

        });

    });
});

});
