/**
 * captcha service: a wrapper around Recaptcha to simplify testing, etc
 */
define(['./index', 'recaptcha'], function (services) {
    services.factory('captcha', ['config', function (config) {
        return {
            get_challenge: function () {
                return Recaptcha.get_challenge();
            }, get_response: function () {
                return Recaptcha.get_response();
            }, create: function (id, callback) {
                if (!id) throw 'No element id passed to Captcha constructor';

                var API_KEY = config.RECAPTCHA_API_KEY;
                if (!API_KEY) throw 'Recaptcha API_KEY needed to be defined in config.RECAPTCHA_API_KEY';

                return Recaptcha.create(API_KEY, id, {
                    theme: 'custom',
                    custom_theme_widget: 'recaptcha_widget',
                    callback: function () {
                        if (angular.isFunction(callback)) callback(arguments);
                    }
                });
            }
        }
    }]);
});
