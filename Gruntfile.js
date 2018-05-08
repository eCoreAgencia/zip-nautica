"use strict";

module.exports = function(grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    watch: {
      images: {
        files: "dev/img/**/*.{png,jpg,gif}",
        tasks: ["imagemin"]
      },
      sass: {
        files: "dev/scss/**/*.scss",
        tasks: ["sass", "cmq", "postcss", "cssmin"]
      },
      js: {
        files: "dev/js/**/*.js",
        tasks: ["uglify", "concat"]
      },
      svg: {
        files: "dev/svg/**/*.svg",
        tasks: ["svgmin"]
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'front/css/checkout-custom.css': 'dev/scss/checkout-custom.scss',
          'front/css/style.css': 'dev/scss/style.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: 'last 3 versions'
          })
        ]
      },
      dist: {
        src: [
          'front/css/checkout-custom.css',
          'front/css/style.css'
        ]
      }
    },

    cmq: {
      options: {
        log: true
      },
      dist: {
        files: {
          'front/css/style.css': 'front/css/style.css',
        }
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
        noAdvanced: true,
        banner: ''
      },
      css: {
        files: {
          "front/checkout-custom.css": "front/css/checkout-custom.css",
          "front/zipnautica.css": "front/css/style.css"
        }
      }
    },

    svgmin: {
      options: {
        plugins: [{
          removeViewBox: false
        }, {
          removeUselessStrokeAndFill: false
        }, {
          removeEmptyAttrs: false
        }]
      },
      dist: {
        expand: true,
        cwd: 'dev/svg',
        src: '**/*.svg',
        dest: 'front/svg'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          "front/js/scripts.min.js": "dev/js/scripts.js"
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      base: {
        src: [
          'front/js/animations.min.js',
          'front/js/mobile-detect.min.js',
          'front/js/scripts.min.js'
        ],
        dest: 'front/zipnautica.js'
      },
    },

    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'dev/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'front/'
        }]
      }
    },

    devUpdate: {
      main: {
        options: {
          updateType: 'force',
          reportUpdated: false,
          semver: false,
          packages: {
            devDependencies: true,
            dependencies: false
          },
          packageJson: null,
          reportOnlyPkgs: []
        }
      }
    }

  });

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("css", ["sass", "cmq", "postcss", "cssmin"]);
  grunt.registerTask("img", ["imagemin"]);
  grunt.registerTask("js", ["uglify", "concat"]);
  grunt.registerTask("svg", ["svgmin"]);
  grunt.registerTask("compile", ["sass", "cmq", "postcss", "cssmin", "imagemin", "uglify", "concat", "svgmin"]);
  grunt.registerTask("update", ["devUpdate"]);

};
