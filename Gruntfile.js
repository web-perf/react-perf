module.exports = function(grunt) {
	for (var key in grunt.file.readJSON('package.json').devDependencies) {
		if (key !== 'grunt' && key.indexOf('grunt') === 0) grunt.loadNpmTasks(key);
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			dev: {
				options: {
					port: '8080',
					base: '.',
					hostname: '*',
					livereload: true
				}
			}
		},
		copy: {
			bower: {
				files: [{
					expand: true,
					cwd: 'bower_components/',
					src: '**',
					dest: 'dist/bower_components/'
				}]
			},
			html: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: '**/*.html',
					dest: 'dist/'
				}]
			},
			jsx: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: '**/*.jsx',
					dest: 'dist/'
				}]
			}
		},
		less: {
			options: {
				report: true
			},
			files: {
				'dist/css/main.less': 'src/**/*.less'
			}
		},
		watch: {
			htmlcopy: {
				files: ['src/**/*.html'],
				tasks: ['copy:html']
			},
			jsxcopy: {
				files: ['src/**/*.jsx'],
				tasks: ['copy:jsx']
			},
			less: {
				files: ['src/**/*.less'],
				tasks: ['less']
			}
		},
		clean: ['dist']
	});

	grunt.registerTask('default', ['clean', 'copy', 'less']);
	grunt.registerTask('dev', ['default', 'connect', 'watch']);
};