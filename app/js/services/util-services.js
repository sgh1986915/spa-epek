/**
 * This module contains utility services that are useful throughout the application
 */
define(['./index'], function (services) {
services.factory('utils', function(){
    var startHash = 0;
    return {
        /**
         * @returns a string that is unique for this run of the application. Can be convenient for id's and such things.
         */
      uniqueHash: function(){
          return (startHash++).toString(16)
      }
    };
});
});
