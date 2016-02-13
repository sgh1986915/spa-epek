define(['./index'], function (controllers) {
/**
 * controller handling /home geo view
 */
function GeoCtrl($scope, nearbyCities) {
    'use strict';

    var ctrl = {
        browseCities: function($event) {
            $event.preventDefault();
            $scope.browsingCities = true;
        }
        ,selectCity: function($event, location_) {
            $event.preventDefault();
            $scope.geo = nearbyCities.selectCity(location_);
        }
    };


    //expose ops to view
    $scope.selectCity = ctrl.selectCity;
    $scope.browseCities = ctrl.browseCities;
    

    //initialize view state
    $scope.browsingCities = false;

    $scope.geo = nearbyCities.initialize();
//    $scope.selectedCity = null;
//    $scope.$watch('selectedCity', function(cur,prev) {
//        console.log('cur', cur);
//        console.log('prev', prev);
//
//    });


    return ctrl;
};

controllers.controller('geo', ['$scope', 'nearbyCities', GeoCtrl]);

return GeoCtrl;
});

