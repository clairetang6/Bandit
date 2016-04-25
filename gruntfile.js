module.exports = function(grunt){
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				src: [ 
					'1.2.0/kiwi.js',
					'plugins/fullscreen-1.0.0.js',
					'plugins/gamepad-plugin-1.0.0.js',
					'plugins/saveManager-1.0.1.js',
					'plugins/primitives-1.0.2.js',
					'kiwipreloader.js',
					'loadingState.js',
					'inputState.js',
					'levelSelectionState.js',
					'creditsState.js',
					'astar.js',
					'ghoul.js',
					'bandit.js',
					'titleState.js',
					'gameState.js',
					'game.js'
				],
				dest: 'bandit-0.10.0.js'
			}
		},

		uglify: {
			build: {
				src: 'bandit-0.10.0.js',
				dest: 'bandit-0.10.0.min.js'
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: '',
					src: ['*png'],
					dest: 'imagemin/'
				}]
			} 
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerTask('default', ['concat','uglify']);
	//grunt.registerTask('default', ['concat','uglify','imagemin']);
}