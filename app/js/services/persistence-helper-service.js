/**
 * Helper which can persist any data of scope to localStorage
 */
define(['./index', './local-storage-service'], function (services) {
services.factory('PersistenceHelper', function(LocalStorage){

    var PersistenceHelper = {};

    var getUniqueKey = function(nameSpace, key){
        return nameSpace + ':' + key;
    };

    /**
     * Enables auto-sync with localStorage for scope.key
     *
     * @param {Scope} scope
     * @param {String} key - name of field on a passed scope
     * @param {String} nameSpace - should be used to uniquely store data in localStorage.
     *                             Usually controller name should be used.
     * @param {Number} [version] - could be used to automatically clear previous versions of data
     *                             in localStorage. SHOULD be used for any complex data.
     */
    PersistenceHelper.persist = function(scope, key, nameSpace, version){
        var data = LocalStorage.get(getUniqueKey(nameSpace, key));
        if (data === null ||
            angular.isDefined(version) && data && angular.isDefined(data.version) && data.version === version ||
            angular.isUndefined(version)) {

            scope[key] = data;
        } else {
            // LocalStorage.get returns null if data doesn't exist
            scope[key] = null;
            this.clear(key, nameSpace);
        }

        scope.$watch(
            key,
            function(newValue, oldValue){
                // first call when watch.last was not initialized
                if (newValue === oldValue) {
                    return;
                }

                if (angular.isDefined(version)) {
                    newValue.version = version;
                }

                LocalStorage.put(getUniqueKey(nameSpace, key), newValue);
            },
            true
        );
    };

    /**
     * Clears data in localStorage for key
     *
     * @param {String} key
     * @param {String} nameSpace - should be used to uniquely store data in localStorage.
     *                             Usually controller name should be used.
     */
    PersistenceHelper.clear = function(key, nameSpace){
        LocalStorage.remove(getUniqueKey(nameSpace, key));
    };

    return PersistenceHelper;
});
});
