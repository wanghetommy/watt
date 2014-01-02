module.exports = function(grunt){

    var banner = '/**\n'+
        '* <%= pkg.name %> Library v<%= pkg.version %> https://github.com/wanghetommy/watt/\n'+
        '* @date <%= grunt.template.today("yyyy-mm-dd hh:MM") %>\n'+
        '* @author taylor wong\n'+
        '* @Copyright 2013 wanghetommy@gmail.com Licensed under the Apache License, Version 2.0 (the "License");\n'+
        '* you may not use this file except in compliance with the License.\n'+
        '* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0\n'+
        '*/;\n';

    var srcFile =  'watt.src.js';
    var minFile =  'watt.min.js';

    grunt.file.defaultEncoding = 'utf8';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner:banner
            },
            dist:{
                src: [
                    'src/watt.core.js',
                    'src/watt.bus.js',
                    'src/watt.presenter.js'
                ],
                dest: srcFile
            }
        },
        uglify: {
            options: {
                banner:banner
            },
            build: {
                src: srcFile,
                dest: minFile
            }               
        }
    });


    //loading plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //default task
    grunt.registerTask('default', ['concat','uglify']);
}
