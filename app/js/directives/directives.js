/**
 * Defines the directives used in `epek` See http://docs.angularjs.org/guide/directive
 */
define(['./index', 'ckeditor'], function (directives) {
'use strict';
directives.directive('recaptcha', ['captcha', function (captcha) {

    return {
        terminal: true,
        scope: '=',
        templateUrl: 'partials/recaptcha.html',
        link: function (scope, element, attrs) {
            captcha.create(attrs["id"], function () {});
        }
    };

}]);

/**
 * adds support for keyup event
 */
directives.directive('onKeyup', function () {

    return function (scope, elm, attrs) {

        function applyKeyup () {
            scope.$apply(attrs.onKeyup);
        }

        var minlength = scope.$eval(attrs.ngMinlength),
            maxlength = scope.$eval(attrs.ngMaxlength),
            timer;

        elm.bind('keyup', function (evt) {
            //if no key restriction specified, always fire
            if ((!minlength || elm.val().length >= minlength)
                && (!maxlength || elm.val().length <= maxlength)
                ) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function () {
                    applyKeyup();
                }, 250);
            } else {
                //do nothing
            }
        });

    };

});

/**
 * shows loading notification in case there active $http requests in current scope
 */
directives.directive('resourceLoadingNotification', ['$http', function factory ($http) {
    return {
        template: '<div class="m-loading" ng-hide="isLoadingAlertHidden()">Loading...</div>',
        replace: true,
        restrict: 'A',
        link: function postLink (scope, iElement, iAttrs) {
            scope.isLoadingAlertHidden = function () {
                return $http.pendingRequests.length === 0;
            };
        }
    };
}]);

/**
 * Creates an editable collection that expands automatically
 *
 * Nesting is not supported.
 */
directives.directive('editableCollection', ['$compile', function factory($compile) {
    return {
        link: function(scope, el, attrs) {

            //parse the element and attributes
            var expandOn = attrs.expandOn;


            var split = attrs.editableCollection.split(' ');
            var elementName = split[0];
            var collectionName = split[2];

            if (split.length != 3 || split[1] != 'in') {
                throw 'Expected editable collection defined as "{element} in {collection}" but got: '
                    + attrs.editableCollection;
            }

            if (!expandOn) {
                throw 'Expected expand-on attribute on element: ' + el.html() + ' but found: '
                    + JSON.stringify(attrs.$attr) + '\n';
            }

            /**
             * Convenience function to access the collection
             * @return the collection from the scope
             */
            function collection() {
                //Make sure the collection exists
                var result = scope.$eval(collectionName);
                if (!result) {
                    scope.$eval(collectionName + '=[]');
                    result = scope.$eval(collectionName);
                }
                return result;
            }

            //Take the elements from this one to move to a child ng-repeat
            var original = el.contents();

            //Add the ng-repeat for the actual collection
            var repeater = angular.element('<div/>');
            repeater.attr('ng-repeat', attrs.editableCollection);
            repeater.append(original);


            //Add an extra item for the overflow
            collection().push({});
            el.append(repeater);

            /**
             * @return the expandOn value of the last item
             */
            scope.lastOverflowExpander = function() {
                return collection().slice(-1)[0][attrs.expandOn];
            };

            scope.$watch('lastOverflowExpander()', function(value) {
                if (value) {
                    collection().push({});
                }
            });

            //compile everything so that Angular can link the new stuff
            $compile(el.contents())(scope);
        }
    };
}]);

/**
 * adds support of `data-validate-equals` attribute
 * to specify validation rule for two fields to be equal
 * set attribute value to scope attribute to check against
 *
 * @example <input data-ng-model="passwordConfirm" data-validate-equals="password">
 */
directives.directive('validateEquals', ['$compile', 'utils', function factory($compile, utils) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            function validateEqual(myValue, otherValue) {
                if (myValue === otherValue) {
                    ctrl.$setValidity('equal', true);
                    return myValue;
                } else {
                    ctrl.$setValidity('equal', false);
                    return undefined;
                }
            }

            scope.$watch(attrs.validateEquals, function(otherModelValue) {
                validateEqual(ctrl.$viewValue, otherModelValue);
            });

            ctrl.$parsers.unshift(function(viewValue) {
                return validateEqual(viewValue, scope.$eval(attrs.validateEquals));
            });

            ctrl.$formatters.unshift(function(modelValue) {
                return validateEqual(modelValue, scope.$eval(attrs.validateEquals));
            });
        }
    };
}]);

/**
 * Creates an ckeditor instance for this textarea
 *
 * @example <textarea data-ng-model="myModel" data-ck-editor="">
 */
directives.directive('ckEditor', function() {
    return {
        require: '?ngModel',
        link: function(scope, elm, attr, ngModel) {
            scope.editorOptions = {
                toolbar :
                    [
                        { name: 'font', items: [ 'Font','FontSize' ] },
                        { name: 'separator', items: [ '-' ] },
                        { name: 'position', items: [ 'JustifyLeft','JustifyCenter','JustifyRight' ] },
                        { name: 'separator', items: [ '-' ] },
                        { name: 'decoration', items : [ 'Bold','Italic','Underline','Strike' , 'TextColor' ] },
                        { name: 'separator', items: [ '-' ] },
                        { name: 'smiley', items: [ 'Smiley' ,  'Link' ] }
                    ],
                skin : 'epek',
                height : '350',
                removePlugins : 'elementspath',
                fontSize_defaultLabel : "22px",
                font_defaultLabel : "Arial"
            };
            var ck = CKEDITOR.replace(elm[0], scope.editorOptions);

            if (!ngModel) return;

            ck.on('pasteState', function() {
              scope.$apply(function() {
                ngModel.$setViewValue(ck.getData());
              });
            });

            ngModel.$render = function(value) {
              ck.setData(ngModel.$viewValue);
            };
        }
    };
});

});
