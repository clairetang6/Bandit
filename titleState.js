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

	if(this.game.gamepads){
		this.game.gamepads.gamepadConnected.add(this.gamepadConnected, this);
		this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnce, this);
	}
	this.selectedMenuIconIndex = 0;
	this.selectedMenuIcon = this.buttonGroup.members[this.selectedMenuIconIndex];
	
}

titleState.start_game = function(){
	this.game.states.switchState('levelSelectionState');
}

titleState.update = function(){
	Kiwi.State.prototype.update.call(this);
	//console.log(this.clock.elapsedSinceLastPaused());

}

titleState.gamepadConnected = function(){
	console.log('gamepad started');
	this.selectedMenuIcon.playHover();
}

titleState.changeSelectedMenuIcon = function(index){
	this.selectedMenuIcon.playOff();
	this.selectedMenuIconIndex = index;
	this.selectedMenuIcon = this.buttonGroup.members[this.selectedMenuIconIndex];
	this.selectedMenuIcon.playHover();
}

titleState.getIncreasedIndex = function(){
	var index = this.selectedMenuIconIndex + 1;
	if(index >= this.buttonGroup.members.length){
		index = 0;
	}
	return index;
}

titleState.getDecreasedIndex = function(){
	var index = this.selectedMenuIconIndex - 1;
	if(index < 0){
		index = this.buttonGroup.members.length - 1;
	}
	return index;
}

titleState.buttonOnDownOnce = function(button){
	switch( button.name ){
		case "XBOX_A":
			this.selectedMenuIcon.mouseClicked();
			break;
		case "XBOX_B":
			break;
		case "XBOX_X":
			break;
		case "XBOX_Y":

			break;
		case "XBOX_DPAD_LEFT":

			break;
		case "XBOX_DPAD_RIGHT":

			break;
		case "XBOX_DPAD_UP":
			this.changeSelectedMenuIcon(this.getDecreasedIndex());
			break;
		case "XBOX_DPAD_DOWN":
			this.changeSelectedMenuIcon(this.getIncreasedIndex());
			break;
		default:		
	}
}

