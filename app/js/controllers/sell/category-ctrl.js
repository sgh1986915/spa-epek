define(['./../index', '../../services/locale-service', '../../services/catalog-service'], function (controllers) {
/**
 * Sell Step 4 : select category
 * call api::getCategories (siteName = countryCode.locale/languageCode.locale , userId = epek )
 *
 * FYI: use $rootScope.sellData.category.selectedCategory to access category object selected at this step
 */
controllers.controller('category', ['$scope', '$rootScope', '$routeParams', 'locale', 'catalog', function ($scope, $rootScope, $routeParams, locale, catalog) {
    'use strict';

    //set current step id
    $scope.STEP = $routeParams.step;//'category'

    //setup controller userData space
    if ($rootScope.sellData[$scope.STEP] === undefined) {
        //init empty object
        $rootScope.sellData[$scope.STEP] = {
            stepStatus: {
                status: null
                , message: null
            }
            , sitename: 'en-US'
            , categoriesData: {}    // cache fetched categories data
            , activeCategory: null  // name of category that is currently displayed to user
            , activeCategoryParent: null  // name of parent category to that is currently displayed to user
            , currentIndex: null     // current index - number of element in breadcrumbs array
            , nextIndex: null       // current index + 1 - number of next element in breadcrumbs array to be assigned
            , leafSelected: false
            , selectedCategory: null
                , categoryParentIndex: null    // sibling index of the parent
                , categoryIndex: null          // sibling index of the category
                , isCategoryLast: false        // true if category is last sibling
                , connectorTop: null           // top position of the category connector
                , connectorHeight: null        // height of the category connector
        };

        // obtain user locale to use as siteName in category service query
        // currently only en-US is implemented for catalog api @todo uncomment line below with sitename passed when others are ready
        //var localeObject = locale.getLocale();
        //$scope.data.sitename = [localeObject.languageCode, localeObject.countryCode].join('-');
    }

    // create a reference to object above
    $scope.data = $rootScope.sellData[$scope.STEP];
    $scope.itemCategory = $rootScope.sellData.item.categoryId;// array contained path from root category to the active category

    // for testing purposes to create chain calls
    $scope.afterCategoryLoadCallback = false;

    /**
     * called from ng-init directive
     */
    $scope.init = function () {
        if (!$scope.data.activeCategory) {
            // if this is the first visit - load root category
            $scope.loadCategory();
        }
    };

    /**
     * Loads category data by passed categoryName
     * and path to it retrieved from breadcrumbs
     * to position specified by index
     *
     * @param event {event}
     * @param index {integer} category index in breadcrumbs array
     * @param categoryName {string} name of category to be selected
         * @param siblingIndex {integer} category index in sibling categories array
         * @param isLastSibling {bool} true if last in sibling categories array
     */
        $scope.loadCategory = function (event, index, categoryName, siblingIndex, isLastSibling) {
        if (event) event.preventDefault();

        // defaults
        index = index || 0;
        categoryName = categoryName || 'Root';

        // invalidate category step before sending request to api
        $scope.data.leafSelected = false;
        validate();

        // trim breadcrumbs to passed index
        $scope.itemCategory.length = index;

        // define full category path to send with API request
        if ($scope.itemCategory.length) {
            var categoryPath = $scope.itemCategory.concat([categoryName]).join('/');
        } else {
            categoryPath = categoryName;
        }

        /**
         * handler for category data obtained success
         * @param response {object}
         */
        var loadCategorySuccess = function (response) {
            // obtained list of root category children
            //$scope.data.categories = response;
            var categoryName = response.category.categoryName;

            if (response.categoryInfo.leafCategory) {
                // current selected category is leaf
                $scope.data.leafSelected = true;

                // trim breadcrumbs to the length of index
                $scope.itemCategory.length = index;

                // set breadcrumbs
                $scope.itemCategory.push(categoryName);
                //$scope.data.activeCategory = $scope.itemCategory.join('/');
                var categoryPath = $scope.itemCategory.join('/');
                $scope.data.categoriesData[categoryPath] = response;

                // setup reference for selected leaf category
                $scope.data.selectedCategory = $scope.data.categoriesData[categoryPath];

                    $scope.data.categoryIndex = siblingIndex;
                    $scope.data.isCategoryLast = isLastSibling;
                    var connectorDimensions = $scope.computeConnectorDimensions();
                    $scope.data.connectorTop = connectorDimensions.top;
                    $scope.data.connectorHeight = connectorDimensions.height;
            } else {
                // current selected category is not leaf
                $scope.data.leafSelected = false;

                // update active state properties
                $scope.data.currentIndex = index;
                $scope.data.nextIndex = index + 1;

                // trim breadcrumbs to the length of index
                $scope.itemCategory.length = index;
                // define current/previous steps
                $scope.data.activeCategoryParent = $scope.itemCategory.join('/');

                // set breadcrumbs
                $scope.itemCategory.push(categoryName);
                $scope.data.activeCategory = $scope.itemCategory.join('/');
                $scope.data.categoriesData[$scope.data.activeCategory] = response;

                    $scope.data.categoryParentIndex = siblingIndex;
                    $scope.data.connectorTop = null;
                    $scope.data.connectorHeight = null;
            }

            // update state status
            $scope.data.stepStatus.status = 'success';
            $scope.data.stepStatus.message = '';

            validate();

            if (angular.isFunction($scope.afterCategoryLoadCallback)) {
                // call chained function - used for tests only
                $scope.afterCategoryLoadCallback();
            }
        };

        /**
         * handler for category data obtained error
         * @param response {object}
         */
        var loadCategoryError = function (response) {
            // some error happened, cannot go on
            $scope.data.stepStatus.status = 'error';
            $scope.data.stepStatus.message = 'Could not load data from catalog api.';

            validate();
        };

        // check if there is already category info cached
        if ($scope.data.categoriesData[categoryPath] === undefined) {
            // if no cached data - call api for category details
            catalog.getCategory($scope.data.sitename, categoryPath)
                .success(loadCategorySuccess)
                .error(loadCategoryError);
        } else {
            // we have data cached - provide it to success callback
            loadCategorySuccess($scope.data.categoriesData[categoryPath]);
        }
        };

        /**
         * Computes dimensions of the parent-child connector
         */
        $scope.computeConnectorDimensions = function() {
            if ($scope.data.leafSelected) {
                var top = ($scope.data.categoryIndex - $scope.data.categoryParentIndex) * 61;
                var height = Math.abs(top) + 60;
                if( top > 0 ){
                    if ($scope.data.isCategoryLast) height += 1;
                    return {top: 0, height: height};
                }
                else {
                    return {top: top-1, height: height+1};
                }
            }
            return null;
    };


    /**
     * @type {SellCtrl}
     */
    var SellCtrl = $scope.SellCtrl;

    $scope.activeStep = SellCtrl.getActiveStep();

    var validate = function(){
        var valid = $scope.data.leafSelected;
        $scope.activeStep.setValid(valid);

        return valid;
    };

    $scope.$watch('data.activeCategory', function(newVal, oldVal){
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