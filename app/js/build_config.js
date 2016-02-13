/*
 * Config for compiling .js app resources
 */

require.config({
    // baseUrl: './',
    paths: {
        /*named modules for src*/
        'angular': '../../dist/js/libs/angular/1.1.1/angular'
        // 'angular': 'libs/angular/1.1.1/angular'
        ,'angular-cookies': 'libs/angular/1.1.1/angular-cookies'
        ,'angular-resource': 'libs/angular/1.1.1/angular-resource'
        // ,'libs': '/base/dist/js/libs'
        ,'accounting': 'libs/accounting/0.3.2/accounting'
        ,'moment': 'libs/moment/1.7.2/moment'
        ,'moment-lang': 'libs/moment/1.7.2/lang-all.min'
        ,'ckeditor': 'libs/ckeditor/4.2.1/ckeditor'
        ,'recaptcha': 'http://www.google.com/recaptcha/api/js/recaptcha_ajax'
        ,'gmaps': 'services/google-maps'
        ,'async': 'libs/requirejs/2.1.1/async'
        ,'domReady': 'libs/requirejs/2.1.1/domReady'
    },
 
    shim: {
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
    },

    // r.js contains its own version of uglifyjs that breakes the minified version
    // optimize: "none",

    // out: 'main-compiled.js',
    // name: 'main.js',
})
