/**
 * loads sub modules and wraps them up into the main `epek` module
 * this should be used for top-level module definitions only
 * (in other words... you probably don't need to do stuff here)
 */
define(['angular'
    ,'./config'
    ,'./controllers/index'
    ,'./directives/index'
    ,'./filters/index'
    ,'./services/index'
    ], function (ng) {

'use strict';

//add ability to use dump() for logging (Testacular uses dump() to print to stdout)
if (dump === undefined) {
    var dump = function () {
        console.log(Array.prototype.slice.call(arguments));
    };
}


return ng.module('epek', [
    ,'epek.constants'
    ,'epek.services'
    ,'epek.controllers'
    ,'epek.filters'
    ,'epek.directives'
    ]);
});

