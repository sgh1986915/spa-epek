module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../'

    ,frameworks: ['jasmine', 'requirejs']

    // list of files / patterns to load in the browser
    ,files: [
      //libs
      {pattern: 'dist/js/libs/**/*.js', included: false}
      ,{pattern: 'tests/lib/**/*.js', included: false}
      // all the party
      ,{pattern: 'dist/js/main-compiled.*.js', included: false}
      ,{pattern: 'dist/js/main-compiled.*.js.map', included: false}
      // ,{pattern: './build/js/main-compiled-compressed.js', included: false}
      // all the sources, tests
      ,{pattern: 'tests/specs/**/*.js', included: false}
      // do not include the app here! Test the compiled app!
      // needs to be last https://github.com/testacular/testacular/wiki/RequireJS
      ,'tests/main-compiled-test.js'
    ]

    // list of files to exclude
    ,exclude: []

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress', 'junit'
    // CLI --reporters progress
    ,reporters: ['junit', 'progress']

    ,junitReporter: {
      // will be resolved to basePath (in the same way as files/exclude patterns)
      outputFile: 'tests/test-results.xml'
    }

    // web server port
    // CLI --port 9876
    ,port: 9876

    // cli runner port
    // CLI --runner-port 9100
    ,runnerPort: 9100

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    ,colors: true

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // CLI --log-level debug
    ,logLevel: config.LOG_INFO

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    ,autoWatch: true

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    ,browsers: ['ChromeCanary']

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    ,captureTimeout: 10000

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    ,singleRun: false

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    ,reportSlowerThan: 500

    // compile coffee scripts
    ,preprocessors: {
      '**/*.coffee': 'coffee'
    }

    ,plugins: [
      'karma-jasmine'
      ,'karma-requirejs'
      ,'karma-chrome-launcher'
      ,'karma-firefox-launcher'
      ,'karma-junit-reporter'
    ]
  });
};    
