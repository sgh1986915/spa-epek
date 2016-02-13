define(['./index','moment', 'moment-lang', 'accounting'], function (filters, moment, momentLang, accounting) {

/**
 * *dateTime* filter
 @param {Date} the Date to format
 @returns {String} formatted by current `languageCode`
 */
filters.filter('dateTime', ['locale', function (locale) {
    return function (date) {
        var current = locale.getLocale();
        //todo : confirm language code supported
        var mmt = moment(date);
        moment.lang(current.languageCode);
        return mmt.format('L');
    }

}]);

/**
 * *currency* filter
 * formats currency properly based on the user's locale
 */
filters.filter('currency', ['locale', function (locale) {
    return function (amt) {
        var current = locale.getLocale();
        var currencyInfo = current.currency;
        var formatOpts = {
            symbol: currencyInfo.symbol
            , thousand: currencyInfo.thousandsSeparator
            , precision: 2
            , decimal: currencyInfo.decimalSeparator
        };
        return accounting.formatMoney(Number(amt), formatOpts);
    }
}]);

/**
 * remove object keys
 * 
 */
filters.filter('without', function() {
    return function(map, keys) {
        var filtered = {};
        for (key in map) {
            if (keys.indexOf(key) < 0) {
                filtered[key] = map[key];
            }
        }
        return filtered;
    }
});

/**
 * minus keys from items array
 * 
 */
filters.filter('minus', function() {
    return function(items, keys) {
        if (items && keys) return items.filter(function(i) {return !(keys.indexOf(i) > -1);});
        else return items;
    };
});

});
