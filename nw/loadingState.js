var loadingState = new KiwiLoadingScreen('loadingState', 'inputState', 'loading/',{width: 1024, height: 768});

loadingState.preload = function(){
	KiwiLoadingScreen.prototype.preload.call(this);

	this.addImage('title','assets/bandit_title_1.png');
	this.addImage('lose','assets/gameover.png');
	this.addImage('win','assets/bandit_win.png');
	this.addImage('controls','assets/controls_1.png');
	this.addImage('controlsGamepad','assets/controls_1gamepad.png');

	this.addImage('cloud1','assets/clouds/cloud_0.png');
	this.addImage('cloud2','assets/clouds/cloud_1.png');
	this.addImage('cloud3','assets/clouds/cloud_2.png');
	this.addImage('cloud4','assets/clouds/cloud_3.png');
	this.addImage('cloud5','assets/clouds/cloud_4.png');
	this.addImage('cloud6','assets/clouds/cloud_5.png');
	this.addImage('cloud7','assets/clouds/cloud_6.png');
	this.addImage('cloud8','assets/clouds/cloud_7.png');
	this.addImage('cloud9','assets/clouds/cloud_8.png');
	this.addImage('cloud10','assets/clouds/cloud_9.png');
	
	this.addImage('blueFlash', 'assets/bandit_blue_flash.png');
	this.addImage('redFlash', 'assets/bandit_red_flash.png');

	this.addAudio('bombSound','sounds/bombExplosion.wav');
	this.addAudio('coinSound','sounds/coin.wav');
	this.addAudio('gunSound','sounds/gunshot.wav');
	this.addAudio('blockReappearSound','sounds/blockappear.wav');
	this.addAudio('banditDeathSound','sounds/death_1.wav');
	this.addAudio('diamondSound','sounds/diamond_1.wav');
	this.addAudio('shotgunSound','sounds/shotgun.wav');
	this.addAudio('voicesSound','sounds/bandit_voices.wav');
	this.addAudio('musicSound1','sounds/level1.ogg');
	this.addAudio('musicSound2', 'sounds/level_4.ogg');
	this.addAudio('musicSound3', 'sounds/level_7.ogg');
	this.addAudio('bossMusicSound', 'sounds/level_bandit_boss_3.ogg');

	this.addAudio('ghoulTeleportOutSound','sounds/ghoul_teleport.wav');
	this.addAudio('ghoulTeleportInSound','sounds/ghoul_teleport_in.wav');
	this.addAudio('ghoulDeathSound', 'sounds/ghoul_death.wav');
	this.addAudio('wagonSound', 'sounds/wagon_fade.wav');
	this.addAudio('horseGallopSound', 'sounds/horse_gallop.wav');
	this.addAudio('flipSound', 'sounds/flip.wav');
	this.addAudio('dingSound', 'sounds/ding.wav');
	this.addAudio('starSound', 'sounds/star.wav');
	this.addAudio('starDingSound', 'sounds/pickup_star.wav');
	this.addAudio('whiskeySound', 'sounds/whiskey.wav');
	this.addAudio('clickOn1Sound', 'sounds/clickon1.wav');
	this.addAudio('clickOff1Sound', 'sounds/clickoff1.wav');
	this.addAudio('clickOn2Sound', 'sounds/clickon2.wav');
	this.addAudio('clickOff2Sound', 'sounds/clickoff2.wav');
	this.addAudio('clickOn3Sound', 'sounds/clickon3.wav');
	this.addAudio('clickOff3Sound', 'sounds/clickoff3.wav');
	this.addAudio('evilLaughSound', 'sounds/evil_laugh.wav');

	this.addSpriteSheet('menu','assets/menu_spritesheet.png',500,50);	
	this.addSpriteSheet('quit', 'assets/quit_spritesheet.png',150,50);
	this.addImage('quitDialog', 'assets/quit_dialog.png');
	this.BLOCK_PIXEL_SIZE = 50; 
	this.bps = this.BLOCK_PIXEL_SIZE; 
	this.MULTIPLIER = 1; 

	this.addSpriteSheet('sprites','assets/bandit_spritesheet.png',this.bps,this.bps);
	this.addSpriteSheet('ghouliath','assets/ghouliath_spritesheet.png',this.bps*2, this.bps*2);
	this.numberOfLevels = 21;

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('level'+i,'assets/level_screens/level'+i+'_screen.png',true);
	}		

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('background'+i,'assets/canvases/canvas'+i+'.png',true);
		this.addSpriteSheet('backgroundSpriteSheet'+i,'assets/canvases/canvas'+i+'.png',this.bps,this.bps);
		this.addJSON('level_tilemap'+i,'level'+i+'.json');		
	}
	this.addSpriteSheet('digits','assets/digits.png',18*this.MULTIPLIER,18*this.MULTIPLIER);	
	this.addSpriteSheet('level_selection','assets/level_selection_spritesheet.png',132,132);
	this.addSpriteSheet('betweenScreen','assets/between_screen_spritesheet.png',75,75);
	this.addSpriteSheet('icons', 'assets/icon_spritesheet.png', 100, 100);
	this.addSpriteSheet('bullet','assets/bullet_spritesheet.png', 150, 75);
	
	this.addImage('tutorial1', 'assets/sign_1.png');
	this.addImage('tutorial2', 'assets/sign_2.png');
	this.addImage('tutorial3', 'assets/sign_3.png');
	this.addImage('tutorial2gamepad', 'assets/sign_2gamepad.png');
	this.addImage('tutorial3gamepad', 'assets/sign_3gamepad.png');
	this.addImage('pressup', 'assets/push_up.png');
	this.addImage('levelSelectionBackground','assets/level_select_1.png',0,0);
	this.addImage('menuBackground','assets/menu_up_bandit.png',250,0);
	this.addImage('menuArrow','assets/menu_arrow.png',469,0);
	this.addSpriteSheet('horses','assets/bandit_horse.png',200,200);
	this.addSpriteSheet('stagecoach','assets/stagecoach.png',500,250);
	this.addSpriteSheet('banditStagecoach','assets/bandit_stagecoach.png',500,250);

	this.addImage('curtain', 'assets/redside.png');
	this.addImage('alphaBox', 'assets/betweenscreen_alpha.png');

	this.addImage('pressa', 'assets/press_a_space.png');


}


loadingState.postRender = function(){
	KiwiLoadingScreen.prototype.postRender.call(this);
}