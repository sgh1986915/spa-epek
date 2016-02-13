define(['angular-mocks', 'app/controllers/sell/specifications-ctrl'], function () {

    describe('specifications controller initial state', function () {

        var attributesStub = [
            [
                {
                    "validationrules": {
                        "VariationSpecifics": "Disabled",
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Type"
                },
                {"value": [
                    {"validationrules": {}, "value": "Children's"},
                    {"validationrules": {}, "value": "Rangefinder"}
                ]}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Brand"
                },
                {"value": [
                    {"validationrules": {}, "value": "Unbranded/Generic"},
                    {"validationrules": {}, "value": "VuPoint"}
                ]}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Model"
                },
                {"value": null}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "MPN"
                },
                {"value": null}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Megapixels"
                },
                {"value": [
                    {"validationrules": {}, "value": "1.1 MP"},
                    {"validationrules": {}, "value": "24.6 MP"}
                ]}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Optical Zoom"
                },
                {"value": [
                    {"validationrules": {}, "value": "2x"},
                    {"validationrules": {}, "value": "70x"}
                ]}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "30"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Bundled Items"
                },
                {"value": [
                    {"validationrules": {}, "value": "Case or Bag"},
                    {"validationrules": {}, "value": "Tripod"}
                ]}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Manufacturer Warranty"
                },
                {"value": [
                    {"validationrules": {}, "value": "Yes"},
                    {"validationrules": {}, "value": "No"}
                ]}
            ],
            [
                {
                    "validationrules": {
                        "VariationSpecifics": "Disabled",
                        "SelectionMode": "SelectionOnly",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Country of Manufacture"
                },
                {"value": [
                    {"validationrules": {}, "value": "Unknown"},
                    {"validationrules": {}, "value": "Afghanistan"},
                    {"validationrules": {}, "value": "Zimbabwe"}
                ]}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Screen Size"
                },
                {"value": null}
            ],
            [
                {
                    "validationrules": {
                        "SelectionMode": "FreeText",
                        "MaxValues": "1"
                    },
                    "helpurl": "",
                    "helptext": "",
                    "name": "Color"
                },
                {"value": [
                    {"validationrules": {}, "value": "Absolute pink"},
                    {"validationrules": {}, "value": "Aluminum"},
                    {"validationrules": {}, "value": "Zen gray"}
                ]}
            ]
        ];

        var subject, scope, activeStep,
            $rootScope, $controller;

        beforeEach(function () {
            module('epek.controllers');

            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');

                //mockup $rootScope
                $rootScope.sellData = {
                    category: {
                        selectedCategory: {
                            categoryInfo: {
                                meta: {
                                    attributes: attributesStub
                                }
                            }
                        }
                    },
                    validity: { specifications: 'pristine' },
                    item: {
                        attributes: {
                            standard: []
                        }
                    }
                };

                scope = $rootScope.$new();

                scope.SellCtrl = jasmine.createSpyObj('SellCtrl', ['getActiveStep', 'redirectToStep', 'getNextStep']);
                activeStep = jasmine.createSpyObj('activeStep', ['setValid', 'setPristine']);
                activeStep.code = 'specifications';
                scope.SellCtrl.getActiveStep.andReturn(activeStep);

                subject = $controller('specifications', {$scope: scope, $rootScope: $rootScope});
                scope.$apply();
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
                expect(scope.sellData.specifications).toEqual({stepStatus : { status : null, message : null } , focus : {}, standardAttributes: {}, customAttributes: {}});
            });

            it('should setup initial newAttribute to empty strings', function () {
                expect(scope.newAttribute).toEqual({name:'', value: ''});
            });
        });

        describe('check data loaded properly into controller', function () {
            it('should reference $rootScope.sellData.', function () {
                scope.loadData();
                expect(scope.data.attributes).toEqual($rootScope.sellData.category.selectedCategory.categoryInfo.meta.attributes);
            });
        });

        describe('check setStandardAttributeValue', function () {
            beforeEach(function () {
                "use strict";
                scope.loadData();
            });

            it('should set property in sellData.item.attributes.standard', function () {
                scope.$apply(scope.setStandardAttributeValue('test', 'test'));
                expect(scope.sellData.item.attributes.standard).toEqual([{name: 'test', value: 'test'}]);
            });

            it('should set property in $scope.data.values', function () {
                scope.$apply(scope.setStandardAttributeValue('test', 'test'));
                expect(scope.sellData.specifications.standardAttributes).toEqual({test: 'test'});
            });
        });

        describe('check setCustomAttributeValue', function () {
            beforeEach(function () {
                "use strict";
                scope.loadData();
                scope.newAttribute.name = 'test name';
                scope.newAttribute.value = 'test value';
            });

            it('should set property in sellData.item.attributes.custom', function () {
                scope.$apply(scope.setCustomAttributeValue());
                expect(scope.sellData.item.attributes.custom).toEqual([{name: 'test name', value: 'test value'}]);
            });

            it('should set property in $scope.data.customAttributes', function () {
                scope.$apply(scope.setCustomAttributeValue());
                expect(scope.sellData.specifications.customAttributes).toEqual({'test name': 'test value'});
            });

            it('should reset newAttribute to empty strings', function () {
                scope.$apply(scope.setCustomAttributeValue());
                expect(scope.newAttribute).toEqual({name:'', value: ''});
            });
        });

        describe('check deleteCustomAttribute', function () {
            beforeEach(function () {
                "use strict";
                scope.loadData();
                scope.newAttribute.name = 'test name';
                scope.newAttribute.value = 'test value';
                scope.$apply(scope.setCustomAttributeValue());
            });

            it('should delete existing custom attribute', function () {
                scope.$apply(scope.deleteCustomAttribute('test name'));
                expect(scope.sellData.item.attributes.custom).toEqual([]);
            });

            it('should do nothing if deleting non-existent custom attribute', function () {
                scope.$apply(scope.deleteCustomAttribute('other test name'));
                expect(scope.sellData.item.attributes.custom).toEqual([{name: 'test name', value: 'test value'}]);
            });
        });

        describe('onNextStep', function () {

            it('should set validity to false if there is at least one customAttribute with empty value', function () {
                scope.sellData.item.attributes.custom = [
                    {name: 'attr1', value: 'val1'},
                    {name: 'attr2', value: ''}
                ];

                scope.onNextStep();

                expect(activeStep.setValid).toHaveBeenCalledWith(false);
                expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
            });

            it('should set validity to true if there is no customAttributes', function () {
                scope.sellData.item.attributes.custom = [];

                scope.onNextStep();

                expect(activeStep.setValid).toHaveBeenCalledWith(true);
                expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
                expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
            });

            it('should set validity to true if all customAttributes contains value', function () {
                scope.sellData.item.attributes.custom = [
                    {name: 'attr1', value: 'val1'},
                    {name: 'attr2', value: 'val2'}
                ];

                scope.onNextStep();

                expect(activeStep.setValid).toHaveBeenCalledWith(true);
                expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
                expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
            });

        });

    });

});
