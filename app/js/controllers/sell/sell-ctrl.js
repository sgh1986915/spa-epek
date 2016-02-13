define(['./../index', '../../services/auth-service', '../../services/video-upload-service','../../services/sell-api-service', '../../services/persistence-helper-service'], function (controllers) {
    "use strict";

/**
 * controller fired on /sell route
 */
controllers.controller('sell', ['$scope', 'auth', '$routeParams', '$location', '$rootScope', 'PersistenceHelper', function ($scope, auth, $routeParams, $location, $rootScope, PersistenceHelper) {

    PersistenceHelper.persist($rootScope, 'sellData', 'sell', 1);
    //object to store steps data. Reuse existing object, or create a default one
    $rootScope.sellData = $rootScope.sellData || {

        stepsStates: {},

        // model for the item to be listed this model will be filled in the different steps and eventually passed to
        // listItem or listFixedPriceItem
        // values here are the defaults
        item: {
            categoryId: [],
            media: {video: [], image: []},
            variations: [{media: {video: [], image: []}}],
            attributes: {standard: [], custom: []}
        },
        locationInfo: ''
    };

    /**
     * @class SellCtrl
     */
    var ctrl = this;
    $scope.SellCtrl = ctrl;

    ctrl.STEPS = {
        VIDEO: 'video',
        IMAGE: 'image',
        DESCRIPTION: 'description',
        CATEGORY: 'category',
        LISTING_TYPE: 'listingType',
        SPECIFICATIONS: 'specifications',
        PAYMENT: 'payment'
    };

    /**
     *
     * Note: $rootScope.sellData.validity is used to have ability to persist validity state
     *
     * @param {Object} data
     * @param {String} data.code
     * @param {String} data.name
     * @param {Boolean} data.required
     * @constructor
     *
     * @property {String} code
     * @property {String} name
     * @property {Boolean} required
     */
    var Step = ctrl.Step = function(data){
        angular.extend(this, data);

        if(angular.isUndefined($rootScope.sellData.stepsStates[this.code])) {
            $rootScope.sellData.stepsStates[this.code] = {};

            if (this.required) {
                this.setValid(false);
            } else {
                this.setValid(true);
            }

            this.setPristine(true);
        }
    };
    /**
     * Changes validity
     *
     * @param {Boolean} valid
     */
    Step.prototype.setValid = function(valid){
        $rootScope.sellData.stepsStates[this.code].valid = valid;
    };
    /**
     * Checks if step is valid
     *
     * @returns {Boolean}
     */
    Step.prototype.isValid = function(){
        return $rootScope.sellData.stepsStates[this.code].valid;
    };
    /**
     * Changes pristine
     *
     * @param {Boolean} pristine
     */
    Step.prototype.setPristine = function(pristine){
        $rootScope.sellData.stepsStates[this.code].pristine = pristine;
    };
    /**
     * Checks if step is pristine
     *
     * @returns {Boolean}
     */
    Step.prototype.isPristine = function(){
        return $rootScope.sellData.stepsStates[this.code].pristine;
    };

    $scope.steps = [
        new Step({
            code: ctrl.STEPS.VIDEO,
            name: 'Upload Video',
            required: false
        }),
        new Step({
            code: ctrl.STEPS.IMAGE,
            name: 'Upload Pictures',
            required: true
        }),
        new Step({
            code: ctrl.STEPS.DESCRIPTION,
            name: 'Description',
            required: true
        }),
        new Step({
            code: ctrl.STEPS.CATEGORY,
            name: 'Category',
            required: true
        }),
        new Step({
            code: ctrl.STEPS.LISTING_TYPE,
            name: 'Listing Type',
            required: true
        }),
        new Step({
            code: ctrl.STEPS.SPECIFICATIONS,
            name: 'Specifications',
            required: false
        }),
        new Step({
            code: ctrl.STEPS.PAYMENT,
            name: 'Payment Method',
            required: true
        })
    ];

    /**
     * Gets step by code
     *
     * @param {String} code
     * @returns {Step}
     */
    ctrl.getStep = function(code){
        var steps = $scope.steps.filter(function(step){ return step.code === code; });
        if (steps.length === 1) {
            return steps[0];
        } else {
            return null;
        }
    };

    /**
     * Gets active step based on current route
     *
     * @returns {Step}
     */
    ctrl.getActiveStep = function(){
        return ctrl.getStep($routeParams.step);
    };

    /**
     * Gets next step after specified
     *
     * @param {Step} step
     * @returns {Step}
     */
    ctrl.getNextStep = function(step){
        var index = $scope.steps.indexOf(step);
        var maxIndex = $scope.steps.length - 1;
        if (index < maxIndex) {
            return $scope.steps[index + 1];
        } else {
            return $scope.steps[maxIndex];
        }
    };

    /**
     * Gets last valid step
     *
     * @returns {Step}
     */
    ctrl.getLastValidStep = function(){
        for (var i=0; i < $scope.steps.length; ++i) {
            if(!$scope.steps[i].isValid()) {
                return $scope.steps[i-1];
            }
        }
        return $scope.steps[$scope.steps.length - 1];
    };

    /**
     * Gets the first not pristine invalid step
     *   Ex:  - optional pristine
     *        - required valid
     *        - optional pristine
     *        - required not pristine invalid <-
     * otherwise the last pristine step before the first pristine invalid
     *   Ex:  - optional pristine
     *        - required valid
     *        - optional pristine <-
     *        - required pristine invalid
     * otherwise the first invalid
     *   Ex:  - optional pristine
     *        - required valid
     *        - required pristine invalid <-
     *
     * @returns {Step}
     */
    ctrl.getLastEnterableStep = function(){
        for (var i=0; i < $scope.steps.length; ++i) {
            if(!$scope.steps[i].isValid()) {
                break;
            }
        }

        if(i === $scope.steps.length) {
            return $scope.steps[i-1];
        }

        var firstInvalidStep = $scope.steps[i];

        if(!firstInvalidStep.isPristine()) {
            return firstInvalidStep;
        }

        if($scope.steps[i-1].isPristine()) {
            return $scope.steps[i-1];
        }

        return firstInvalidStep;
    };

    /**
     * Redirects to step's page
     *
     * @param {Step} step
     */
    ctrl.redirectToStep = function(step){
        $location.path('/sell/' + step.code);
    };

    /**
     * Checks if passed step can be entered
     *
     * @param {Step} step
     * @returns {Boolean}
     */
    ctrl.canEnterStep = function(step){
        var previousSteps = $scope.steps.slice(0, $scope.steps.indexOf(step));
        return previousSteps.every(function(step){ return step.isValid(); });
    };

    // check route param to be valid sell step
    var step = ctrl.getActiveStep();
    if (ctrl.canEnterStep(step)) {
        $scope.activeStep = step.code;
    } else {
        ctrl.redirectToStep(ctrl.getLastValidStep());
    }

    $scope.isActiveStep = function(stepCode){
        return $scope.activeStep === stepCode;
    };

    $scope.onStep = function(step){
        if (ctrl.canEnterStep(step)) {
            ctrl.redirectToStep(step);
        } else {
            ctrl.redirectToStep(ctrl.getLastEnterableStep());
        }
    };

}]);
});
