/** pending services
 * exposes `serviceReady` on the $rootScope for services which
 * require async initialization and which may cause failure
 * if the DOM is rendered before they have done their work
 * */
define(function () {
    var DEFAULT = ['locale'];
    return {
        init: function ($rootScope, locale) {
            var pendingServices;
            //setup notification skeleton
            $rootScope.pendingServices = pendingServices = ($rootScope.pendingServices || DEFAULT);
            //invoke this inside your service to have its
            //key spliced from the known services
            $rootScope.serviceReady = function(serviceName) {
                for(var i=0; i<pendingServices.length; i++) {
                    if(pendingServices[i] == serviceName) {
                        pendingServices.splice(i, 1);
                        break;
                    }
                }
            };

            //service invocations
            locale.init();

        }
    };
});
