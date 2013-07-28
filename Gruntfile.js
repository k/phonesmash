module.exports = function(grunt){
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            prod: {
                options: {
                  file: 'app.js', 
                  ignoredFiles: ['README.md', 'node_modules/**'],
                  watchedExtensions: ['js', 'coffee'],
                  watchedFolders: ['assets/js'],
                }
            },
        },
        jshint: {
            all: ['*.js']
        },
        sass: {
            dist: {
                files: {
                    'assets/css/application.css': 'assets/css/application.scss'
                }
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // running tasks
    grunt.registerTask('default', ['sass', 'jshint', 'nodemon']);

};
