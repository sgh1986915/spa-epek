/**
 * Defines the video services as $resources that wrap $http calls
 */
define(['./index', '../config'], function (services) {
services.factory('videoUpload', ['$resource', '$http', 'config', function($resource, $http, config) {
    return {
        uploadData: $resource(config.VIDEO_ROOT + '/getUploadData'),
        videoStatus: $resource(config.VIDEO_ROOT+'/videoStatus'),
        removeVideo: $resource(config.VIDEO_ROOT+'/removeVideo'),
        videoUploadData: $resource(config.VIDEO_ROOT + '/getVideoUploadData')
    }
}]);
});
