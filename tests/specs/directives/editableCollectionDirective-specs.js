define(['jquery', 'angular-mocks', 'app/directives/directives', 'app/services/util-services'], function () {
    describe('editableCollectionDirective', function () {
        beforeEach(module('epek.directives'));

        it('should create an ng-repeat', inject(function ($rootScope, $compile) {
            var element;

            $rootScope.items = ['One', 'Two'];

            // AngularJS is using dealloc on the elements afterEach. It seems that normal garbage collection SHOULD take
            // care of this for us.
            element = $compile('<div data-editable-collection="item in items" data-expand-on="foo"></div>')($rootScope);
            $rootScope.$digest();

            expect($(element).find('div[ng-repeat="item in items"]').length).toEqual(3);

        }));

        it('should throw an error if expand-on is missing', inject(function ($rootScope, $compile) {
            var element;

            expect(function () {
                element = $compile('<div data-editable-collection="item in items"></div>')($rootScope);
            }).toThrow();

        }));

        it('should throw an error if the argument isn\'t readable', inject(function ($rootScope, $compile) {
            var element;

            expect(function () {
                element = $compile('<div data-editable-collection="some random jibberish" data-expand-on="foo"></div>')($rootScope);
            }).toThrow();

        }));

        it('should increase the size of the collection if the last element is changed', inject(function ($rootScope, $compile) {
            $rootScope.items = [{}];

            var element = $compile('<div data-editable-collection="item in items" data-expand-on="foo"></div>')($rootScope);
            $rootScope.items[0].foo = "one";
            $rootScope.$digest();

            expect($rootScope.items.length).toEqual(2);
            expect($(element).find('div[ng-repeat="item in items"]').length).toEqual(2);

        }));

        it('should create an array to push into if it does not exist', inject(function($rootScope, $compile){
            var element = $compile('<div data-editable-collection="item in items" data-expand-on="foo"></div>')($rootScope);
            expect($rootScope.items).toEqual([{}]);
        }));

    });
});