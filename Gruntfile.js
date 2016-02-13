'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // configurable paths
  var yeomanConfig = {
      app: 'app',
      dist: 'dist'
    };
  grunt.initConfig({
    yeoman: yeomanConfig,
    pkg: grunt.file.readJSON('package.json'),
    banner: '/* <%= pkg.name %> - v<%= pkg.version %>' + ', built <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',

    watch: {
      compass: {
        files: ['<%= yeoman.app %>/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/**/*.html',
          '<%= yeoman.app %>/css/**/*.css',
          '<%= yeoman.app %>/js/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      },
      jshint: {
        files: [
          '<%= yeoman.app %>/js/{,*/}*.js',
          'tests/specs/{,*/}*.js'
        ],
        tasks: ['jshint']
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: 'local.epek.com'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      }
    },

    clean: { src: ['dist'] },

    karma: {
      unit: {
        configFile: 'tests/karma-amd.conf.js',
        singleRun: false
      },
      continuous: {
        configFile: 'tests/karma-amd.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        plugins: [
          'karma-requirejs',
          'karma-jasmine',
          'karma-junit-reporter',
          'karma-phantomjs-launcher',
          'karma-coverage'
        ]
      },
      e2e: {
        configFile: 'tests/karma-e2e.conf.js',
        singleRun: true
      },
    },

    jshint: {
      options: { jshintrc: '.jshintrc' },
      files: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/js/{,*/}*.js',
          // '<%= yeoman.app %>/partials/{,*/}*.html',
          'tests/specs/{,*/}*.js',
          'tests/e2e/{,*/}*.js'
        ]
      }
    },

    compress: {
      main: {
        options: { mode: 'gzip' },
        expand: true,
        src: ['dist/js/main-compiled.<%= pkg.version %>.min.js'],
        dest: '',
        ext: '.<%= pkg.version %>.min.gz.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: false
      },
      dist: {
        src: 'dist/js/main-compiled.<%= pkg.version %>.js',
        dest: 'dist/js/main-compiled.<%= pkg.version %>.min.js'
      }
    },

    requirejs: {
      compile: {
        options: {
          name: 'main',
          optimize: 'none',
          baseUrl: 'app/js',
          mainConfigFile: 'app/js/main.js',
          out: 'dist/js/main-compiled.<%= pkg.version %>.js',
          generateSourceMaps: true,
          preserveLicenseComments: false
        }
      }
    },

    copy: {
      main: {
        files: [{
            expand: true,
            cwd: 'app/',
            src: [
              'font/**',
              'images/**',
              'css/**',
              'partials/**',
              'js/libs/**',
              'favicon.ico',
              'Web.config'
            ],
            dest: 'dist/'
          }]
      }
    },

    compass: {
      dist: {
        options: {
          config: 'app/config.rb',
          cssDir: 'app/css',
          sassDir: 'app/sass'
        }
      }
    },

    'string-replace': {
      dist: {
        files: { 'dist/index.html': 'app/index.html' },
        options: {
          replacements: [{
              pattern: 'js/main.js',
              replacement: 'js/main-compiled.<%= pkg.version %>.js'
            }]
        }
      }
    },

    s3: {
      options: {
        maxOperations: 20,
        access: 'public-read',
        headers: {
          'Cache-Control': 'max-age=630720000, public',
          'Expires': new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      sandbox: {
        options: { bucket: 'app.sandbox.epek.com' },
        upload: [{
            src: 'dist/**/*',
            dest: '/',
            rel: 'dist'
          }]
      },
      live: {
        options: { bucket: 'app.epek.com' },
        upload: [{
            src: 'dist/**/*',
            dest: '/',
            rel: 'dist'
          }]
      }
    }

  });

  grunt.renameTask('regarde', 'watch');
  grunt.registerTask('default', [
    // 'jshint',
    'copy',
    'string-replace',
    'requirejs',
    'uglify',
    'compress'
  ]);
  grunt.registerTask('server', [
    'compass',
    'livereload-start',
    'connect:livereload',
    'watch'
  ]);
};