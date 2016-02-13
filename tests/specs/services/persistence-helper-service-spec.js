define(['angular-mocks', 'app/services/persistence-helper-service'], function () {
describe('PersistenceHelper', function(){
    beforeEach(module('epek.services'));

    var LocalStorage, PersistenceHelper;
    var scope;
    beforeEach(inject(function(_$rootScope_, _LocalStorage_, _PersistenceHelper_){
        LocalStorage = _LocalStorage_;
        PersistenceHelper = _PersistenceHelper_;

        scope = _$rootScope_.$new();
    }));

    describe('PersistenceHelper.persist', function(){

        describe('without version', function(){

            it('should restore data from localStorage if data exists', function(){
                spyOn(LocalStorage, 'get').andReturn({aaa: 'bbb'});

                PersistenceHelper.persist(scope, 'someVar', 'someControllerName');

                expect(LocalStorage.get).toHaveBeenCalledWith('someControllerName:someVar');
                expect(scope.someVar).toEqual({aaa: 'bbb'});
            });

            it('should set variable on scope to null if data does not exist', function(){
                spyOn(LocalStorage, 'get').andReturn(null);

                PersistenceHelper.persist(scope, 'someVar', 'someControllerName');

                expect(LocalStorage.get).toHaveBeenCalledWith('someControllerName:someVar');
                expect(scope.someVar).toBeNull();
            });

            it('should store data to localStorage if data on scope was replaced', function(){
                spyOn(LocalStorage, 'get');
                spyOn(LocalStorage, 'put');
                PersistenceHelper.persist(scope, 'someVar', 'someControllerName');
                scope.$digest();

                scope.someVar = {aaa: 'bbb'};

                scope.$digest();
                expect(LocalStorage.put).toHaveBeenCalledWith('someControllerName:someVar', {aaa: 'bbb'});
            });

            it('should store data to localStorage if data on scope was updated', function(){
                spyOn(LocalStorage, 'get').andReturn({aaa: 'bbb'});
                spyOn(LocalStorage, 'put');
                PersistenceHelper.persist(scope, 'someVar', 'someControllerName');
                scope.$digest();

                scope.someVar.aaa = 'ccc';

                scope.$digest();
                expect(LocalStorage.put).toHaveBeenCalledWith('someControllerName:someVar', {aaa: 'ccc'});
            });

        });

        describe('with version', function(){

            it('should restore data from localStorage if data exists with correct version', function(){
                spyOn(LocalStorage, 'get').andReturn({aaa: 'bbb', version: 1});

                PersistenceHelper.persist(scope, 'someVar', 'someControllerName', 1);

                expect(LocalStorage.get).toHaveBeenCalledWith('someControllerName:someVar');
                expect(scope.someVar).toEqual({aaa: 'bbb', version: 1});
            });

            it('should set variable on scope to null if data does not exist', function(){
                spyOn(LocalStorage, 'get').andReturn(null);

                PersistenceHelper.persist(scope, 'someVar', 'someControllerName', 1);

                expect(LocalStorage.get).toHaveBeenCalledWith('someControllerName:someVar');
                expect(scope.someVar).toBeNull();
            });

            it('should store data to localStorage if data on scope was replaced', function(){
                spyOn(LocalStorage, 'get');
                spyOn(LocalStorage, 'put');
                PersistenceHelper.persist(scope, 'someVar', 'someControllerName', 1);
                scope.$digest();

                scope.someVar = {aaa: 'bbb'};

                scope.$digest();
                expect(LocalStorage.put).toHaveBeenCalledWith('someControllerName:someVar', {aaa: 'bbb', version: 1});
            });

            it('should store data to localStorage if data on scope was updated', function(){
                spyOn(LocalStorage, 'get').andReturn({aaa: 'bbb', version: 1});
                spyOn(LocalStorage, 'put');
                PersistenceHelper.persist(scope, 'someVar', 'someControllerName', 1);
                scope.$digest();

                scope.someVar.aaa = 'ccc';

                scope.$digest();
                expect(LocalStorage.put).toHaveBeenCalledWith('someControllerName:someVar', {aaa: 'ccc', version: 1});
            });

            it('should clear data if localStorage contains old version', function(){
                spyOn(LocalStorage, 'get').andReturn({aaa: 'bbb', version: 1});
                spyOn(PersistenceHelper, 'clear');

                PersistenceHelper.persist(scope, 'someVar', 'someControllerName', 2);

                expect(scope.someVar).toBeNull();
                expect(PersistenceHelper.clear).toHaveBeenCalledWith('someVar', 'someControllerName');
            });

        });

    });

    describe('PersistenceHelper.clear', function(){

        it('should remove data from localStorage', function(){
            spyOn(LocalStorage, 'remove');

            PersistenceHelper.clear('someVar', 'someControllerName');

            expect(LocalStorage.remove).toHaveBeenCalledWith('someControllerName:someVar');
        });

    });

});
});