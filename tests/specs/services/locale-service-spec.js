define(['chai', 'app/services/locale-service', 'angular-mocks'], function (chai, LocaleService) {
describe('locale', function () {
    var expect = chai.expect;
    var should = chai.should();
    describe('when creating locale from response', function() {
        it('should map to locale object', function() {
            var localeResponse = {
                    response: {
                        'currencyId': 'USD'
                        , 'countryLocale': [{
                            'languageCode': 'en-US'
                            ,'name': 'United States'
                            ,'languageName': 'U.S. English'
                            },{
                            'languageCode': 'es-US'
                            ,'name': 'Estados Unidos'
                            ,'languageName': 'espa\u00f10l'
                            }]
                        , 'location': '33.7227,-85.79352'
                        , 'countryCode': 'US'
                        , 'currencySymbol': '$'
                        , ',': ','
                        , '.': '.'
                    }
                };
            var sut = new LocaleService();
            var locale = sut.createLocale(localeResponse.response);
            locale.should.eql({
                'countryCode': 'US'
                ,'countryLocales': [{
                    'languageCode': 'en-US'
                    ,'name': 'United States'
                    ,'languageName': 'U.S. English'
                    },{
                    'languageCode': 'es-US'
                    ,'name': 'Estados Unidos'
                    ,'languageName': 'espa\u00f10l'
                    }]
                ,'languageCode': 'en-US'
                , 'location': '33.7227,-85.79352'
                ,'currency': {
                    'thousandsSeparator': ','
                    ,'decimalSeparator': '.'
                    ,'symbol': '$'
                    ,'id': 'USD'
                }
            });
        });
    });

    describe('when setting locale with location', function() {
        var sut, _$httpBackend, cookie;
        beforeEach(function() {
            var localeResponse = {
                    response: {
                        'currencyId': 'USD'
                        , 'countryLocale': [{
                            'languageCode': 'en-US'
                            ,'name': 'United States'
                            ,'languageName': 'U.S. English'
                            },{
                            'languageCode': 'es-US'
                            ,'name': 'Estados Unidos'
                            ,'languageName': 'espa\u00f10l'
                            }]
                        , 'location': '33.7227,-85.79352'
                        , 'countryCode': 'US'
                        , 'currencySymbol': '$'
                        , ',': ','
                        , '.': '.'
                    }
                };
            var config = {
                UTIL_ROOT: 'http://util.api.epek.com/'
            };
            var cookies = {
                put: function(k,v) {
                    if(k==='locale.epek.com'){
                        cookie = v;
                    }

                }
            };
            inject(function($rootScope, $injector, $q, $http){
                var $httpBackend = $injector.get('$httpBackend');
                _$httpBackend = $httpBackend;
                var params = {
                    location: '33.7227,-85.79352'
                };
                $httpBackend.when('GET','http://util.api.epek.com/getLocaleByLocation?location=33.7227%2C-85.79352')
                    .respond(localeResponse);
                
                sut = new LocaleService($rootScope, config, cookies, $http, $q);
            });
        });
        afterEach(function(){
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
        it('should make current locale based on location', function() {
            //todo check params for location
            var url= 'http://util.api.epek.com/getLocaleByLocation?location=33.7227%2C-85.79352';

            _$httpBackend.expect('GET', url);
            sut.setLocale('33.7227,-85.79352').then(function(locale) {
                locale.should.eql({
                    'countryCode': 'US'
                    ,'countryLocales': [{
                        'languageCode': 'en-US'
                        ,'name': 'United States'
                        ,'languageName': 'U.S. English'
                        },{
                        'languageCode': 'es-US'
                        ,'name': 'Estados Unidos'
                        ,'languageName': 'espa\u00f10l'
                        }]
                    ,'languageCode': 'en-US'
                    , 'location': '33.7227,-85.79352'
                    ,'currency': {
                        'thousandsSeparator': ','
                        ,'decimalSeparator': '.'
                        ,'symbol': '$'
                        ,'id': 'USD'
                    }
                });

            });
            _$httpBackend.flush();
            
        });
        it('should store location in cookie', function(){
            cookie.should.eql({
                location: '33.7227,-85.79352'
            });
        });

    });
    describe('when setting locale without location', function() {
        var sut, _$httpBackend, cookie;
        beforeEach(function() {
            var localeResponse = {
                    response: {
                        'currencyId': 'USD'
                        , 'countryLocale': [{
                            'languageCode': 'en-US'
                            ,'name': 'United States'
                            ,'languageName': 'U.S. English'
                            },{
                            'languageCode': 'es-US'
                            ,'name': 'Estados Unidos'
                            ,'languageName': 'espa\u00f10l'
                            }]
                        , 'location': '33.7227,-85.79352'
                        , 'countryCode': 'US'
                        , 'currencySymbol': '$'
                        , ',': ','
                        , '.': '.'
                    }
                };
            var config = {
                UTIL_ROOT: 'http://util.api.epek.com/'
            };
            var cookies = {
                put: function(k,v) {
                    if(k==='locale.epek.com'){
                        cookie = v;
                    }

                }
            };
            inject(function($rootScope, $injector, $q, $http){
                var $httpBackend = $injector.get('$httpBackend');
                _$httpBackend = $httpBackend;
                $httpBackend.whenGET('http://util.api.epek.com/getLocaleByIp')
                    .respond(localeResponse);
                
                sut = new LocaleService($rootScope, config, cookies, $http, $q);
            });
        });
        afterEach(function(){
            _$httpBackend.verifyNoOutstandingExpectation();
            _$httpBackend.verifyNoOutstandingRequest();
        });
        it('should make current locale based on ip', function() {
            var url =  'http://util.api.epek.com/getLocaleByIp';
            _$httpBackend.expect('GET', url);
            sut.setLocale().then(function(locale) {
                locale.should.eql({
                    'countryCode': 'US'
                    ,'countryLocales': [{
                        'languageCode': 'en-US'
                        ,'name': 'United States'
                        ,'languageName': 'U.S. English'
                        },{
                        'languageCode': 'es-US'
                        ,'name': 'Estados Unidos'
                        ,'languageName': 'espa\u00f10l'
                        }]
                    ,'languageCode': 'en-US'
                    , 'location': '33.7227,-85.79352'
                    ,'currency': {
                        'thousandsSeparator': ','
                        ,'decimalSeparator': '.'
                        ,'symbol': '$'
                        ,'id': 'USD'
                    }
                });

            });
            _$httpBackend.flush();
            
        });
        it('should store location in cookie', function(){
            cookie.should.eql({
                location: '33.7227,-85.79352'
            });
        });

    });

    describe('init', function() {
        describe('when cookie is not present', function() {
            var localeSetTo, svcReady, cookie;
            beforeEach(function() {
                    
                var cookies = {
                    get: function (k) {
                        if(k==='locale.epek.com') {
                            return null; 
                        }
                        throw new Error('bad cookie');
                    }
                    ,put: function(k,v) {
                        if(k==='locale.epek.com'){
                            cookie = v;
                        }

                    }
                };

                var $rootScope = {
                    serviceReady: function(svc) { svcReady = svc; }
                }
                    
                sut = new LocaleService($rootScope, null, cookies, null, null);
                sut.setLocale = function(location_){ 
                    localeSetTo = location_; 
                    return {then:function(cb){cb()}};
                };
                sut.init();
            });
            it('should setLocale by ip', function() {
                expect(localeSetTo).isUndefined;
            });
            it('should invoke serviceReady', function() {
                svcReady.should.equal('locale');
            });
        });
        describe('when cookie is present', function() {
            var localeSetTo, svcReady, cookie;
            beforeEach(function() {
                    
                var cookies = {
                    get: function (k) {
                        if(k==='locale.epek.com') {
                            return { 
                                location: '123,-123'
                            };
                        }
                        return null;
                    }
                    ,put: function(k,v) {
                        if(k==='locale.epek.com'){
                            cookie = v;
                        }

                    }
                };

                var $rootScope = {
                    serviceReady: function(svc) { svcReady = svc; }
                }
                    
                sut = new LocaleService($rootScope, null, cookies, null, null);
                sut.setLocale = function(location_){ 
                    localeSetTo = location_; 
                    return {then:function(cb){cb()}};
                };
                sut.init();
            });
            it('should setLocale with locale in cookie', function() {
                localeSetTo.should.equal('123,-123');
            });
            it('should invoke serviceReady', function() {
                svcReady.should.equal('locale');
            });
        });

    });
    describe('getNearbyCities', function () {
        describe('given no location', function () {
            var sut, _$httpBackend;
            beforeEach(function() {
                var cities = {
                    response: [
                        {name: 'Anniston'}
                        ,{name: 'Rome'}
                        ,{name: 'Jacksonville'}
                    ]
                }
                var cookies = {
                    put: function(){}
                }
                var config = {
                    UTIL_ROOT: 'http://util.api.epek.com/'
                };
                inject(function($rootScope, $injector, $q, $http){
                    var $httpBackend = $injector.get('$httpBackend');
                    _$httpBackend = $httpBackend;
                    var xhr = {
                        params:{
                            location: '234,-234',
                            maxRows: 10
                        }
                    };
                    $httpBackend.when('GET','http://util.api.epek.com/nearbyCity?location=234%2C-234&maxRows=10').respond(cities);

                    
                    sut = new LocaleService($rootScope, config, cookies, $http, $q);
                    sut._cacheLocale({location: '234,-234'});
                });
            });
            afterEach(function(){
                _$httpBackend.verifyNoOutstandingExpectation();
                _$httpBackend.verifyNoOutstandingRequest();
            });
            it('should return listing based on locale location', function(){
                var url = 'http://util.api.epek.com/nearbyCity?location=234%2C-234&maxRows=10';
                _$httpBackend.expect('GET', /nearbyCity/);

                sut.getNearbyCities().then(
                    function (res) {
                        res.should.eql([
                            { name: 'Anniston' }
                            , {name: 'Rome' }
                            , {name: 'Jacksonville' }
                        ]);
                    },
                    function (data) {

                    }
                );

                _$httpBackend.flush();
            });
        });

        describe('given specific location', function () {
            var sut, _$httpBackend;
            beforeEach(function() {
                var cities = {
                    response: [
                        {name: 'Anniston'}
                        ,{name: 'Rome'}
                        ,{name: 'Jacksonville'}
                    ]
                }
                var cookies = {
                    put: function(){}
                }
                var config = {
                    UTIL_ROOT: 'http://util.api.epek.com/'
                };
                inject(function($rootScope, $injector, $q, $http){
                    var $httpBackend = $injector.get('$httpBackend');
                    _$httpBackend = $httpBackend;
                    var xhr = {
                        params:{
                            location: '234,-234',
                            maxRows: 10
                        }
                    };
                    $httpBackend.when('GET','http://util.api.epek.com/nearbyCity?location=234%2C-234&maxRows=10').respond(cities);

                    
                    sut = new LocaleService($rootScope, config, cookies, $http, $q);
          //          sut._cacheLocale({location: '234,-234'});
                });
            });
            afterEach(function(){
                _$httpBackend.verifyNoOutstandingExpectation();
                _$httpBackend.verifyNoOutstandingRequest();
            });
            it('should return listing based on locale location', function(){
                var url = 'http://util.api.epek.com/nearbyCity?location=234%2C-234&maxRows=10';
                _$httpBackend.expect('GET', /nearbyCity/);

                sut.getNearbyCities('234,-234').then(
                    function (res) {
                        res.should.eql([
                            { name: 'Anniston' }
                            , {name: 'Rome' }
                            , {name: 'Jacksonville' }
                        ]);

                    },
                    function (data) {

                    }
                );

                _$httpBackend.flush();
            });
        });

    });
        


});
});
