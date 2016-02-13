/**
 * bootstraps angular onto the window.document node
 * NOTE: the ng-app attribute should not be on the index.html when using ng.bootstrap
 */
define(['require', 'angular', 'app','routes', 'services/pending-services',  'impl'], function (require, ng, app, routes, pendingServices) {
    'use strict';

    /*place operations that need to initialize prior to app start here
     * using the `run` function on the top-level `epek` module
     */
    app.run(pendingServices.init)

    require(['domReady!'], function (document) {
        /* everything is loaded...go! */
        ng.bootstrap(document, ['epek']);
    });

});
    
