define(['angular-mocks','app/controllers/sell/description-ctrl'], function () {
describe('description controller', function () {

    var subject;
    var scope, activeStep;
    var rootScope;

    beforeEach(function () {
        module('epek.controllers');
        inject(function ($rootScope, $controller) {
            rootScope = $rootScope;
            //mockup rootScope
            rootScope.sellData = {
                validity: { description: 'pristine' }
                , item: {}
            };
            scope = $rootScope.$new();

            scope.SellCtrl = jasmine.createSpyObj('SellCtrl', ['getActiveStep', 'redirectToStep', 'getNextStep']);
            activeStep = jasmine.createSpyObj('activeStep', ['setValid', 'setPristine']);
            scope.SellCtrl.getActiveStep.andReturn(activeStep);

            subject = $controller('description', {$scope: scope, $routeParams: {step: 'description'}, $rootScope: rootScope});
            scope.$apply();
        });
    });

    describe('check if controller gets initialized', function () {
        it('should have decription with condition in sellData', function () {
            expect(subject).toBeDefined();
            scope.item.condition.should.eql(
                scope.conditions[1]
            );
        });
    });

    describe('onNextStep', function () {

        it('should set validity to false if only title is not filled', function () {
            angular.extend(rootScope.sellData.item, {
                title: '',
                condition: 'Used',
                location: '(46.3666667, 48.08333330000005)',
                description: 'Lores ipsum...'
            });

            scope.onNextStep();

            expect(activeStep.setValid).toHaveBeenCalledWith(false);
            expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
        });

        it('should set validity to false if only condition is not filled', function () {
            angular.extend(rootScope.sellData.item, {
                title: 'Item',
                condition: '',
                location: '(46.3666667, 48.08333330000005)',
                description: 'Lores ipsum...'
            });

            scope.onNextStep();

            expect(activeStep.setValid).toHaveBeenCalledWith(false);
            expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
        });

        it('should set validity to false if only location is not filled', function () {
            angular.extend(rootScope.sellData.item, {
                title: 'Item',
                condition: 'Used',
                location: '',
                description: 'Lores ipsum...'
            });

            scope.onNextStep();

            expect(activeStep.setValid).toHaveBeenCalledWith(false);
            expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
        });

        it('should set validity to false if only description is not filled', function () {
            angular.extend(rootScope.sellData.item, {
                title: 'Item',
                condition: 'Used',
                location: '(46.3666667, 48.08333330000005)',
                description: ''
            });

            scope.onNextStep();

            expect(activeStep.setValid).toHaveBeenCalledWith(false);
            expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
        });

        it('should set validity to true and redirect if there are images with status "done"', function () {
            angular.extend(rootScope.sellData.item, {
                title: 'Item',
                condition: 'Used',
                location: '(46.3666667, 48.08333330000005)',
                description: 'Lores ipsum...'
            });

            scope.onNextStep();

            expect(activeStep.setValid).toHaveBeenCalledWith(true);
            expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
            expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
        });

    });

    describe('watch data changes', function(){

        it('should set pristine to false on change', function(){
            expect(activeStep.setPristine).not.toHaveBeenCalled();

            scope.item.title = 'aaa';

            scope.$apply();
            expect(activeStep.setPristine).toHaveBeenCalledWith(false);
        });

    });
});
});

