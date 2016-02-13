define(['angular-mocks', 'app/services/util-services'], function () {
describe('$util service', function () {

    var subject;

    beforeEach(function () {
        module('epek.services');

        inject(function ($rootScope, utils) {
            subject = utils;
        });
    });

    it('should have loaded the subject', function () {
        expect(subject).toBeDefined();
    });

    describe('uniqueHash', function () {
        it('should start with 0', function () {
            expect(subject.uniqueHash()).toBe('0');
        });
        it('should not return the same value twice', function () {
            expect(subject.uniqueHash()).not.toBe(subject.uniqueHash());
        });
    });
});
});
