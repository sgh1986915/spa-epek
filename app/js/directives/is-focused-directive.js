/**
 * Defines the directives used in `epek` See http://docs.angularjs.org/guide/directive
 */
define(['./index'], function (directives) {
    'use strict';

    /**
     * Updates provided property with bool value of element focus state:
     *      true - focused
     *      false - not focused
     *
     * @example:
     * <input data-is-focused="focusState">
     */
    directives.directive("isFocused", ['$timeout', function ($timeout) {
        return function (scope, element, attrs) {
            element.bind('focus', function () {
                scope.$apply(attrs.isFocused + '=true');
            });
            element.bind('blur', function () {
                $timeout(function () {
                    scope.$eval(attrs.isFocused + '=false');
                }, 200);
            });
        }
    }]);
});