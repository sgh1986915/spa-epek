/** attach services to this module 
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our services and constants modules 
 * which avails each service of, for example, the `config` constants object.
 **/
define(['angular', '../config', 'angular-resource', 'angular-cookies'], function (ng, cfg) {
    'use strict';

    var services = ng.module('epek.services', ['ngResource', 'ngCookies', 'epek.constants']);
    return services;
});
