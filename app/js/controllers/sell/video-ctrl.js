define(['./../index', '../../services/auth-service', '../../config', '../../services/video-upload-service', '../../services/response-service'], function (controllers, auth) {
/**
 * controller fired on /video route
 */
controllers.controller('video', ['$scope', 'auth', 'videoUpload', 'config', 'response', '$location', '$rootScope', function ($scope, auth, videoUpload, config, response, $location, $rootScope) {

    //setup controller userData space
    if ($rootScope.sellData.videos === undefined) {
        $rootScope.sellData.videos = [];
    }

    var sellData = $rootScope.sellData;
    /*
     * Array of XHRs in order to be able to cancel if user clicks on Remove video
     * when it's being uploaded
     */
    var xhrs = [];

    var uploadProgress = function(event, video) {
        $scope.$apply(function() {
            video.status.state.name = 'uploading';
            video.percentage = Math.round((event.loaded / event.total) * 100);
        });
    };

    var uploadAbort = function(event, video) {
    };

    var uploadError = function(event, video) {
        $scope.$apply(function() {
            video.status.state.name = 'error';
        });
    };

    var uploadComplete = function(event, video) {
        $scope.$apply(function() {
            if(video.status.state.name == 'error') 
                return;

            // Parsing video id and set the status
            try {
                video.id = JSON.parse(event.target.responseText).response.videoId;
                video.percentage = 100;

                video.status.state.name = 'processing';
            } catch(e) {
                video.status.state.name = 'error';
            }
            
        });
    };

    /*
     * Upload video
     *
     * @param {File} file
     */
    $scope.uploadVideo = function (file) {
        // This is required 'cause {{ videos|json }} fails
        // TODO: remove before merging
        var xhr = new XMLHttpRequest();
        var xhr_index = xhrs.length;
        xhrs[xhr_index] = xhr;

        if(!$scope.videoCounter)
            $scope.videoCounter = 1;

        var video = {
            id: '',
            status: {draft: true, state: {name: 'new'}}, 
            percentage: 0,
            xhr_index: xhr_index, // for to be able abort uploading request if user clicks on Delete button
            internalId: ++$scope.videoCounter
        };
        sellData.videos.push(video);


        // attach event listeners
        xhr.upload.addEventListener("progress", function(event) {
            uploadProgress(event, video)
        }, false);

        xhr.addEventListener("load", function(event) {
            uploadComplete(event, video)
        }, false);

        xhr.addEventListener("error", function(event) {
            uploadError(event, video);
        }, false);
        
        xhr.addEventListener("abort", function(event) {
            uploadAbort(event, video);
        }, false);

        var fd = new FormData();
        fd.append('video', document.forms.uploadNewVideoForm.file.files[0]);

        xhr.open("POST", config.VIDEO_ROOT + '/uploadVideo', true);
        xhr.send(fd);
    };

    /*
     * Keep the item.media.video aligned with sellData.videos
     */
    $scope.$watch('sellData.videos', function(videos){
        var mediaVideo = [];
        angular.forEach(videos, function(video){
            if(video.status && video.status.name && video.status.name == 'processing') {
                //
                //check the status periodically and stop when youtube is done processing
                var watcher = setInterval(function(){
                    videoUpload.videoStatus.get({videoId: video.id}, function(data){
                        video.status = data.response;
                        if (!video.status || !video.status.state || !video.status.state.name
                            || video.status.state.name !== 'processing') {
                            clearInterval(watcher);
                        }
                    });
                }, 2000);
            }

            mediaVideo.push(video.id);
        });
        $scope.sellData.item.media.video = mediaVideo;
    }, true);

    $scope.removeVideo = function(internalId) {
        $rootScope.sellData.videos =
            $rootScope.sellData.videos.filter(function(video) {
                if(video.internalId === internalId) {
                    if(video.status && video.status.name === 'uploading') {
                        xhrs[video.xhr_index].abort();
                    }
                }
                return !(video.internalId === internalId);
            });
    };

    /**
     * @type {SellCtrl}
     */
    var SellCtrl = $scope.SellCtrl;

    $scope.activeStep = SellCtrl.getActiveStep();

    $scope.onNextStep = function(){
        SellCtrl.redirectToStep(SellCtrl.getNextStep($scope.activeStep));
    };

}]);
});
