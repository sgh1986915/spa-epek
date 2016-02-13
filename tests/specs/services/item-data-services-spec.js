define(['angular-mocks', 'app/services/item-data-services'], function () {
describe('item data', function () {
    beforeEach(module('epek.services'));

    var subject;
    var scope;
    var $httpBackend;

    beforeEach(inject(function (_$httpBackend_, $rootScope, itemData) {
        subject = itemData;
        $httpBackend = _$httpBackend_;

        scope = $rootScope.$new();
    }));


    describe('fetch item data', function () {
        it('should fire a get request to item info', function () {
            $httpBackend.expectGET('http://item.epek.com/seller_1/item_1/info').respond();

            subject.get_info('seller_1', 'item_1').then();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        it('should fire a get request to item description', function () {
            $httpBackend.expectGET('http://item.epek.com/seller_1/item_1/description.txt.json').respond();

            subject.get_description('seller_1', 'item_1').then();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        })
    });
});
});
