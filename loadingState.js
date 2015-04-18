var loadingState = new KiwiLoadingScreen('loadingState', 'titleState', 'loading/',{width: 1024, height: 768});

loadingState.preload = function(){
	KiwiLoadingScreen.prototype.preload.call(this);

	this.addImage('title','bandit_title_1.png');
	this.addImage('lose','gameover.png');
	this.addImage('win','bandit_win.png');
	this.addImage('controls','controls_1.png');
	this.addImage('controlsGamepad','controls_1gamepad.png');

	this.addImage('cloud1','_clouds/cloud_wispy_1.png');
	this.addImage('cloud2','_clouds/cloud_wispy_2.png');
	this.addImage('cloud3','_clouds/cloud_wispy_3.png');
	this.addImage('cloud4','_clouds/cloud_wispy_4.png');
	this.addImage('cloud5','_clouds/cloud_wispy_5.png');
	this.addImage('cloud6','_clouds/cloud_wispy_6.png');
	this.addImage('cloud7','_clouds/cloud_wispy_7.png');
	this.addImage('cloud8','_clouds/cloud_wispy_8.png');
	this.addImage('cloud9','_clouds/cloud_wispy_9.png');

	this.addAudio('bombSound','sounds/Cannon-SoundBible.com-1661203605.wav');
	this.addAudio('coinSound','sounds/coin.wav');
	this.addAudio('gunSound','sounds/gunshot.wav');
	this.addAudio('blockReappearSound','sounds/blockappear.wav');
	this.addAudio('banditDeathSound','sounds/death_1.wav');
	this.addAudio('diamondSound','sounds/diamond_1.wav');
	this.addAudio('shotgunSound','sounds/shotgun.wav');
	this.addAudio('voicesSound','sounds/bandit_voices.wav');
	this.addAudio('musicSound','sounds/level1.ogg');
	this.addAudio('musicSound2', 'sounds/level_4.ogg');

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

	this.addSpriteSheet('menu','menu_sprite.png',500,50);	
	this.BLOCK_PIXEL_SIZE = 50; 
	this.bps = this.BLOCK_PIXEL_SIZE; 
	this.MULTIPLIER = 1; 

	this.addSpriteSheet('sprites','bandit_spritesheet.png',this.bps,this.bps);
	this.addSpriteSheet('ghouliath','ghouliath_spritesheet.png',this.bps*2, this.bps*2);
	this.numberOfLevels = 21;

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('level'+i,'level'+i+'_screen.png',true);
	}		

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('background'+i,'canvas'+i+'.png',true);
		this.addSpriteSheet('backgroundSpriteSheet'+i,'canvas'+i+'.png',this.bps,this.bps);
		this.addJSON('level_tilemap'+i,'level'+i+'.json');		
	}
	this.addSpriteSheet('digits','digits.png',18*this.MULTIPLIER,18*this.MULTIPLIER);	
	this.addSpriteSheet('level_selection','level_selection_spritesheet.png',132,132);
	this.addSpriteSheet('betweenScreen','between_screen_spritesheet.png',75,75);
	this.addSpriteSheet('icons', 'icon_spritesheet.png', 100, 100);
	
	this.addImage('tutorial1', 'sign_1.png');
	this.addImage('tutorial2', 'sign_2.png');
	this.addImage('tutorial3', 'sign_3.png');
	this.addImage('pressup', 'push_up.png');
	this.addImage('levelSelectionBackground','level_select_1.png',0,0);
	this.addImage('menuBackground','menu_up_bandit.png',250,0);
	this.addImage('menuArrow','menu_arrow.png',469,0);
	this.addSpriteSheet('horses','bandit_horse.png',200,200);
	this.addSpriteSheet('stagecoach','stagecoach.png',500,250);
	this.addSpriteSheet('banditStagecoach','bandit_stagecoach.png',500,250);

	this.addImage('curtain', 'redside.png');
	this.addImage('alphaBox', 'betweenscreen_alpha.png');


}


loadingState.postRender = function(){
	KiwiLoadingScreen.prototype.postRender.call(this);
}