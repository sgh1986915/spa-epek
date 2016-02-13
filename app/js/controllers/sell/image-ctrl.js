define(['./../index', '../../services/image-upload-service'], function (controllers) {
/**
 * controller fired on /sell/step2 route
 */
controllers.controller('image', ['$scope', '$routeParams', 'imageUpload', '$location', '$q', 'config', '$rootScope', function ($scope, $routeParams, imageUpload, $location, $q, config, $rootScope) {

    //setup controller userData space
    if ($rootScope.sellData.images === undefined) {
        //init empty objects
        $rootScope.sellData.images = [];
    }

    var sellData = $rootScope.sellData;

    //set image settings
    $scope.MAX_HEIGHT = 900;
    $scope.MAX_WIDTH = 1440;

    //private properties
    var ctrlPrefix = 'sellImage_';

    /**
     * dragenter event handler
     * @param event {object}
     */
    var containerDragenter = function (event) {
        if (event.target === $scope.container) {
            angular.element($scope.dropzone).addClass('dragstarted');
        }
    };

    /**
     * dragleave event handler
     * @param event
     */
    var containerDragleave = function (event) {
        if (event.target === $scope.container) {
            angular.element($scope.dropzone).removeClass('dragstarted');
        }
    };

    /**
     * event listener fired on files selected/dropped
     * @param event {object}
     */
    var handleDrop = function (event) {
        event.stopPropagation();
        var files = event.target.files;

        angular.element($scope.dropzone).addClass("processing");

        var num = sellData.images.length;
        for (var i = 0, len = files.length; i < len; i++) {
            //init empty object (status: new, uploading, error, done )
            sellData.images.push({ file: files[i], urlData: null, status: 'new', percentage: 0 });

            // iterate over file(s) and process them for uploading
            var promise = $scope.handleResize(files[i], num);
            promise.then(function (resultObject) {
                sellData.images[resultObject.index].urlData = resultObject.data;
                uploadFile(resultObject.index);
            });
            num += 1;
        }

        angular.element($scope.dropzone).removeClass("processing");
    };

    /**
     * helper function to create new instance of FileReader
     */
    $scope.createFileReader = function () {
        return new FileReader();
    };

    /**
     * resizes image using FileData + canvas to MAX_HEIGHT/MAX_WIDTH dimensions
     * @param file {object} file input
     * @param fileIndex {int} index of current file in images array
     */
    $scope.handleResize = function (file, fileIndex) {
        var ctx = $scope.canvas.getContext("2d"),
            image = document.createElement("img"),
            reader = $scope.createFileReader(),
            deferred = $q.defer();

        reader.onload = function (event) {
            image.src = event.target.result;

            if (!image.complete) {
                //fix for bug when complete didn't fired on file selected
                var callee = arguments.callee;
                setTimeout(function () {
                    var localVarEvent = event;
                    callee(localVarEvent);
                }, 2);
                return;
            }

            ctx.drawImage(image, 0, 0);

            var width = image.width,
                height = image.height;

            if (width > $scope.MAX_WIDTH || height > $scope.MAX_HEIGHT) {
                if (width > height) {
                    if (width > $scope.MAX_WIDTH) {
                        height = Math.round(height * ($scope.MAX_WIDTH / width));
                        width = $scope.MAX_WIDTH;
                    }
                } else {
                    if (height > $scope.MAX_HEIGHT) {
                        width = Math.round(width * ($scope.MAX_HEIGHT / height));
                        height = $scope.MAX_HEIGHT;
                    }
                }
            }

            $scope.canvas.width = width;
            $scope.canvas.height = height;

            ctx = $scope.canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, width, height);

            var resizedImage = {data: $scope.canvas.toDataURL("image/png"), index: fileIndex};
            deferred.resolve(resizedImage);
            if (!$scope.$$phase) { $scope.$digest(); }
        };
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    //upload events listeners
    var uploadProgress = function (event, fileIndex) {
        var image = sellData.images[fileIndex];
        image.status = 'uploading';
        image.percentage = Math.round((event.loaded / event.total) * 100);
        if (!$scope.$$phase) { $scope.$digest(); }
    };

    var uploadError = function (event, fileIndex) {
        $scope.$apply(function () {
            sellData.images[fileIndex].status = 'error';
        });
    };

    var uploadAbort = function (event, fileIndex) {
        //
    };

    var uploadComplete = function (event, fileIndex) {
        $scope.$apply(function () {
            var image = sellData.images[fileIndex];
            if (image.status !== 'error') {
                image.percentage = 100;
                image.status = 'done';
            }
        });
    };

    /**
     * performs file upload to api
     * @param fileIndex {int} index of file object in images array
     */
    var uploadFile = function (fileIndex) {
        var image = sellData.images[fileIndex],
            fd = new FormData();

        //fd.append('file', image.file);//upload original file
        fd.append('file', image.urlData);//upload file urlData
        var xhr = new XMLHttpRequest();

        //register upload progress event listener
        xhr.upload.addEventListener("progress", function (event) {
            uploadProgress(event, fileIndex);
        }, false);

        xhr.addEventListener("load", function (event) {
            uploadComplete(event, fileIndex);
        }, false);

        xhr.addEventListener("error", function (event) {
            uploadError(event, fileIndex);
        }, false);

        xhr.addEventListener("abort", function (event) {
            uploadAbort(event, fileIndex);
        }, false);

        xhr.onload = function (event) {
            if (this.status == 200) {
                //image successfully uploaded - populate object with received data
                var apiResponse = JSON.parse(this.responseText);
                $scope.$apply(function () {
                    var image = sellData.images[fileIndex];
                    image.deleteId = apiResponse.response.deleteId;
                    image.url = apiResponse.response.url;
                });
            } else {
                //some error occurred
                apiResponse = JSON.parse(this.responseText);
                if (apiResponse.callStatus.status === 'failure') {
                    $scope.$apply(function () {
                        image = sellData.images[fileIndex];
                        image.status = 'error';
                        image.errorMessage = apiResponse.callStatus.error[0].message;
                    });
                }
            }
        };

        //send file to server
        xhr.open("POST", config.IMAGE_ROOT + '/uploadImage');
        xhr.send(fd);

        image.abortUpload = function(){
            xhr.abort();
        };
    };

    /**
     * "Remove" button handler - sets image object status to 'removed'
     * @param event
     * @param fileIndex file index in userData array
     */
    $scope.removeImage = function (event, fileIndex) {
        event.preventDefault();
        var image = sellData.images[fileIndex];
        switch (image.status) {
            case 'uploading'://if upload is in progress -> abort it
                image.abortUpload();//stop upload process
                image.percentage = 0;
                break;
            case 'done'://if image is already uploaded to server -> call deleteImage
                imageUpload.deleteImage.save({deleteImageId: image.deleteId});
                break;
        }
        image.status = 'removed';
    };

    /**
     * @type {SellCtrl}
     */
    var SellCtrl = $scope.SellCtrl;

    $scope.activeStep = SellCtrl.getActiveStep();

    var validate = function(){
        var doneImages = sellData.images.filter(function(image){ return image.status === 'done'; });
        var uploadingImages = sellData.images.filter(function(image){ return image.status === 'uploading'; });

        var valid = doneImages.length > 0 || uploadingImages.length > 0;
        $scope.activeStep.setValid(valid);

        return valid;
    };

    $scope.$watch('sellData.images', function(images, oldImages){
        // first call when watch.last was not initialized yet
        if (angular.equals(images, oldImages)) {
            return;
        }

        $scope.activeStep.setPristine(false);

        var imageUrls = [];
        angular.forEach(images, function(image){
            imageUrls.push(image.url);
        });
        sellData.item.media.image = imageUrls;

        validate();
    }, true);

    $scope.onNextStep = function () {
        if (validate()) {
            SellCtrl.redirectToStep(SellCtrl.getNextStep($scope.activeStep));
        }
    };

    /*
     Instead of using the browser's default 'ghost image' feedback, you can optionally set a drag icon

     var dragIcon = document.createElement('img');
     dragIcon.src = 'logo.png';
     dragIcon.width = 100;
     e.dataTransfer.setDragImage(dragIcon, -10, -10);
     */

    /**
     * register initial controller events
     */
    if (!$scope.canvas) {
        $scope.canvas = document.getElementById(ctrlPrefix + 'canvas');
    }
    if (!$scope.dropzone) {
        $scope.dropzone = document.getElementById(ctrlPrefix + 'dropzone');
    }
    if (!$scope.fileInput) {
        $scope.fileInput = document.getElementById(ctrlPrefix + 'fileInput');
    }
    if (!$scope.container) {
        $scope.container = document.getElementById(ctrlPrefix + 'container');
    }

    if (!$scope.container) {
        throw 'Error: no container element found (#' + ctrlPrefix + 'container)';
    }

    if (!$scope.fileInput) {
        throw 'Error: no input[type="file"] found (#' + ctrlPrefix + 'fileInput)';
    }

    $scope.fileInput.addEventListener("change", handleDrop, false);

    $scope.container.addEventListener('dragenter', containerDragenter, true);
    $scope.container.addEventListener('dragleave', containerDragleave, true);
}]);
});
