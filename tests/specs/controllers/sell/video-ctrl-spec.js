define(['angular-mocks', 'app/controllers/sell/video-ctrl'], function () {
describe('sell/video controller', function () {


    var videoMock;
    var subject;
    var $rootScope, scope, activeStep;
    var scheduled;
    var videoStatus;

    beforeEach(function () {
        videoMock = {
            uploadData: {get: function(){}} ,
            videoStatus: {get: function(){}}
            , removeVideo: {save: function(){}}
        };

        spyOn(videoMock.uploadData, 'get');
        videoStatus = { "draft": true, "state": { "name": "processing" } };
        //pretend the call is successful and pass back the videoStatus, which might change during the test
        spyOn(videoMock.videoStatus, 'get').andCallFake(function(config, callback){
            callback({response: videoStatus});
        });

        spyOn(videoMock.removeVideo, 'save').andCallFake(function(config, callback){
            callback({});
        });

        module('epek.controllers');
        module(function ($provide) {
            $provide.value('videoUpload', videoMock);
        });
        inject(function (_$rootScope_, $controller) {
            $rootScope = _$rootScope_;

            scope = $rootScope.$new();
            scope.activeStep = 'video';
            $rootScope.sellData = {videos: [{id:'foo', internalId: 1, status: {}},{id:'bar', internalId: 2, status: {}},{id:'baz', internalId: 3, status: {}}]};
            $rootScope.sellData.item = {media: {video: ['foo','bar','baz']}};

            scope.SellCtrl = jasmine.createSpyObj('SellCtrl', ['getActiveStep', 'redirectToStep', 'getNextStep']);
            activeStep = jasmine.createSpyObj('activeStep', ['setValid', 'setPristine']);
            scope.SellCtrl.getActiveStep.andReturn(activeStep);

            subject = $controller('video', {$scope: scope});
        });


        //This little trick made my day, just snatch the scheduled function from the stack and call it when needed
        spyOn(window, 'setInterval').andCallFake(function (toBeScheduled) {
            scheduled = toBeScheduled;
            return 7357;
        });
        spyOn(window, 'clearInterval')
    });

    describe('onNextStep', function () {

        it('should redirect', function () {

            scope.onNextStep();

            expect(scope.SellCtrl.getActiveStep).toHaveBeenCalled();
            expect(scope.SellCtrl.redirectToStep).toHaveBeenCalled();
            expect(scope.SellCtrl.getNextStep).toHaveBeenCalled();
        });

    });

    describe('watch sellData.videos for processing to complete', function(){
        it('should schedule a periodic call to videoStatus', function(){
            scope.$apply(scope.sellData.videos[0].status.name = 'processing');
            //change just the status, so that the 'videoUpload.status' watch fires
            expect(window.setInterval).toHaveBeenCalled();
        });
        it('should cancel the scheduled status check when no longer processing', function(){
            scope.$apply(scope.sellData.videos[0].status.name = 'processing');
            expect(window.setInterval).toHaveBeenCalled();
            scheduled();
            expect(videoMock.videoStatus.get).toHaveBeenCalled();
            //should still be running because video is still processing
            expect(window.clearInterval).not.toHaveBeenCalled();
            videoStatus = { "draft": true, "state": { "name": "rejected", "reasonCode": "duplicate" } };
            scheduled();
            expect(videoMock.videoStatus.get).toHaveBeenCalled();
            expect(window.clearInterval).toHaveBeenCalledWith(7357);
        });
    });

    describe('removeVideo', function(){
        it('should remove the right video', function(){
            expect(scope.sellData.videos).toEqual([{id:'foo', internalId: 1, status: {}},{id:'bar', internalId: 2, status: {}},{id:'baz', internalId: 3, status: {}}]);
            scope.$apply(scope.removeVideo(1));
            expect(scope.sellData.videos).toEqual([{id:'bar', internalId: 2, status: {}},{id:'baz', internalId: 3, status: {}}]);
        });
        it ('should also remove the video.id from item.media.video', function(){
            scope.$apply(scope.removeVideo(3));
            expect(scope.sellData.item.media.video).toEqual(['foo', 'bar']);
        });
    });
});
});
