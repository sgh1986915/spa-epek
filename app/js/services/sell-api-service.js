/**
 * Defines Services mapping to the sell API
 */
define(['./index'], function (services) {
services.factory('sellApi', ['$resource', '$http', 'config', function ($resource, $http, config) {

    //TODO useful for testing / example remove later
    var sampleListItem =
    {"categoryId": ["1", "2"], "title": "testAutomaticallyRan...Meow", "description": "\u003cdiv\u003edescription\u003c/div\u003e", "duration": 4, "paymentService": ["paypal"], "shipping": [
        {"shippingService": "someservice", "dispatchTimeMax": "4", "shippingCost": "19.99"}
    ], "location": "-12.1,20.32", "attributes": {"standard": [
        {"name": "3", "value": "value0"},
        {"name": "3", "value": "value1"},
        {"name": "3", "value": "value2"},
        {"name": "3", "value": "value3"}
    ], "custom": [
        {"name": "the sand men are", "value": "powerful"}
    ]}, "price": {"startPrice": 19.99}};

    //TODO useful for testing / example remove later
    var sampleListFixedPriceItem = {
        "variations": [
            {
                "fixedPrice": 19.99,
                "quantity": 1,
                //optional
                "color": "red",
                "size": 20
            }
        ],
        "categoryId": [
            "1",
            "2"
        ],
        "title": "testAutomaticallyRan...Meow",
        "description": "\u003cdiv\u003edescription\u003c/div\u003e",
        "duration": 4,
        "paymentService": [
            "paypal"
        ],
        "shipping": [
            {
                "shippingService": "someservice",
                "dispatchTimeMax": "4",
                "shippingCost": "19.99"
            }
        ],
        "location": "-12.1,20.32",
        "attributes": {
            "standard": [
                {
                    "name": "3",
                    "value": "value0"
                },
                {
                    "name": "3",
                    "value": "value1"
                },
                {
                    "name": "3",
                    "value": "value2"
                },
                {
                    "name": "3",
                    "value": "value3"
                }
            ],
            "custom": [
                {
                    "name": "the sand men are",
                    "value": "powerful"
                }
            ]
        }
    };

    return {
        listFixedPriceItem: function (item) {
            return $http({
                withCredentials: true,
                url: config.SELL_ROOT + '/listFixedPriceItem',
                method: 'POST',
                data: item
            });
        },
        listItem: function (item) {
            return $http({
                withCredentials: true,
                url: config.SELL_ROOT + '/listItem',
                method: 'POST',
                data: item
            });
        }, relistItem: function (item) {
            return $http({
                withCredentials: true,
                url: config.SELL_ROOT + '/relistItem',
                method: POST,
                data: item
            });
        }
    }
}]);
});


