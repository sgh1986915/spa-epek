require.config({
    /* sets up shorthand paths for reference in module 'define's */
    /* note that these paths are from the PROJECT ROOT, not the ./tests subdir*/
    paths: {
        'angular': './app/lib/angular/angular'
    /* since our root path is the PROJECT ROOT, we setup a shorthand path to
     * the specs directory'
     */
        ,'specs': './tests/sample'
        ,'app': './tests/sample/src'
    }
    /* this is for libs that do not conform to AMD
     * the `exports` param points to the global NS this
     * non-amd lib sets up
     */
    ,shim: {
        'angular': { exports: 'angular' }
    }
});

/* start our testing, note that we must require our spec(s) */
require(['specs/angular-amd-spec'], function () {
    dump('tests/sample/main.js is starting requirejs');
    window.__testacular__.start();
});
