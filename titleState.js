var titleState = new Kiwi.State('titleState');

titleState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

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

