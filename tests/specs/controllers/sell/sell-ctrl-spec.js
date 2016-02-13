define(['angular-mocks', 'app/controllers/sell/sell-ctrl'], function () {
describe('sell controller', function () {

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                var notText = this.isNot ? " not" : "";
                this.message = function() {
                    return "Expected '" + angular.mock.dump(expected) + "'" +
                            notText + " to equal '" + angular.mock.dump(this.actual) + "'.";
                };
                return angular.equals(this.actual, expected);
            }
        });
    });

    var $rootScope, $controller, scope;
    var routeParams, location;
    var Sell, Step;

    beforeEach(function () {

        module('epek.controllers');

        inject(function (_$rootScope_, _$controller_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;

            $rootScope.sellData = { stepsStates: {} };

            routeParams = {};
            location = jasmine.createSpyObj('location', ['path']);

            scope = $rootScope.$new();
        });

    });

    describe('Initialization', function(){

        it('should initialize active step if it can be entered', function(){
            routeParams.step = 'image';

            var ctrl = $controller('sell', {
                $scope: scope,
                $routeParams: routeParams,
                $location: location
            });

            expect(scope.activeStep).toBe('image');
        });

        it('should redirect to video if step can not be entered', function(){
            routeParams.step = 'description';

            var ctrl = $controller('sell', {
                $scope: scope,
                $routeParams: routeParams,
                $location: location
            });

            expect(location.path).toHaveBeenCalledWith('/sell/video');
        });

        it('should redirect to video if $routeParams.step is empty', function(){

            var ctrl = $controller('sell', {
                $scope: scope,
                $routeParams: routeParams,
                $location: location
            });

            expect(location.path).toHaveBeenCalledWith('/sell/video');
        });

    });

    describe('After initialization', function(){
        
        beforeEach(function(){

            Sell = $controller('sell', {
                $scope: scope,
                $routeParams: routeParams,
                $location: location
            });

            // It is really ugly. After changing architecture we should use service for Step
            Step = Sell.Step;

        });

        describe('Step', function(){

            beforeEach(function(){
                $rootScope.sellData.stepsStates = {};
            });

            it('should be properly initialized using passed data', function(){
                var step = new Step({
                    code: 'video',
                    required: false
                });

                expect(step).toEqualData({
                    code: 'video',
                    required: false
                });
            });

            it('should initialize validity to false if step is required', function(){
                var step = new Step({
                    code: 'video',
                    required: true
                });

                expect($rootScope.sellData.stepsStates['video'].valid).toBeFalsy();
            });

            describe('Step.prototype.setValid', function(){

                it('should set validity to false', function(){
                    var step = new Step({
                        code: 'video',
                        required: true
                    });
                    $rootScope.sellData.stepsStates['video'].valid = true;

                    step.setValid(false);

                    expect($rootScope.sellData.stepsStates['video'].valid).toBeFalsy();
                });

                it('should set validity to true', function(){
                    var step = new Step({
                        code: 'video',
                        required: true
                    });

                    step.setValid(true);

                    expect($rootScope.sellData.stepsStates['video'].valid).toBeTruthy();
                });

            });

            describe('Step.prototype.isValid', function(){

                it('should return true by default if step is not required', function(){
                    var step = new Step({
                        code: 'video',
                        required: false
                    });

                    expect(step.isValid()).toBeTruthy();
                });

                it('should return false if step is not required and not valid', function(){
                    var step = new Step({
                        code: 'specifications',
                        required: false
                    });
                    step.setValid(false);

                    expect(step.isValid()).toBeFalsy();
                });

                it('should return true if step is not required and valid', function(){
                    var step = new Step({
                        code: 'specifications',
                        required: false
                    });
                    step.setValid(true);

                    expect(step.isValid()).toBeTruthy();
                });

                it('should return false if step is required and not valid', function(){
                    var step = new Step({
                        code: 'video',
                        required: true
                    });

                    expect(step.isValid()).toBeFalsy();
                });

                it('should return true if step is required and valid', function(){
                    var step = new Step({
                        code: 'video',
                        required: true
                    });
                    step.setValid(true);

                    expect(step.isValid()).toBeTruthy();
                });

            });

            describe('Step.prototype.setPristine', function(){

                it('should set pristine to false', function(){
                    var step = new Step({
                        code: 'video'
                    });
                    $rootScope.sellData.stepsStates['video'].pristine = true;

                    step.setPristine(false);

                    expect($rootScope.sellData.stepsStates['video'].pristine).toBeFalsy();
                });

                it('should set pristine to true', function(){
                    var step = new Step({
                        code: 'video'
                    });

                    step.setPristine(true);

                    expect($rootScope.sellData.stepsStates['video'].pristine).toBeTruthy();
                });

            });

            describe('Step.prototype.isPristine', function(){

                it('should return true if step is pristine', function(){
                    var step = new Step({
                        code: 'video'
                    });

                    expect(step.isPristine()).toBeTruthy();
                });

                it('should return false if step does not pristine', function(){
                    var step = new Step({
                        code: 'video'
                    });
                    step.setPristine(false);

                    expect(step.isPristine()).toBeFalsy();
                });

            });

        });

        describe('ctrl.getStep', function(){

            beforeEach(function(){
                scope.steps = [
                    new Step({code: 'video'})
                ];
            });

            it('should return existing step', function(){
                var step = Sell.getStep('video');

                expect(step.code).toBe('video');
            });

            it('should return null for nonexistent step code', function(){
                var step = Sell.getStep('abcdef');

                expect(step).toBeNull();
            });

        });

        describe('ctrl.getActiveStep', function(){

            it('should get active step based on $routeParams', function(){
                scope.steps = [
                    new Step({code: 'video'})
                ];
                routeParams.step = 'video';

                var step = Sell.getActiveStep();

                expect(step.code).toBe('video');
            });

        });

        describe('ctrl.getNextStep', function(){

            beforeEach(function(){
                scope.steps = [
                    new Step({code: 'video'}),
                    new Step({code: 'image'}),
                    new Step({code: 'description'})
                ];
            });

            it('should return next step for step in the middle', function(){
                var step = Sell.getNextStep(scope.steps[1]);

                expect(step.code).toBe('description');
            });

            it('should return the same step for last step', function(){
                var step = Sell.getNextStep(scope.steps[2]);

                expect(step.code).toBe('description');
            });
        });

        describe('ctrl.getLastValidStep', function(){

            it('should return last valid step if we have some invalid', function(){
                scope.steps = [
                    new Step({
                        code: 'video',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    }),
                    new Step({
                        code: 'image',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    }),
                    new Step({
                        code: 'description',
                        isValid: jasmine.createSpy('isValid').andReturn(false)
                    })
                ];

                var step = Sell.getLastValidStep();

                expect(step.code).toBe('image');
            });

            it('should return last step if all steps are valid', function(){
                scope.steps = [
                    new Step({
                        code: 'video',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    }),
                    new Step({
                        code: 'image',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    }),
                    new Step({
                        code: 'description',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    })
                ];

                var step = Sell.getLastValidStep();

                expect(step.code).toBe('description');
            });

        });

        describe('ctrl.getLastEnterableStep', function(){

            it('should return the first not pristine invalid step', function(){
                scope.steps = [
                    new Step({
                        code: 'video',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    }),
                    new Step({
                        code: 'image',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    }),
                    new Step({
                        code: 'description',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    }),
                    new Step({
                        code: 'specifications',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    }),
                    new Step({
                        code: 'shipping',
                        isValid: jasmine.createSpy('isValid').andReturn(false),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    }),
                    new Step({
                        code: 'payment',
                        isValid: jasmine.createSpy('isValid').andReturn(false),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    })
                ];

                var step = Sell.getLastEnterableStep();

                expect(step.code).toBe('shipping');
            });

            it('should return the last pristine step before the first pristine invalid', function(){
                scope.steps = [
                    new Step({
                        code: 'video',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    }),
                    new Step({
                        code: 'image',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    }),
                    new Step({
                        code: 'description',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    }),
                    new Step({
                        code: 'specifications',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    }),
                    new Step({
                        code: 'shipping',
                        isValid: jasmine.createSpy('isValid').andReturn(false),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    }),
                    new Step({
                        code: 'payment',
                        isValid: jasmine.createSpy('isValid').andReturn(false),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    })
                ];

                var step = Sell.getLastEnterableStep();

                expect(step.code).toBe('specifications');
            });

            it('should return the first invalid', function(){
                scope.steps = [
                    new Step({
                        code: 'video',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    }),
                    new Step({
                        code: 'image',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    }),
                    new Step({
                        code: 'description',
                        isValid: jasmine.createSpy('isValid').andReturn(false),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    })
                ];

                var step = Sell.getLastEnterableStep();

                expect(step.code).toBe('description');
            });

            it('should return the last step', function(){
                scope.steps = [
                    new Step({
                        code: 'video',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(true)
                    }),
                    new Step({
                        code: 'image',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    }),
                    new Step({
                        code: 'description',
                        isValid: jasmine.createSpy('isValid').andReturn(true),
                        isPristine: jasmine.createSpy('isPristine').andReturn(false)
                    })
                ];

                var step = Sell.getLastEnterableStep();

                expect(step.code).toBe('description');
            });

        });

        describe('ctrl.redirectToStep', function(){

            it('should call $location.path', function(){

                Sell.redirectToStep({code: 'payment'});

                expect(location.path).toHaveBeenCalledWith('/sell/payment');
            });

        });

        describe('ctrl.canEnterStep', function(){

            beforeEach(function(){
                scope.steps = [
                    new Step({
                        code: 'video',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    }),
                    new Step({
                        code: 'image',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    }),
                    new Step({
                        code: 'description',
                        isValid: jasmine.createSpy('isValid').andReturn(false)
                    }),
                    new Step({
                        code: 'category',
                        isValid: jasmine.createSpy('isValid').andReturn(false)
                    }),
                    new Step({
                        code: 'specification',
                        isValid: jasmine.createSpy('isValid').andReturn(true)
                    }),
                    new Step({
                        code: 'payment',
                        isValid: jasmine.createSpy('isValid').andReturn(false)
                    })
                ];
            });

            it('should return false if null is passed', function(){
                var res = Sell.canEnterStep(null);

                expect(res).toBeFalsy();
            });

            it('should return true if all previous steps are valid', function(){
                var res = Sell.canEnterStep(scope.steps[2]);

                expect(res).toBeTruthy();
            });

            it('should return false if previous step is invalid', function(){
                var res = Sell.canEnterStep(scope.steps[3]);

                expect(res).toBeFalsy();
            });

            it('should return false if some previous steps are invalid', function(){
                var res = Sell.canEnterStep(scope.steps[5]);

                expect(res).toBeFalsy();
            });
        });

        describe('$scope.isActiveStep', function(){

            it('should return true if passed code of active step', function(){
                scope.activeStep = 'video';

                var res = scope.isActiveStep('video');

                expect(res).toBeTruthy();
            });

            it('should return false if passed code of not active step', function(){
                scope.activeStep = 'video';

                var res = scope.isActiveStep('image');

                expect(res).toBeFalsy();
            });

        });

        describe('$scope.onStep', function(){

            beforeEach(function(){
                spyOn(Sell, 'canEnterStep').andCallThrough();
                spyOn(Sell, 'redirectToStep');
            });

            it('should not redirect to Category step which can not be entered', function(){
                var notEnterableStep = new Step({code: 'video'});
                var enterableStep = new Step({code: 'image'});
                Sell.canEnterStep.andReturn(false);
                spyOn(Sell, 'getLastEnterableStep').andReturn(enterableStep);

                scope.onStep(notEnterableStep);

                expect(Sell.canEnterStep).toHaveBeenCalledWith(notEnterableStep);
                expect(Sell.redirectToStep).toHaveBeenCalledWith(enterableStep);
            });

            it('should redirect to Description step which can be entered', function(){
                var step = new Step({code: 'video'});
                Sell.canEnterStep.andReturn(true);

                scope.onStep(step);

                expect(Sell.canEnterStep).toHaveBeenCalledWith(step);
                expect(Sell.redirectToStep).toHaveBeenCalledWith(step);
            });

        });
    });

});
});
