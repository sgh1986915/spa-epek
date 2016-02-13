define(['./../index'], function (controllers) {

    /**
     * Sell Step 6 : specification
     */
    controllers.controller('specifications', ['$scope', '$rootScope', function ($scope, $rootScope) {
        'use strict';

        /**
         * @type {SellCtrl}
         */
        var SellCtrl = $scope.SellCtrl;

        $scope.activeStep = SellCtrl.getActiveStep();

        //setup controller userData space
        if ($rootScope.sellData[$scope.activeStep.code] === undefined) {
            //init empty objects
            $rootScope.sellData[$scope.activeStep.code] = {
                stepStatus: {
                    status: null
                    , message: null
                },
                focus: {},
                standardAttributes: {},
                customAttributes: {}
            };
        }

        // reference step data in global scope
        $scope.data = $rootScope.sellData[$scope.activeStep.code];

        $scope.newAttribute = {'name': '', 'value': ''};

        /**
         * obtain data from category step
         * or show error message otherwise
         */
        $scope.loadData = function () {
            if ((!$rootScope.sellData.category || !$rootScope.sellData.category.selectedCategory)) {
                $scope.data.stepStatus.status = 'failure';
                $scope.data.stepStatus.message = 'To fill in specifications You have to choose category at step 4 first.';
                //$location.path('/sell/category');//@todo guess something better
            } else {
                $scope.data.stepStatus = 'success';
                $scope.data.stepStatus.message = '';

                // obtain selected category meta
                $scope.data.attributes = $rootScope.sellData.category.selectedCategory.categoryInfo.meta.attributes;
            }
        };

        /**
         * @param field - name of field to assign value
         * @param value
         */
        $scope.setStandardAttributeValue = function (field, value)
        {
            $scope.data.standardAttributes[field] = value;
        };

        // keep sellData.item.attributes.standard aligned
        $scope.$watch('data.standardAttributes', function (attributes) {
            var newAttributes = [];
            for (var i in attributes) {
                if (!attributes.hasOwnProperty(i)) continue;
                newAttributes.push({name: i, value: attributes[i]});
            }
            $rootScope.sellData.item.attributes.standard = newAttributes;
        }, true);

        /**
         * @param field - name of field to assign value
         * @param value
         */
        $scope.setCustomAttributeValue = function ()
        {
            if (!$scope.newAttribute.name) return;
            $scope.data.customAttributes[$scope.newAttribute.name] = $scope.newAttribute.value;
            $scope.newAttribute.name = '';
            $scope.newAttribute.value = '';
        };

        /**
         * @param field - name of field to delete
         */
        $scope.deleteCustomAttribute = function (field)
        {
            delete $scope.data.customAttributes[field];
        };

        // keep sellData.item.attributes.custom aligned
        $scope.$watch('data.customAttributes', function (attributes, oldAttributes) {
            // first call when watch.last was not initialized yet
            if (angular.equals(attributes, oldAttributes)) return;

            $scope.activeStep.setPristine(false);

            var newAttributes = [];
            for (var i in attributes) {
                if (!attributes.hasOwnProperty(i)) continue;
                newAttributes.push({name: i, value: attributes[i]});
            }
            $rootScope.sellData.item.attributes.custom = newAttributes;

            validate();
        }, true);

        var validate = function(){
            var valid = $rootScope.sellData.item.attributes.custom.every(function(a){ return a.value && a.value.length; });
            $scope.activeStep.setValid(valid);
            return valid;
        };

        $scope.onNextStep = function () {
            if (validate()) {
                SellCtrl.redirectToStep(SellCtrl.getNextStep($scope.activeStep));
            }
        };
    }]);
});
