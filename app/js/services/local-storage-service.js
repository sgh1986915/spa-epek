/**
 * localStorage wrapper
 */
define(['./index'], function (services) {
services.factory('LocalStorage', function(){

    var LocalStorage = {};

    /**
     * Get an item
     *
     * @param {String} key
     * @returns {*} - stored value or null
     */
    LocalStorage.get = function(key){
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e){
            return null;
        }
    };

    /**
     * Put a new item
     *
     * @param {String} key
     * @param {*} value
     * @returns {*}
     */
    LocalStorage.put = function(key, value){
        localStorage.setItem(key, JSON.stringify(value));
        return value;
    };

    /**
     * Remove one item
     *
     * @param {String} key
     */
    LocalStorage.remove = function(key){
        localStorage.removeItem(key);
    };

    /**
     * Remove all items
     */
    LocalStorage.removeAll = function(){
        localStorage.clear();
    };

    return LocalStorage;
});
});
