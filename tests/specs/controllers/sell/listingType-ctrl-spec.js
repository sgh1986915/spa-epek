define(['angular-mocks', 'app/controllers/sell/listingType-ctrl'], function () {
    describe('sell/listingType', function () {

        var $rootScope;
        var scope, subject, activeStep;

        beforeEach(function () {
            module('epek.controllers');
            inject(function (_$rootScope_, $controller) {
                $rootScope = _$rootScope_;

                scope = $rootScope.$new();
                $rootScope.sellData = {
                    item: {
                        listingType: 'fixed',
                        variations: [ {media: {video:[], image:[]}} ]
                    }
                };
                scope.attributeKeys = [];
                scope.newAttribute = {name: 'sth', value: 'here'};

                $rootScope.sellData['category'] = 
                    {'selectedCategory': {'categoryInfo': {'meta': 
                    {"attributes": [
                        [{"name": "foo"}, {"value": [{"value": "x"}, {"value": "y"}, {"value": "z"}]}], 
                        [{"name": "bar"}, {"value": [{"value": "a"}, {"value": "b"}]}]
                    ]}}}}; 

                scope.SellCtrl = jasmine.createSpyObj('SellCtrl', ['getActiveStep', 'redirectToStep', 'getNextStep']);
                activeStep = jasmine.createSpyObj('activeStep', ['setValid', 'setPristine']);
                scope.SellCtrl.getActiveStep.andReturn(activeStep);

                subject = $controller('listingType', {$scope: scope});
                scope.$apply();
            });
        });

        describe('singleVariation', function () {

            it('should return true when there is only one', function () {
                expect(scope.singleVariation()).toBe(true);
            });

            it('should return false when there is more than one', function () {
                scope.item.variations.push({});
                expect(scope.singleVariation()).toBe(false);
            });
        });

        describe('removeVariation', function () {

            it('should remove the right variation', function () {
                scope.item.variations = ['one', 'two', 'three'];
                scope.removeVariation(1);
                expect(scope.item.variations).toEqual(['one', 'three']);
            });

        });

        describe('removeAllVariations', function () {
            it('should remove all variations and reset the first one', function () {
                scope.item.variations = ['one', 'two', 'three'];
                scope.removeAllVariations();
                expect(scope.item.variations).toEqual([{media: {video: [], image: []}}]);
            });
        });

        describe('addVariation', function () {
            beforeEach(function () {
                scope.item.variations = [
                    { fixedPrice: 3, quantity: 4, one: 'one' },
                    { fixedPrice: 3, quantity: 4,
                        media: {
                            video: ['foo', 'bar']
                        },
                        two: 'two'
                    }
                ];
            });

            it('should add a variation to the array', function(){
                scope.addVariation();
                expect(scope.item.variations.length).toEqual(3);
            });

            it('should initialize the new variation', function(){
                scope.addVariation();
                expect(scope.item.variations.slice(-1)[0]).
                    toEqual({media: {video: [], image: []}});
            });

            it('should set existing attributes to new variation', function(){
                scope.attributeKeys = ['attr1', 'attr2'];
                scope.item.variations = [
                    {fixedPrice: 1, attr1: 'val1.1', attr2: 'val2.1', media: {video: [], image: []}},
                    {fixedPrice: 2, attr1: 'val1.2', attr2: 'val2.2', media: {video: [], image: []}}
                ];

                scope.addVariation();

                expect(scope.item.variations).toEqual([
                    {fixedPrice: 1, attr1: 'val1.1', attr2: 'val2.1', media: {video: [], image: []}},
                    {fixedPrice: 2, attr1: 'val1.2', attr2: 'val2.2', media: {video: [], image: []}},
                    {attr1: '', attr2: '', media: {video: [], image: []}}
                ]);
            });
        });

        describe('toggleVideoAndImageSelection', function() {
            it('should not show select images and videos by default', function() {
                expect(scope.showAddVisuals).toBe(false);
            });
            it('should show select images and videos screen after toggle', function(){
                scope.toggleShowAddVisuals();
                expect(scope.showAddVisuals).toBe(true);
            });
        });

        describe('select visuals', function() {
            it('should add the selected video to the array', function() {
                scope.addVariation();
                scope.toggleVideo(1, 'videoId');
                expect(scope.item.variations[1].media.video).toEqual(['videoId']);
                expect(scope.isVideoSelected(1, 'videoId')).toBe(true);
            });
            it('should remove the selected video from the array', function() {
                scope.addVariation();
                scope.item.variations[1].media.video = ['videoId'];
                expect(scope.isVideoSelected(1, 'videoId')).toBe(true);
                scope.toggleVideo(1, 'videoId');
                expect(scope.item.variations[1].media.video).toEqual([]);
                expect(scope.isVideoSelected(1, 'videoId')).toBe(false);
            });
            it('should add the selected image to the array', function() {
                scope.addVariation();
                scope.toggleImage(1, 'imageUrl');
                expect(scope.item.variations[1].media.image).toEqual(['imageUrl']);
                expect(scope.isImageSelected(1, 'imageUrl')).toBe(true);
            });
            it('should remove the selected image from the array', function() {
                scope.addVariation();
                scope.item.variations[1].media.image = ['imageUrl'];
                expect(scope.isImageSelected(1, 'imageUrl')).toBe(true);
                scope.toggleImage(1, 'imageUrl');
                expect(scope.item.variations[1].media.image).toEqual([]);
                expect(scope.isImageSelected(1, 'imageUrl')).toBe(false);
            });
        });

        describe('add variation attribute', function() {

            it('should add the given attribute', function() {
                scope.addVariationAttribute({name: 'foo', value: 'bar'});
                expect(scope.item.variations[0].foo).toEqual('bar');
                expect(scope.attributeKeys).toEqual(['foo']);
            });

            it('should not add attribute with duplicating name', function(){
                scope.attributeKeys = ['foo'];
                scope.item.variations = [
                    {fixedPrice: 1, foo: 'val1.1'},
                    {fixedPrice: 2, foo: 'val1.2'}
                ];

                scope.addVariationAttribute({name: 'foo', value: 'bar'});

                expect(scope.attributeKeys).toEqual(['foo']);
                expect(scope.item.variations).toEqual([
                    {fixedPrice: 1, foo: 'val1.1'},
                    {fixedPrice: 2, foo: 'val1.2'}
                ]);
            });

            it('should add the given attribute to all variations', function(){
                scope.item.variations = [
                    {fixedPrice: 1},
                    {fixedPrice: 2},
                    {fixedPrice: 3}
                ];

                scope.addVariationAttribute({name: 'foo', value: 'bar'});

                expect(scope.item.variations).toEqual([
                    {fixedPrice: 1, foo: 'bar'},
                    {fixedPrice: 2, foo: ''},
                    {fixedPrice: 3, foo: ''}
                ]);
            });

            it('should reset newAttribute after adding', function(){
                var newAttribute = {name: 'foo', value: 'bar'};

                scope.addVariationAttribute(newAttribute);

                expect(newAttribute).toEqual({name: '', value: ''});
            });
        });

        describe('deleteVariationAttribute', function(){

            it('should remove attribute from all variations', function(){
                scope.item.variations = [
                    {fixedPrice: 1, foo: 'bar'},
                    {fixedPrice: 2, foo: ''},
                    {fixedPrice: 3, foo: ''}
                ];

                scope.deleteVariationAttribute('foo');

                expect(scope.item.variations).toEqual([
                    {fixedPrice: 1},
                    {fixedPrice: 2},
                    {fixedPrice: 3}
                ]);
            });

            it('should remove attribute from attributeKeys', function(){
                scope.attributeKeys = ['foo'];
                scope.item.variations = [
                    {fixedPrice: 1, foo: 'bar'},
                    {fixedPrice: 2, foo: ''},
                    {fixedPrice: 3, foo: ''}
                ];

                scope.deleteVariationAttribute('foo');

                expect(scope.attributeKeys).toEqual([]);
            });

        });

        describe('loadData', function() {
            it('should use the data from category (step 4)', function() {
                scope.loadData();
                expect(scope.data.attributes).toEqual(['foo', 'bar']);
                expect(scope.data.options).toEqual({
                    'foo': [{"value": "x"}, {"value": "y"}, {"value": "z"}],
                    'bar': [{"value": "a"}, {"value": "b"}]
                });
            });
        });

        describe('$scope.noVideo', function(){

            it('should return true if video array is not defined (video step was not entered)', function(){
                $rootScope.sellData.videos = undefined;

                var res = scope.noVideo();

                expect(res).toBeTruthy();
            });

            it('should return true if video array is empty (video step was entered)', function(){
                $rootScope.sellData.videos = [];

                var res = scope.noVideo();

                expect(res).toBeTruthy();
            });

            it('should return false if video array is not empty', function(){
                $rootScope.sellData.videos = ['someVideo'];

                var res = scope.noVideo();

                expect(res).toBeFalsy();
            });

        });

        describe('$scope.noImages', function(){

            it('should return true if images array is not defined (images step was not entered)', function(){
                $rootScope.sellData.images = undefined;

                var res = scope.noImages();

                expect(res).toBeTruthy();
            });

            it('should return true if images array is empty (images step was entered)', function(){
                $rootScope.sellData.images = [];

                var res = scope.noImages();

                expect(res).toBeTruthy();
            });

            it('should return false if images array is not empty', function(){
                $rootScope.sellData.images = ['someImage'];

                var res = scope.noImages();

                expect(res).toBeFalsy();
            });

        });

        describe('$scope.emptyMedia', function(){

            it('should return true if there is no video and images', function(){
                spyOn(scope, 'noVideo').andReturn(true);
                spyOn(scope, 'noImages').andReturn(true);

                var res = scope.emptyMedia();

                expect(res).toBeTruthy();
                expect(scope.noVideo).toHaveBeenCalled();
                expect(scope.noImages).toHaveBeenCalled();
            });

            it('should return false if there is video and no images', function(){
                spyOn(scope, 'noVideo').andReturn(false);
                spyOn(scope, 'noImages').andReturn(true);

                var res = scope.emptyMedia();

                expect(res).toBeFalsy();
                expect(scope.noVideo).toHaveBeenCalled();
                expect(scope.noImages).not.toHaveBeenCalled();
            });

            it('should return false if there is images and no video', function(){
                spyOn(scope, 'noVideo').andReturn(true);
                spyOn(scope, 'noImages').andReturn(false);

                var res = scope.emptyMedia();

                expect(res).toBeFalsy();
                expect(scope.noVideo).toHaveBeenCalled();
                expect(scope.noImages).toHaveBeenCalled();
            });

        });

        describe('onNextStep', function () {

            describe('if auction', function(){

                beforeEach(function(){
                    scope.data.type = 'auction';
                });

                it('should set validity to false if price is not defined', function () {
                    scope.item.duration = 1;

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false if price.startPrice is null (input was cleaned)', function () {
                    scope.item = {
                        price: {startPrice: null},
                        duration: 1
                    };

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false if price.startPrice == 0', function () {
                    scope.item = {
                        price: {startPrice: 0},
                        duration: 1
                    };

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false if duration is null (input was cleaned)', function () {
                    scope.item = {
                        price: {startPrice: 1},
                        duration: null
                    };

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false if duration == 0', function () {
                    scope.item = {
                        price: {startPrice: 1},
                        duration: 0
                    };

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to true and redirect if price.startPrice > 0 and duration > 0', function () {
                    scope.item = {
                        price: {startPrice: 1},
                        duration: 1
                    };

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(true);
                    expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
                    expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
                });

            });

            describe('if fixed', function(){

                beforeEach(function(){
                    scope.data.type = 'fixed';
                });

                it('should set validity to false in case of 1 variation if fixedPrice is null (input was cleaned)', function () {
                    scope.item.variations = [
                        { fixedPrice: null, quantity: 1 }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false in case of 1 variation if fixedPrice == 0', function () {
                    scope.item.variations = [
                        { fixedPrice: 0, quantity: 1 }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false in case of 1 variation if quantity is null (input was cleaned)', function () {
                    scope.item.variations = [
                        { fixedPrice: 1, quantity: null }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false in case of 1 variation if quantity == 0', function () {
                    scope.item.variations = [
                        { fixedPrice: 1, quantity: 0 }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to true and redirect in case of 1 variation if fixedPrice > 0 and quantity > 0', function () {
                    scope.item.variations = [
                        { fixedPrice: 1, quantity: 1 }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(true);
                    expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
                    expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
                });

                it('should set validity to false in case of 2 variation if second variation is not valid', function () {
                    scope.item.variations = [
                        { fixedPrice: 1, quantity: 1 },
                        { fixedPrice: 1, quantity: 0 }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to true and redirect in case of 2 variation if all variation are valid', function () {
                    scope.item.variations = [
                        { fixedPrice: 1, quantity: 1 },
                        { fixedPrice: 2, quantity: 2 }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(true);
                    expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
                    expect(scope.SellCtrl.getNextStep).toHaveBeenCalledWith(activeStep);
                });

                it('should set validity to false if there is one custom attribute is null', function(){
                    scope.attributeKeys = ['attr1', 'attr2'];
                    scope.item.variations = [
                        { fixedPrice: 1, quantity: 1, attr1: 'aaa1', attr2: null },
                        { fixedPrice: 2, quantity: 2, attr1: 'aaa1', attr2: 'bbb' }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

                it('should set validity to false if there is at least one not filled custom attribute', function(){
                    scope.attributeKeys = ['attr1'];
                    scope.item.variations = [
                        { fixedPrice: 1, quantity: 1, attr1: '' },
                        { fixedPrice: 2, quantity: 2, attr1: 'aaa' }
                    ];

                    scope.onNextStep();

                    expect(activeStep.setValid).toHaveBeenCalledWith(false);
                    expect(scope.SellCtrl.redirectToStep).not.toHaveBeenCalled();
                });

            });

        });


        describe('watch data changes', function(){

            it('should set pristine to false on change data', function(){
                expect(activeStep.setPristine).not.toHaveBeenCalled();

                scope.item.variations.push({fixedPrice: 1, quantity: 1});
                scope.data.type = 'fixed';

                scope.$apply();
                expect(activeStep.setPristine).toHaveBeenCalledWith(false);
            });

        });


    });

});

