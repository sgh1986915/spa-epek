define(['./../index'], function (controllers, cfg) {
/**
 * Sell Step 3 : add description
 */
controllers.controller('description', ['$scope', 'auth', '$routeParams', '$location', '$rootScope', function ($scope, auth, $routeParams, $location, $rootScope) {
    var item = $scope.item = $rootScope.sellData.item;
    $scope.locationInfo = $rootScope.sellData.locationInfo;
    $scope.conditions = ["New", "Used", "Refurbrished", "Damaged"];
    // initialize "Used" as default value
    if ($scope.item.condition === undefined) {
      $scope.item.condition = $scope.conditions[1];
    }

    /**
     * @type {SellCtrl}
     */
    var SellCtrl = $scope.SellCtrl;

    $scope.activeStep = SellCtrl.getActiveStep();

    var validate = function(){
        var valid = angular.isDefined(item.title) && item.title.length > 0 &&
                    angular.isDefined(item.condition) && item.condition.length > 0 &&
                    angular.isDefined(item.location) && item.location.length > 0 &&
                    angular.isDefined(item.description) && item.description.length > 0;
        $scope.activeStep.setValid(valid);
        return valid;
    };

    $scope.$watch('item.title + item.condition + item.location + item.description', function(newVal, oldVal){
        // first call when watch.last was not initialized yet
        if (newVal === oldVal) {
            return;
        }

        $scope.activeStep.setPristine(false);

        validate();
    });

    $scope.onNextStep = function () {
        if (validate()) {
            SellCtrl.redirectToStep(SellCtrl.getNextStep($scope.activeStep));
        }
    };

}]);
});
