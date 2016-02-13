define(['angular-mocks', 'app/services/captcha-service'], function () {
describe('captcha', function () {
    beforeEach(module('epek.services'));

    var subject;
    var scope;

    beforeEach(inject(function ($rootScope, captcha) {
        //mockup recaptha 3d party service
        Recaptcha = {
            get_challenge: function () {
                return 'test';
            },
            get_response: function () {
                return 'test';
            },
            create: function () {
                return true;
            }
        };

        subject = captcha;
        scope = $rootScope.$new();
    }));

    it('should call Recaptcha::get_challenge', function () {
        expect(subject.get_challenge()).toEqual('test');
    });

    it('should call Recaptcha::get_response', function () {
        expect(subject.get_response()).toEqual('test');
    });

    it('should call Recaptcha::create', function () {
        expect(subject.create('elementId'), function () {}).toBeTruthy();
    });
});
});
