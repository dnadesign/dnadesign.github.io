module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! DNA Designed Communications Limited | Copyright 2014 */'
		},
		less: {
			demos: {
				options: {
					paths: ['assets/demos/'],
					compress: true
				},
				files: {
					'assets/demos/demos.css': ['assets/demos/*.less']
				}
			},
		},
		watch: {
			demos: {
				files: ['assets/demos/*.less'],
				tasks: ['less:demos']
			},
			grunt: {
				files: ['Gruntfile.js'],
				tasks: []
			}
		}
	});

	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'watch']);
};
