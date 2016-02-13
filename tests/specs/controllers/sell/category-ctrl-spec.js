define(['angular-mocks', 'app/controllers/sell/category-ctrl'], function () {

    // mockup data
    var RootCategoryAPISuccessInfo = {
        "category": {"categoryName": "Root", "categoryId": "id1"},
        "categoryInfo": {
            "meta": null,
            "leafCategory": false,
            "children": [
                {"leafCategory": true, "categoryName": "Byzantine", "categoryId": "id2"},
                {"leafCategory": true, "categoryName": "Celtic", "categoryId": "id3"}
            ]
        }
    };

    var SecondCategoryAPISuccessInfo = {
        "category": {"categoryName": "Second", "categoryId": "id2"},
            "categoryInfo": {
                "meta": null,
                "leafCategory": false,
                "children": [
                    {"leafCategory": true, "categoryName": "Byzantine", "categoryId": "id2"},
                    {"leafCategory": true, "categoryName": "Celtic", "categoryId": "id3"}
                ]
            }
        };

    var ThirdCategoryAPISuccessInfo = {
        "category": {
            "categoryName": "Byzantine",
            "categoryId": "2b42f735-bdcc-4090-93c9-a42291ae2ca8"
        },
        "categoryInfo": {
            "meta": {
                "paymentInfo": [
                    {"paymentService": "paypal", "paymentName": "PayPal"},
                    {"paymentService": "googleCheckout", "paymentName": "Google Checkout"},
                    {"paymentService": "payOnPickup", "paymentName": "Pay on Pick-up"}
                ]
            },
            "leafCategory": true,
            "children": []
        }
    };

    var categoryObject = {"leafCategory": true, "categoryName": "Byzantine", "categoryId": "id2"};


    describe('category controller initial state', function () {

        var subject, scope, activeStep,
            $rootScope, $controller;

        beforeEach(function () {
            module('epek.controllers');

            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');

                //mockup $rootScope
                $rootScope.sellData = {
                    item: {
                        categoryId: []
                    }
                };

                scope = $rootScope.$new();

                scope.SellCtrl = jasmine.createSpyObj('SellCtrl', ['getActiveStep', 'redirectToStep', 'getNextStep']);
                activeStep = jasmine.createSpyObj('activeStep', ['setValid', 'setPristine']);
                scope.SellCtrl.getActiveStep.andReturn(activeStep);

                subject = $controller('category', {$scope: scope, $routeParams: {step: 'category'}, $rootScope: $rootScope});
            });
        });

        describe('check if controller is on it\'s place', function () {
            it('should have loaded the subject', function () {
                expect(subject).toBeDefined();
            });
        });

        describe('check if scope is also on it\'s place', function () {
            it('should test scope to be defined', function () {
                expect(scope).toBeDefined();
            });
        });

        describe('check initial controller state', function () {
            it('should setup initial userData space', function () {
                expect(scope.sellData.category).toEqual({
                    stepStatus: {
                        status: null
                        , message: null
                    }
                    , sitename: 'en-US'
                    , categoriesData: {}
                    , activeCategory: null  // name of category that is currently displayed to user
                    , activeCategoryParent: null  // name of category that is currently displayed to user
                    , currentIndex: null       // current index
                    , nextIndex: null       // current index + 1
                    , leafSelected: false
                    , selectedCategory: null
                    , categoryParentIndex: null    // sibling index of the parent
                    , categoryIndex: null          // sibling index of the category
                    , isCategoryLast: false        // true if category is last sibling
                    , connectorTop: null           // top position of the category connector
                    , connectorHeight: null        // height of the category connector
                });
            });

        });

    });

    describe('category controller work', function () {

        var subject, scope, activeStep,
            $rootScope, $controller;

        beforeEach(function () {
            module('epek.controllers');

            module(function($provide) {
                // replace catalog service
                $provide.value('catalog', {
                    getCategory: function (sitename, category) {
                        var self;
                        if (category === 'Root') {
                            self = {
                                success: function (callback) {
                                    callback(RootCategoryAPISuccessInfo);
                                    return self;
                                },
                                error: function (callback) {
                                    //callback();
                                    return self;
                                }
                            };
                        } else if (category === 'Root/Second') {
                            self = {
                                success: function (callback) {
                                    callback(SecondCategoryAPISuccessInfo);
                                    return self;
                                },
                                error: function (callback) {
                                    //callback();
                                    return self;
                                }
                            };
                        } else if (category === 'Root/Second/Byzantine') {
                            self = {
                                success: function (callback) {
                                    callback(ThirdCategoryAPISuccessInfo);
                                    return self;
                                },
                                error: function (callback) {
                                    //callback();
                                    return self;
                                }
                            };
                        }
                        return self;
                    }
                });
            });

            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');

                //mockup $rootScope
                $rootScope.sellData = {
                    item: {
                        categoryId: []
                    }
                };

                scope = $rootScope.$new();

                scope.SellCtrl = jasmine.createSpyObj('SellCtrl', ['getActiveStep', 'redirectToStep', 'getNextStep']);
                activeStep = jasmine.createSpyObj('activeStep', ['setValid', 'setPristine']);
                scope.SellCtrl.getActiveStep.andReturn(activeStep);

                subject = $controller('category', {$scope: scope, $routeParams: {step: 'category'}, $rootScope: $rootScope});
                scope.$apply();
            });
        });

        describe('test loadCategory success with no parameters', function () {
            beforeEach(function () {
                scope.loadCategory();
            });

            it('should setup Root category data', function () {
                expect(scope.sellData.category.categoriesData.Root).toBeDefined();
            });

            it('should load response to Root category', function () {
                expect(scope.sellData.category.categoriesData.Root).toEqual(RootCategoryAPISuccessInfo);
            });

            it('should set leafSelected property to false', function () {
                expect(scope.sellData.category.leafSelected).toBeFalsy();
            });

            it('should set active category name to Root', function () {
                expect(scope.sellData.category.activeCategory).toEqual('Root');
            });

            it('should set current index to 0', function () {
                expect(scope.sellData.category.currentIndex).toEqual(0);
            });

            it('should set next index to 1', function () {
                expect(scope.sellData.category.nextIndex).toEqual(1);
            });

            it('should setup breadcrumbs', function () {
                expect(scope.sellData.item.categoryId).toEqual(['Root']);
            });

            it('should set activeCategoryParent flag to false', function () {
                expect(scope.sellData.category.activeCategoryParent).toBeFalsy();
            });

            it('should set status to success', function () {
                expect(scope.sellData.category.stepStatus.status).toEqual('success');
                expect(scope.sellData.category.stepStatus.message).toEqual('');
            });

        });


        describe('test loadCategory success for Second category selection', function () {
            beforeEach(function () {
                scope.afterCategoryLoadCallback = function () {
                    scope.afterCategoryLoadCallback = false;
                    scope.loadCategory(false, 1, 'Second', 1, true);
                };
                scope.loadCategory();
            });

            it('should setup Second category data', function () {
                expect(scope.sellData.category.categoriesData['Root/Second']).toBeDefined();
            });

            it('should load response to Root category', function () {
                expect(scope.sellData.category.categoriesData.Root).toEqual(RootCategoryAPISuccessInfo);
                expect(scope.sellData.category.categoriesData['Root/Second']).toEqual(SecondCategoryAPISuccessInfo);
            });

            it('should set leafSelected property to false', function () {
                expect(scope.sellData.category.leafSelected).toBeFalsy();
            });

            it('should set active category name to Second', function () {
                expect(scope.sellData.category.activeCategory).toEqual('Root/Second');
            });

            it('should set current index to 1', function () {
                expect(scope.sellData.category.currentIndex).toEqual(1);
            });

            it('should set next index to 2', function () {
                expect(scope.sellData.category.nextIndex).toEqual(2);
            });

            it('should setup breadcrumbs', function () {
                expect(scope.sellData.item.categoryId).toEqual(['Root', 'Second']);
            });

            it('should set activeCategoryParent flag to Root', function () {
                expect(scope.sellData.category.activeCategoryParent).toEqual('Root');
            });

            it('should set categoryParentIndex to 1', function () {
                expect(scope.sellData.category.categoryParentIndex).toEqual(1);
            });

            it('should set connectorTop to null', function () {
                expect(scope.sellData.category.connectorTop).toBeNull();
            });

            it('should set connectorHeight to null', function () {
                expect(scope.sellData.category.connectorHeight).toBeNull();
            });

            it('should set status to success', function () {
                expect(scope.sellData.category.stepStatus.status).toEqual('success');
                expect(scope.sellData.category.stepStatus.message).toEqual('');
            });

        });

        describe('test loadCategory success for Root selected back after Second was selected', function () {
            beforeEach(function () {
                scope.afterCategoryLoadCallback = function () {
                    scope.afterCategoryLoadCallback = function () {
                        scope.afterCategoryLoadCallback = false;
                        scope.loadCategory(false, 0, 'Root', 1, true);
                    };
                    scope.loadCategory(false, 1, 'Second', 2, false);
                };
                scope.loadCategory();
            });

            it('should setup Root category data', function () {
                expect(scope.sellData.category.categoriesData.Root).toBeDefined();
            });

            it('should load response to Root category', function () {
                expect(scope.sellData.category.categoriesData.Root).toEqual(RootCategoryAPISuccessInfo);
            });

            it('should set leafSelected property to false', function () {
                expect(scope.sellData.category.leafSelected).toBeFalsy();
            });

            it('should set active category name to Root', function () {
                expect(scope.sellData.category.activeCategory).toEqual('Root');
            });

            it('should set current index to 0', function () {
                expect(scope.sellData.category.currentIndex).toEqual(0);
            });

            it('should set next index to 1', function () {
                expect(scope.sellData.category.nextIndex).toEqual(1);
            });

            it('should setup breadcrumbs', function () {
                expect(scope.sellData.item.categoryId).toEqual(['Root']);
            });

            it('should set activeCategoryParent flag to false', function () {
                expect(scope.sellData.category.activeCategoryParent).toBeFalsy();
            });

            it('should set categoryParentIndex to 1', function () {
                expect(scope.sellData.category.categoryParentIndex).toEqual(1);
            });

            it('should set connectorTop to null', function () {
                expect(scope.sellData.category.connectorTop).toBeNull();
            });

            it('should set connectorHeight to null', function () {
                expect(scope.sellData.category.connectorHeight).toBeNull();
            });

            it('should set status to success', function () {
                expect(scope.sellData.category.stepStatus.status).toEqual('success');
                expect(scope.sellData.category.stepStatus.message).toEqual('');
            });

        });

        describe('test setCategory for Second category view', function () {
            beforeEach(function () {
                scope.computeConnectorDimensions = function() {
                    return {top: 100, height: 200};
                };

                scope.afterCategoryLoadCallback = function () {
                    scope.afterCategoryLoadCallback = function () {
                        scope.afterCategoryLoadCallback = false;
                        scope.loadCategory(false, 2, 'Byzantine', 1, true);
                    };
                    scope.loadCategory(false, 1, 'Second', 2, false);
                };
                scope.loadCategory();
            });

            it('should set leafSelected property to true', function () {
                expect(scope.sellData.category.leafSelected).toBeTruthy();
            });

            it('should setup selectedCategory property', function () {
                "use strict";
                expect(scope.sellData.category.selectedCategory).toEqual(ThirdCategoryAPISuccessInfo);
            });

            it('should setup breadcrumbs', function () {
                expect(scope.sellData.item.categoryId).toEqual(['Root', 'Second', 'Byzantine']);
            });

            it('should set categoryParentIndex to 2', function () {
                expect(scope.sellData.category.categoryParentIndex).toEqual(2);
            });

            it('should set categoryIndex to 1', function () {
                expect(scope.sellData.category.categoryIndex).toEqual(1);
            });

            it('should set isCategoryLast to true', function () {
                expect(scope.sellData.category.isCategoryLast).toEqual(true);
            });

            it('should set connectorTop to 100', function () {
                expect(scope.sellData.category.connectorTop).toEqual(100);
            });

            it('should set connectorHeight to 200', function () {
                expect(scope.sellData.category.connectorHeight).toEqual(200);
            });
        });

        describe('test computeConnectorDimensions', function () {
            describe('when non-leaf selected', function () {
                beforeEach(function() {
                    scope.sellData.category.leafSelected = false;
                });

                it('should return null', function () {
                    expect(scope.computeConnectorDimensions()).toBeNull();
                });
            });

            describe('when leaf selected', function () {
                beforeEach(function() {
                    scope.sellData.category.leafSelected = true;
                });

                describe('and parent index equal to category index and category is not last', function () {
                    beforeEach(function () {
                        scope.sellData.category.categoryParentIndex = scope.sellData.category.categoryIndex = 1;
                        scope.sellData.category.isCategoryLast = false;
                    });

                    it('should return correct values', function () {
                        expect(scope.computeConnectorDimensions()).toEqual({top: -1, height: 61});
                    });
                });

                describe('and parent index equal to category index and category is last', function () {
                    beforeEach(function () {
                        scope.sellData.category.categoryParentIndex = scope.sellData.category.categoryIndex = 1;
                        scope.sellData.category.isCategoryLast = true;
                    });

                    it('should return correct values', function () {
                        expect(scope.computeConnectorDimensions()).toEqual({top: -1, height: 61});
                    });
                });

                describe('and parent lower than category and category is not last', function () {
                    beforeEach(function () {
                        scope.sellData.category.categoryParentIndex = 3;
                        scope.sellData.category.categoryIndex = 1;
                        scope.sellData.category.isCategoryLast = false;
                    });

                    it('should return correct values', function () {
                        expect(scope.computeConnectorDimensions()).toEqual({top: -123, height: 183});
                    });
                });

                describe('and parent lower than category and category is last', function () {
                    beforeEach(function () {
                        scope.sellData.category.categoryParentIndex = 3;
                        scope.sellData.category.categoryIndex = 1;
                        scope.sellData.category.isCategoryLast = true;
                    });

                    it('should return correct values', function () {
                        expect(scope.computeConnectorDimensions()).toEqual({top: -123, height: 183});
                    });
                });

                describe('and parent higher than category and category is not last', function () {
                    beforeEach(function () {
                        scope.sellData.category.categoryParentIndex = 2;
                        scope.sellData.category.categoryIndex = 4;
                        scope.sellData.category.isCategoryLast = false;
                    });

                    it('should return correct values', function () {
                        expect(scope.computeConnectorDimensions()).toEqual({top: 0, height: 182});
                    });
                });

                describe('and parent higher than category and category is last', function () {
                    beforeEach(function () {
                        scope.sellData.category.categoryParentIndex = 2;
                        scope.sellData.category.categoryIndex = 4;
                        scope.sellData.category.isCategoryLast = true;
                    });

                    it('should return correct values', function () {
                        expect(scope.computeConnectorDimensions()).toEqual({top: 0, height: 183});
                    });
                });
            });
        });
        describe('onNextStep', function () {

            it('should set validity to false if leaf is not selected', function () {
                scope.data.leafSelected = false;

                scope.onNextStep();

                expect(activeStep.setValid).toHaveBeenCalledWith(false);
                expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
            });

            it('should set validity to true and redirect if leaf is selected', function () {
                scope.data.leafSelected = true;

                scope.onNextStep();

                expect(activeStep.setValid).toHaveBeenCalledWith(true);
                expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
                expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
            });

        });

        describe('watch data.leafSelected', function(){

            it('should set pristine to false on change', function(){
                expect(activeStep.setPristine).not.toHaveBeenCalled();

                scope.data.activeCategory = 'Root';

                scope.$apply();
                expect(activeStep.setPristine).toHaveBeenCalledWith(false);
            });

        });

    });
});
