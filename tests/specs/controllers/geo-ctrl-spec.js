define(['chai', 'angular-mocks', 'app/controllers/geo-ctrl'], function (chai, ngMocks, GeoCtrl) {

var expect = chai.expect;
var should= chai.should();
describe('geo-ctrl', function () {
    beforeEach(module('epek.controllers'));

    describe('init', function () {
        var scope;
        describe('when initializing', function () {
            beforeEach(function () {

                module(function($provide) {
                    $provide.value('nearbyCities', {
                        initialize: function() {
                            return {
                                    nearestCity: {
                                        name: 'Anniston'
                                    },nearbyCities: [
                                        {name: 'Rome' }
                                        , {name: 'Jacksonville' }
                                    ]
                            };
                        }
                    });
                });


                inject(function ($rootScope, $controller) {
                    scope = $rootScope.$new();
                    var ctl = $controller('geo', {
                        $scope: scope
                    });
                });

            });
            it('should place nearbyCities geo on scope', function () {
                scope.geo.should.eql({
                    nearestCity: { name: 'Anniston'}
                    , nearbyCities: [
                        {name: 'Rome' }
                        , {name: 'Jacksonville' }
                    ]
                });
            });

            it('should init browsingCities flag', function() {
                scope.browsingCities.should.be.false;

            });


        });
    });

    describe('browseCities', function() {
        var scope, e;
        beforeEach(function() {
            scope = {};
            var nearbyCities = {
                initialize: function() {}
                ,selectCity: function() {}
            }
            var sut = new GeoCtrl(scope,nearbyCities);
            e = { preventDefault: function(){ this.defaultPrevented=true;}};
            sut.browseCities(e);
        });
        it('should preventDefault', function() {
            e.defaultPrevented.should.be.true;
        });

        it('should flag scope as browsingCities', function() {
            scope.browsingCities.should.be.true
        });

    });

    describe('selectCity', function () {
        var scope, e;
        beforeEach(function () {
            e = { preventDefault: function () {}};
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

            module(function($provide) {
                $provide.value('nearbyCities', {
                    initialize: function(){
                        return { then: function(){}}
                    }
                    ,selectCity: function (location_) {
                        if(location_==='234,-234') {
                            return {
                                nearestCity: { name: 'Anniston'}
                                ,nearbyCities: [
                                    {name: 'Rome' }
                                    , {name: 'Jacksonville' }
                                ]
                            };
                        } else {
                            return {bad: 'invocation'};
                        }
                    }
                });
            });
            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                var ctl = $controller('geo', {
                    $scope: scope
                });
            });
        });
        it('should preventDefault', function () {
            var prevented = false
            var e = {
                preventDefault: function () { prevented = true; }
            }
            scope.selectCity(e, '234,-234');
            prevented.should.be.true;
        });

        it('should change nearestCity to selection', function () {
            scope.selectCity(e, '234,-234');
            scope.geo.nearestCity.should.eql({
                name: 'Anniston'
            });
        });

        it('should reload nearby cities based on selection', function () {
            scope.selectCity(e, '234,-234');
            scope.geo.nearbyCities.should.eql([
                {name: 'Rome' }
                ,{name: 'Jacksonville' }
                ]);
        });

    });



});
});
