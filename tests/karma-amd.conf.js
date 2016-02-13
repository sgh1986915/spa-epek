module.exports = function (config) {
  config.set({
    basePath: '../',

    frameworks: ['jasmine', 'requirejs'],

    files: [
      {pattern: 'tests/lib/**/*.js', included: false},
      {pattern: 'app/js/**/*.js', included: false},
      {pattern: 'tests/specs/**/*.js', included: false},
      'tests/main-test.js'
    ],

    exclude: [],

    reporters: ['junit', 'progress', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    preprocessors: { 'app/js/!(libs)/**/*.js': ['coverage'] },

    junitReporter: { outputFile: 'tests/test-results.xml' },

    port: 9876,

    runnerPort: 9100,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    captureTimeout: 5000,

    singleRun: false,

    reportSlowerThan: 500,

    plugins: [
      'karma-jasmine',
      'karma-requirejs',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-junit-reporter',
      'karma-coverage'
    ]
  });
};