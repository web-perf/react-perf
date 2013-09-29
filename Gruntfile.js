module.exports = function(grunt) {
	for (var key in grunt.file.readJSON('package.json').devDependencies) {
		if (key !== 'grunt' && key.indexOf('grunt') === 0) grunt.loadNpmTasks(key);
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			dev: {
				options: {
					port: '8888',
					base: '.',
					hostname: '*',
					livereload: true
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			all: {
				files: ['**'],
				tasks: ['']
			}
		},
		clean: ['dist']
	});

	grunt.registerTask('default', ['connect', 'watch']);
};