/// <reference path="../lib/angular/angular-mocks.js" />
/// <reference path="../lib/angular/angular.js" />


var AuthServiceMocks = AuthServiceMocks || {};

AuthServiceMocks.discover = function() {

    var _get = function(isRegistered, openIdSupported, returnUrl) {

        return {
            response: {
                registration: {
                    isRegistered: isRegistered,
                    openIdSupported: {
                        isSupported: openIdSupported,
                        openIdRegistrationUrl: returnUrl
                    }
                }
            }
        };

    };

    return {
      
        notRegisteredOpenIdSupported: function (email, callback) {
            callback(_get(false, true, 'test'));
        }
        
    };

}();