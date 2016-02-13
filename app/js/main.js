/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt 
 * or 3rd party libraries
 */
require.config({
    paths: {
        /* paths */
        'libs': './libs'

        /*named modules for src*/
        ,'angular': './libs/angular/1.1.1/angular'
        ,'angular-cookies': './libs/angular/1.1.1/angular-cookies'
        ,'angular-resource': './libs/angular/1.1.1/angular-resource'
        ,'accounting': './libs/accounting/0.3.2/accounting'
        ,'moment': './libs/moment/1.7.2/moment'
        ,'moment-lang': './libs/moment/1.7.2/lang-all.min'
        ,'ckeditor': './libs/ckeditor/4.2.1/ckeditor'
        ,'recaptcha': 'http://www.google.com/recaptcha/api/js/recaptcha_ajax'
        ,'gmaps': './services/google-maps'
        ,'async': './libs/requirejs/2.1.1/async'
        ,'domReady': './libs/requirejs/2.1.1/domReady'
    }
    /* for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    ,shim: {
        'angular': { exports: 'angular' }
        ,'angular-mocks': {
            deps: ['angular']
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

require(['./bootstrap'], function () {    
    //TADA
    //nothing to do here...see bootstrap.js
});
