define(['chai', 'angular-mocks', 'app/filters/filters'], function (chai) {
describe('filters', function () {
    var expect = chai.expect;
    var should = chai.should();
    beforeEach(module('epek.filters'))
    describe('dateTime', function () {
        beforeEach(module(function($provide) {
            $provide.value('locale', {
                getLocale: function () { 
                    return {languageCode: 'fr' };
                }
            });
        }));
        it('should format based on languageCode', inject(function (dateTimeFilter) {
            expect(dateTimeFilter).to.exist;
            var dt = new Date(2012, 10, 25);
            expect(dateTimeFilter(dt)).to.equal('25/11/2012');
        }));

    });

    describe('currency', function () {
        beforeEach(module(function($provide) {
            $provide.value('locale', {
                getLocale: function () { 
                    return {
                        languageCode: 'fr'
                        ,currency: {
                            symbol: '\u20AC'
                            ,id: 'EURO'
                            ,thousandsSeparator: ' '
                            ,decimalSeparator: ','
                        }
                    };
                }
            });
        }));
        it('should format based on languageCode', inject(function (currencyFilter) {
            var amt = '3123456.8'
            expect(currencyFilter(amt)).to.equal('\u20AC3 123 456,80');
        }));

    });

    describe('without', function() {
       it('should remove items from an associative array', inject(function(withoutFilter) {
           expect(withoutFilter({foo:'foo', bar:'bar' }, ['foo'])).to.eql({bar:'bar'});
       }));
    });

    describe('minus', function() {
       it('should remove items from an array', inject(function(minusFilter) {
           expect(minusFilter(['a', 'b', 'c', 'd'], ['b', 'd'])).to.eql(['a', 'c']);
       }));
    });

})
});
