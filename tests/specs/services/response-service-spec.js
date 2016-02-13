define(['angular-mocks', 'app/services/response-service'], function () {
    describe('response service', function () {

        var subject;

        var successExample = {
            "version":"2-0-0",
            "callStatus":{
                "status":"success",
                "error":[null],
                "timestamp":"2012-11-20T11:00:24+00:00"
            },
            "response":{"content":"content"}
        };

        var errorExample = {
            "version":"2-0-0",
            "callStatus":{
                "status":"failure",
                "error":[
                    {
                        "errorType":"requestError",
                        "errorCode":"sellapi-invalid-data",
                        "severityCode":"error",
                        "message":"Shown to user"
                    }
                ],
                "timestamp":"2012-11-18T19:02:39+00:00"}
        };

        beforeEach(function () {
            module('epek.services');
            inject(function (response) {
                subject = response;
            });
        });

        it('should unwrap response when no error', function () {
            var scope = {};
            var response = subject.unwrap(successExample, scope);
            expect(response).toBe(successExample.response);
        });

        it('should set the success status on scope', function () {
            var scope = {};
            subject.unwrap(successExample, scope);
            expect(scope.callStatus).toBe(successExample.callStatus);
        });

        it('should unwrap response when error', function () {
            var scope = {};
            var response = subject.unwrap(errorExample, scope);
            expect(response).toBe(errorExample.response);
        });

        it('should set the error status on scope', function () {
            var scope = {};
            subject.unwrap(errorExample, scope);
            expect(scope.callStatus).toBe(errorExample.callStatus);
        });
    });

});