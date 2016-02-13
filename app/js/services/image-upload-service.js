/**
 * Defines Services related to image uploading and manipulation
 */
define(['./index'], function (services) {
services.factory('imageUpload', ['$resource', '$http', 'config', function($resource, $http, config) {
    return {
        deleteImage: $resource(config.IMAGE_ROOT + '/deleteImage')
    }
}]);
});
