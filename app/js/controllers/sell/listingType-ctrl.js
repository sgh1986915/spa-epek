define(['./../index'], function (controllers) {
/**
 * controller fired on /sell/listingType route
 * Sell Step 5 : listingType
 */
controllers.controller('listingType', ['$scope', '$routeParams', '$rootScope', function ($scope, $routeParams, $rootScope) {

    /**
     * @type {SellCtrl}
     */
    var SellCtrl = $scope.SellCtrl;

    $scope.activeStep = SellCtrl.getActiveStep();

    //setup controller userData space
    if (angular.isUndefined($rootScope.sellData[$scope.activeStep.code])) {
        //init empty objects
        $rootScope.sellData[$scope.activeStep.code] = {
            type: 'auction',
            focus: {},
            standardAttributes: {}
        };
    }
    // reference step data in global scope
    $scope.data = $rootScope.sellData[$scope.activeStep.code];

    /**
     * obtain data from category step
     */
    $scope.loadData = function () {
        // obtain selected category meta
        $scope.data.attributes = [];
        $scope.data.options = {};
        angular.forEach($rootScope.sellData.category.selectedCategory.categoryInfo.meta.attributes,
            function(attribute) {
                $scope.data.attributes.push(attribute[0].name);
                $scope.data.options[attribute[0].name] = attribute[1].value;
            }
        );
    };

    $scope.focused = {}; // map focused elements (used by is-focused directive)

    $scope.newAttribute = {'name': '', 'value': ''};

    $scope.attributeKeys = [];

    $scope.item = $rootScope.sellData.item;

    $scope.showAddVisuals = false;

    var createNewVariation = function(){
        return {media: {video: [], image: []}};
    };

    $scope.toggleShowAddVisuals = function() {
        $scope.showAddVisuals = !$scope.showAddVisuals;
    };

    $scope.singleVariation = function() {
        // only singleVariation can change attributes but can not be removed
        return $scope.item.variations.length === 1;
    };

    $scope.noVideo = function(){
        // if we didn't enter step - array may not exist
        return angular.isUndefined($rootScope.sellData.videos) ||
               angular.isDefined($rootScope.sellData.videos) && $rootScope.sellData.videos.length === 0;
    };

    $scope.noImages = function(){
        // if we didn't enter step - array may not exist
        return angular.isUndefined($rootScope.sellData.images) ||
               angular.isDefined($rootScope.sellData.images) && $rootScope.sellData.images.length === 0;
    };

    $scope.emptyMedia = function(){
        return $scope.noVideo() && $scope.noImages();
    };

    $scope.removeVariation = function(index) {
        $scope.item.variations.splice(index, 1);
    };

    $scope.removeAllVariations = function() {
        $scope.item.variations = [createNewVariation()];
        $scope.attributeKeys = [];
    };

    $scope.addVariationAttribute = function(newAttribute) {
        if ($scope.attributeKeys.indexOf(newAttribute.name) > -1 ) {
            return;
        }

        $scope.attributeKeys.push(newAttribute.name);

        angular.forEach($scope.item.variations, function(variation){
            variation[newAttribute.name] = '';
        });
        $scope.item.variations[0][newAttribute.name] = newAttribute.value;

        newAttribute.name = '';
        newAttribute.value = '';
    };

    $scope.deleteVariationAttribute = function(key) {
        angular.forEach($scope.item.variations, function(variation){
            delete variation[key];
        });
        var index = $scope.attributeKeys.indexOf(key);
        $scope.attributeKeys.splice(index,1);     
    };

    $scope.isImageSelected = function(variationIndex, imageUrl) {
        return $scope.item.variations[variationIndex].media.image.indexOf(imageUrl) > -1;
    };

    $scope.toggleImage = function(variationIndex, imageUrl) {
        var index = $scope.item.variations[variationIndex].media.image.indexOf(imageUrl);
        if (index === -1) {
            $scope.item.variations[variationIndex].media.image.push(imageUrl);
        }
        else {
            $scope.item.variations[variationIndex].media.image.splice(index, 1);
        }
    };

    $scope.isVideoSelected = function(variationIndex, videoId) {
        return $scope.item.variations[variationIndex].media.video.indexOf(videoId) > -1;
    };

    $scope.toggleVideo = function(variationIndex, videoId) {
        var index = $scope.item.variations[variationIndex].media.video.indexOf(videoId);
        if (index === -1) {
            $scope.item.variations[variationIndex].media.video.push(videoId);
        }
        else {
            $scope.item.variations[variationIndex].media.video.splice(index, 1);
        }
    };

    $scope.addVariation = function() {
        var newVariation = createNewVariation();
        angular.forEach($scope.attributeKeys, function(key){
            newVariation[key] = '';
        });
        $scope.item.variations.push(newVariation);
    };

    var validate = function(){
        var valid = false;
        if ($scope.data.type === 'auction') {
            valid = angular.isDefined($scope.item.price) && $scope.item.price.startPrice > 0 &&
                    $scope.item.duration > 0;
        } else if ($scope.data.type === 'fixed') {
            valid = $scope.item.variations.every(function(variation){
                var isAllAttributesFilled = $scope.attributeKeys.every(function(key){
                    return variation[key] && variation[key].length > 0;
                });
                return variation.fixedPrice > 0 && variation.quantity > 0 && isAllAttributesFilled;
            });
        }

        $scope.activeStep.setValid(valid);
        return valid;
    };

    $scope.$watch('item.variations', function(newVal, oldVal){
        // first call when watch.last was not initialized yet
        if (newVal === oldVal) {
            return;
        }

        $scope.activeStep.setPristine(false);

        validate();
    }, true);

    $scope.$watch('data.type + item.price.startPrice + item.duration', function(newVal, oldVal){
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
