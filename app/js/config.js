/**
 * defines constants for `epek`
 */
define(['angular'], function (ng) {
var constants = ng.module('epek.constants', []);
constants.constant('config', {
    SERVICE_ROOT: 'http://signin.api.epek.com/'
    , UTIL_ROOT: 'http://util.api.epek.com/'
    , VIDEO_ROOT: 'http://video.api.epek.com'
    , IMAGE_ROOT: 'http://uploadimg.api.epek.com'
    , ITEM_ROOT: 'http://item.epek.com'
    , CATALOG_ROOT: 'http://catalog.epek.com'
    , WALLET_ROOT: 'http://wallet.api.epek.com'
    , SELL_ROOT: 'http://sell.api.epek.com'
    , SHARE_ROOT: 'http://social.api.epek.com'
    , COOKIE_DOMAIN: '.epek.com' //todo: undefined for localhost in sep environment cfg?
    , RECAPTCHA_API_KEY: '6LcMutYSAAAAACpS2f6ZMf82FZGgc_1vuEjnN5ZI'
});

return constants;
});
