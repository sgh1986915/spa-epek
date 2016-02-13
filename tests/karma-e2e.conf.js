module.exports = function (config) {
  config.set({
    basePath: '../',

    frameworks: ['ng-scenario'],

    files: [
      'tests/e2e/**/*.scenario.js'
    ],

    exclude: [],

    proxies: { '/': 'http://local.epek.com:9000/' },

    urlRoot: '/_karma_/',

    // reporters: ['junit', 'progress'],

    junitReporter: {
      outputFile: 'tests/e2e-results.xml',
      suite: 'e2e'
    },

    // port: 9876,

    // runnerPort: 9100,

    // colors: true,

    // logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    // captureTimeout: 5000,

    singleRun: true,

    // reportSlowerThan: 500,

    plugins: [
      'karma-jasmine',
      // 'karma-requirejs',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-junit-reporter',
      'karma-ng-scenario'
    ]
  });
};