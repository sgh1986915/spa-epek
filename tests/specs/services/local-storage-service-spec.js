define(['angular-mocks', 'app/services/local-storage-service'], function () {
describe('LocalStorage', function(){
    beforeEach(module('epek.services'));

    var LocalStorage;
    beforeEach(inject(function(_LocalStorage_){
        LocalStorage = _LocalStorage_;

        spyOn(window.localStorage, 'getItem');
        spyOn(window.localStorage, 'setItem');
        spyOn(window.localStorage, 'removeItem');
        spyOn(window.localStorage, 'clear');
    }));

    describe('LocalStorage.get', function(){

        it('should properly get data if item exists', function(){
            window.localStorage.getItem.andReturn(JSON.stringify({bbb: 'ccc'}));

            var res = LocalStorage.get('aaa');

            expect(window.localStorage.getItem).toHaveBeenCalledWith('aaa');
            expect(res).toEqual({bbb: 'ccc'});
        });

        it('should return null if item does not exist', function(){
            window.localStorage.getItem.andReturn(null);

            var res = LocalStorage.get('aaa');

            expect(window.localStorage.getItem).toHaveBeenCalledWith('aaa');
            expect(res).toBeNull();
        });

        it('should return null if localStorage contains wrong json string', function(){
            window.localStorage.getItem.andReturn('{');

            var res = LocalStorage.get('aaa');

            expect(window.localStorage.getItem).toHaveBeenCalledWith('aaa');
            expect(res).toBeNull();
        });

    });

    describe('LocalStorage.put', function(){

        it('should properly put data', function(){
            var res = LocalStorage.put('aaa', {bbb: 'ccc'});

            expect(window.localStorage.setItem).toHaveBeenCalledWith('aaa', JSON.stringify({bbb: 'ccc'}));
            expect(res).toEqual({bbb: 'ccc'});
        });

    });

    describe('LocalStorage.remove', function(){

        it('should properly remove item', function(){
            LocalStorage.remove('aaa');

            expect(window.localStorage.removeItem).toHaveBeenCalledWith('aaa');
        });

    });

    describe('LocalStorage.removeAll', function(){

        it('should properly clear localStorage', function(){
            LocalStorage.removeAll();

            expect(window.localStorage.clear).toHaveBeenCalledWith();
        });

    });

});
});