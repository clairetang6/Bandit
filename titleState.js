var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addImage('title','title_1.png');
	this.addImage('lose','gameover.png');
	this.addImage('win','bandit_win.png');
	this.addImage('controls','controls_1.png');

	this.addAudio('bombSound','sounds/Cannon-SoundBible.com-1661203605.wav');
	this.addAudio('coinSound','sounds/coin.wav');
	this.addAudio('gunSound','sounds/gunshot.wav');
	this.addAudio('blockReappearSound','sounds/blockappear.wav');
	this.addAudio('banditDeathSound','sounds/death_1.wav');
	this.addAudio('diamondSound','sounds/diamond_1.wav');
	this.addAudio('shotgunSound','sounds/shotgun.wav');
	this.addAudio('voicesSound','sounds/bandit_voices.wav');
	this.addAudio('musicSound','sounds/level1.mp3');

	this.addSpriteSheet('menu','menu_sprite.png',500,50);
}

titleState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = 'AAAABB';
	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;
	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['title'],0,0);
	this.controlsScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['controls'],0,-1000);

	this.buttonGroup = new Kiwi.Group(this);

	this.playerButton1 = new MenuIcon(this, 270, 475, '1player');
	this.playerButton2 = new MenuIcon(this, 270, 550, '2player');
	this.controlsButton = new MenuIcon(this, 270, 625, 'controls');

	this.addChild(this.background);
	this.addChild(this.controlsScreen);
	this.buttonGroup.addChild(this.playerButton1);
	this.buttonGroup.addChild(this.playerButton2);
	this.buttonGroup.addChild(this.controlsButton);
	this.addChild(this.buttonGroup);
	this.mouse = this.game.input.mouse;

	this.backButton = new MenuIcon(this, 50, 675, 'backControls');
	this.backButton.visible = false;
	this.addChild(this.backButton);

}

titleState.start_game = function(){
	this.game.states.switchState('gameState');
}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	//console.log(this.clock.elapsedSinceLastPaused());

}

