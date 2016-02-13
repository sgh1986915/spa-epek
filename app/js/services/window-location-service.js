define(['./index'], function (services) {

services.factory('windowLocation', ['$window', function($window){
    return {
        href: function(url) {
            $window.location.href = url;
        },
        replace: function(url) {
            $window.location.replace(url);
        }
    }
}]);
});
