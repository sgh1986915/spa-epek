/*
 * Monkey patching for RequireJS 'define' method in order to remove ^app/ substring in 
 * dependency path for controllers, filters, services and directives.
 */
(function(global) {
    var original_define = global.define;
    // reg exp for testing if dependency is app file
    var isAppFile = /^app\/(controllers|services|filters|directives)\//;

    // Override
    global.define = function(name, deps, callback) {
        var args = Array.prototype.slice.apply(arguments);

        // Process only anonymous definitions
        if(args.length != 2) {
            return original_define.apply(null, args);
        }

        // basically deps and callback are defined only for specs for testing
        var deps = args[0], callback = args[1];
        if(deps instanceof Array && typeof callback == "function") {
            for(var i = 0; i < deps.length; i++) {
                if(isAppFile.test(deps[i])) {
                    console.log('replacing: ' + deps[i]);
                    deps[i] = 'dist/js/main-compiled.0.0.1';
                    // deps[i] = deps[i].replace('app/', '');
                    // console.log('after replacement: ' + deps[i]);
                }
            }
        }

        original_define.apply(null, args);
    };

    // Enable AMD mode
    // Without this code line libs such as 'moment' or 'accounting' aren't being loaded
    // when we try to run tests for compiled .js file
    global.define.amd = original_define.amd;
})(this);

require.config({
    baseUrl: '/'
    // ,map: {'*': {'/libs': '/base/dist/app/libs'}}
    ,paths: {
        /* paths */
        'specs': '/base/tests/specs'
        ,'dist': '/base/dist'
        ,'libs': '/base/js/libs'

        /*named modules for app deps*/
        /* now everything is contained in the compiled file - do not import sources */
        // ,'angular-cookies': '/base/dist/js/libs/angular/1.1.1/angular-cookies'
        // ,'angular-resource': '/base/dist/js/libs/angular/1.1.1/angular-resource'

        /*named modules for test dependencies*/
        ,'chai': '/base/tests/lib/chaijs/chai'
        ,'angular': '/base/dist/js/libs/angular/1.1.1/angular'
        ,'angular-mocks': '/base/dist/js/libs/angular/1.1.1/angular-mocks'
        // ,'jquery': '/base/tests/lib/require-jquery'
    }
    ,shim: {
        'angular': { exports: 'angular' }
        ,'angular-mocks': {
            deps: ['angular'], 'exports': 'angular.mock'
        }
        // ,'angular-resource': {
        //     deps: ['angular']
        // }
        // ,'angular-cookies': {
        //     deps: ['angular']
        // }
    }
});

/* add your specs here */
require([
    'dist/js/main-compiled.0.0.1' 
    ,'specs/services/locale-service-spec'
    ,'specs/services/auth-service-spec'
    ,'specs/services/video-service-spec'
    ,'specs/services/image-service-specs'
    ,'specs/services/cookie-service-spec'
    ,'specs/services/nearby-cities-service-spec'
    ,'specs/services/pending-services-spec'
    ,'specs/services/catalog-service-spec'
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
    ,'specs/services/utils-service-spec'
    ,'specs/services/response-service-spec'
    ,'specs/controllers/sell/sell-ctrl-spec'
    ,'specs/controllers/sell/image-ctrl-spec'
    ,'specs/controllers/sell/description-ctrl-spec'
    ,'specs/controllers/geo-ctrl-spec'
    ,'specs/controllers/sell/listingType-ctrl-spec'
    ,'specs/services/captcha-service-spec'
    ,'specs/controllers/sell/specifications-ctrl-spec'
    ,'specs/services/google-maps-locale-service-spec'
    ,'specs/services/item-data-services-spec'
   ], function () {
        // dump('tests/main-compiled.js is starting requirejs');
        window.__karma__.start();
});
