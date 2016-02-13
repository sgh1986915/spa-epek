require.config({
    baseUrl: '/'
    ,paths: {
        /* paths */
        'specs': '/base/tests/specs'
        // ,'libs': './app/js/libs'
        ,'app': '/base/app/js'

        /*named modules for app deps*/
        ,'angular': '/base/app/js/libs/angular/1.1.1/angular'
        ,'angular-cookies': '/base/app/js/libs/angular/1.1.1/angular-cookies'
        ,'angular-resource': '/base/app/js/libs/angular/1.1.1/angular-resource'
        ,'accounting': '/base/app/js/libs/accounting/0.3.2/accounting'
        ,'moment': '/base/app/js/libs/moment/1.7.2/moment'
        ,'moment-lang': '/base/app/js/libs/moment/1.7.2/lang-all.min'
        ,'recaptcha': 'http://www.google.com/recaptcha/api/js/recaptcha_ajax'
        ,'gmaps': '/base/app/js/services/google-maps'
        ,'async': '/base/app/js/libs/requirejs/2.1.1/async'
        ,'domReady': '/base/app/js/libs/requirejs/2.1.1/domReady'
        ,'ckeditor': '/base/app/js/libs/ckeditor/4.2.1/ckeditor'

        /*named modules for test dependencies*/
        ,'chai': '/base/tests/lib/chaijs/chai'
        ,'angular-mocks': '/base/app/js/libs/angular/1.1.1/angular-mocks'
        ,'jquery': '/base/tests/lib/require-jquery'
    }
    ,shim: {
        'angular': { exports: 'angular' }
        ,'angular-mocks': {
            deps: ['angular'], 'exports': 'angular.mock'
        }
        ,'angular-resource': {
            deps: ['angular']
        }
        ,'angular-cookies': {
            deps: ['angular']
        }
        ,'moment-lang': {
            deps: ['moment']
        }
    }
});

/* add your specs here */
require([
    'specs/services/locale-service-spec'
    ,'specs/services/auth-service-spec'
    ,'specs/services/video-service-spec'
    ,'specs/services/image-service-specs'
    ,'specs/services/cookie-service-spec'
    ,'specs/services/nearby-cities-service-spec'
    ,'specs/services/pending-services-spec'
    ,'specs/services/catalog-service-spec'
    ,'specs/services/wallet-service-spec'
    ,'specs/filters/filters-spec'
    ,'specs/directives/editableCollectionDirective-specs'
    ,'specs/directives/maps-input-directive-spec'
    ,'specs/controllers/sso/auth-ctrl-spec'
    ,'specs/controllers/sso/confirmEmail-ctrl-specs'
    ,'specs/controllers/sso/resetPassword-ctrl-spec'
    ,'specs/controllers/sso/changePassword-ctrl-spec'
    ,'specs/controllers/sso/forgotPassword-ctrl-spec'
    ,'specs/controllers/sell/video-ctrl-spec'
    ,'specs/controllers/sell/category-ctrl-spec'
    ,'specs/controllers/item/view-ctrl-spec'
    ,'specs/services/utils-service-spec'
    ,'specs/services/response-service-spec'
    ,'specs/controllers/sell/sell-ctrl-spec'
    ,'specs/controllers/sell/image-ctrl-spec'
    ,'specs/controllers/sell/description-ctrl-spec'
    ,'specs/controllers/geo-ctrl-spec'
    ,'specs/controllers/sell/listingType-ctrl-spec'
    ,'specs/services/captcha-service-spec'
    ,'specs/controllers/sell/payment-ctrl-spec'
    ,'specs/controllers/sell/specifications-ctrl-spec'
    ,'specs/services/google-maps-locale-service-spec'
    ,'specs/services/item-data-services-spec'
    ,'specs/services/share-item-service-spec'
    ,'specs/services/local-storage-service-spec'
    ,'specs/services/persistence-helper-service-spec'
    ], function () {
    // dump('tests/main.js is starting requirejs');
    window.__karma__.start();
});
