define(['angular-mocks', 'app/controllers/sell/image-ctrl'], function () {
describe('image controller', function () {

    var sampleImagesUrlData = {
        '1500x1': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAABCAYAAAAo2AkkAAAAH0lEQVRYhe3DQQ0AAAwDofNvejPRJyRUnaqqqqqqrj/le5qs8OR7lgAAAABJRU5ErkJggg==',
        '1x1500': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAOECAYAAABggFt/AAAAIElEQVRYhe3EMQEAAAzDoPg3vbnoBQdVlyRJkiRJkpY94B+Aqoc0/EoAAAAASUVORK5CYII=',
        '1x1': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGD4DwABBAEAfbLI3wAAAABJRU5ErkJggg=='
    };
    var MAX_HEIGHT = 900;
    var MAX_WIDTH = 1440;
    var subject;
    var scope;
    var rootScope;
    var activeStep;

    beforeEach(function () {

        module('epek.controllers');

        module(function($provide) {
            $provide.value('imageUpload', {
                deleteImage: {
                    save: function () {}
                }
            });
        });

        inject(function ($rootScope, $controller) {
            rootScope = $rootScope;
            //mockup rootScope
            rootScope.sellData = {
                validity: { image: 'pristine' },
                item: {media: {image:[]}}
            };

            scope = $rootScope.$new();
            scope.activeStep = 'image';

            //mockup html elements
            var canvas = document.createElement('canvas');
            canvas.id = 'sellImage_canvas';
            scope.canvas = canvas;

            var dropzone = document.createElement('div');
            dropzone.id = 'sellImage_dropzone';
            scope.dropzone = dropzone;

            var fileInput = document.createElement('input');
            fileInput.id = 'sellImage_fileInput';
            scope.fileInput = fileInput;

            var container = document.createElement('div');
            container.id = 'sellImage_container';
            scope.container = container;

            scope.SellCtrl = jasmine.createSpyObj('SellCtrl', ['getActiveStep', 'redirectToStep', 'getNextStep']);
            activeStep = jasmine.createSpyObj('activeStep', ['setValid', 'setPristine']);
            scope.SellCtrl.getActiveStep.andReturn(activeStep);

            subject = $controller('image', {$scope: scope, $routeParams: {step: 'image'}, $rootScope: rootScope});
            scope.$apply();

            scope.MAX_HEIGHT = MAX_HEIGHT;
            scope.MAX_WIDTH = MAX_WIDTH;
        });
    });

    describe('check if controller is on it\'s place', function(){
        it('should have loaded the subject', function(){
            expect(subject).toBeDefined();
        });
    });

    describe('check if scope is also on it\'s place', function () {
        it('should test scope to be defined', function () {
            expect(scope).toBeDefined();
        });
    });

    describe('onNextStep', function () {

        it('should set validity to false in case of no images', function () {
            rootScope.sellData = {
                images: []
            };

            scope.onNextStep();

            expect(scope.SellCtrl.getActiveStep).toHaveBeenCalledWith();
            expect(activeStep.setValid).toHaveBeenCalledWith(false);
            expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
        });

        it('should set validity to true and redirect if there are images with status "done"', function () {
            rootScope.sellData.images = [
                {status: 'done'},
                {status: 'done'}
            ];

            scope.onNextStep();

            expect(scope.SellCtrl.getActiveStep).toHaveBeenCalledWith();
            expect(activeStep.setValid).toHaveBeenCalledWith(true);
            expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
            expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
        });

        it('should set validity to true and redirect if there are images with status "uploading"', function () {
            rootScope.sellData.images = [
                {status: 'uploading'}
            ];

            scope.onNextStep();

            expect(scope.SellCtrl.getActiveStep).toHaveBeenCalledWith();
            expect(activeStep.setValid).toHaveBeenCalledWith(true);
            expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
            expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
        });

    });

    describe('check removeImage', function () {
        it('should set first image status to "removed"', function () {
            rootScope.sellData.images = [
                    {status: 'done'},
                    {status: 'error'},
                    {status: 'uploading'}
                ];
            var index = 0;
            expect(rootScope.sellData.images[index].status).toEqual('done');
            scope.removeImage({preventDefault: function () {}}, 0);
            expect(rootScope.sellData.images[index].status).toEqual('removed');
        });
    });

    xdescribe('check image resizing', function () {
        it('should test case for small image - image dimentions have to stay the same', function () {
            var fakeFile = {
                target: {
                    result: sampleImagesUrlData['1x1']
                }
            };
            var readerSpy = new FileReader();
            spyOn(readerSpy, 'readAsDataURL').andCallFake(function (file) {
                readerSpy.onload(fakeFile);
            });
            scope.createFileReader = function () {
                return readerSpy;
            };

            //event.target.result
            scope.handleResize();
            expect(readerSpy.readAsDataURL).toHaveBeenCalled();
            expect(scope.canvas.width).toEqual(1);
            expect(scope.canvas.height).toEqual(1);
        });

        it('should test case for wide image - image width have to be resized to MAX_WIDTH and height updated proportionally', function () {
            var fakeFile = {
                target: {
                    result: sampleImagesUrlData['1500x1']
                }
            };
            var readerSpy = new FileReader();
            spyOn(readerSpy, 'readAsDataURL').andCallFake(function (file) {
                readerSpy.onload(fakeFile);
            });
            scope.createFileReader = function () {
                return readerSpy;
            };

            //event.target.result
            scope.handleResize();
            expect(readerSpy.readAsDataURL).toHaveBeenCalled();
            expect(scope.canvas.width).toEqual(MAX_WIDTH);
            expect(scope.canvas.height).toEqual(1);
        });

        it('should test case for tall image - image height have to be resized to MAX_HEIGHT and width updated proportionally', function () {
            var fakeFile = {
                target: {
                    result: sampleImagesUrlData['1x1500']
                }
            };
            var readerSpy = new FileReader();
            spyOn(readerSpy, 'readAsDataURL').andCallFake(function (file) {
                readerSpy.onload(fakeFile);
            });
            scope.createFileReader = function () {
                return readerSpy;
            };

            //event.target.result
            scope.handleResize();
            expect(readerSpy.readAsDataURL).toHaveBeenCalled();
            expect(scope.canvas.width).toEqual(1);
            expect(scope.canvas.height).toEqual(MAX_HEIGHT);
        });
    });

    describe('item synchronization', function() {
        it('should add new images to the item.media.image array', function(){
            scope.sellData.images.push({url: 'foo'});
            scope.$apply();
            expect(scope.sellData.item.media.image).toEqual(['foo']);
        });
    });

});
});
