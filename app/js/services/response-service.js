define(['./index'], function (services) {

    services.factory('response', ['config', function ResponseService(config) {
       return {
           /**
            * Unwraps the wrapped service response and sets the status on the
            * given scope if needed.
            *
            * @param wrapped the wrapped response
            * @param scope the scope to modify in case an interesting status
            *        message is returned
            *
            * @returns the unwrapped response
            */
           unwrap: function(wrapped, scope){
               scope.callStatus = wrapped.callStatus;
               return wrapped.response;
           }
       };
    }]);
});
