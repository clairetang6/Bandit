var levelSelectionState = new Kiwi.State('levelSelectionState');

levelSelectionState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addImage('levelSelectionBackground','level_select_1.png',0,0);

	this.BLOCK_PIXEL_SIZE = 50; 
	this.bps = this.BLOCK_PIXEL_SIZE; 
	this.MULTIPLIER = 1; 
	this.numberOfLevels = 21;	

}

levelSelectionState.create = function(){
	Kiwi.State.prototype.create.call(this);

	myGame.stage.color = '000000';
	
	this.mouse = this.game.input.mouse;

	if(this.game.saveManager.localStorage.exists('levelsData')){
		this.game.levelsData = this.game.saveManager.localStorage.getData('levelsData');
	}else{
		var levelsData = [];
		for(var i = 0; i <= 21; i++){
			var levelData = [{
				unlocked: false,
				highScore: 0, 
				stars: 0
			},{
				unlocked: false,
				highScore1: 0,
				highScore2: 0,
				stars: 0
			}];
			levelsData.push(levelData);
		}
		levelsData[0][0].unlocked = true;
		levelsData[0][1].unlocked = true;
		this.game.saveManager.localStorage.add('levelsData', levelsData, true);
		this.game.levelsData = levelsData; 
	}

	this.map = [
		[1, 2, 3, 4, 5],
		[6, 7, 8, 9, 10],
		[11, 12, 13, 14, 15],
		[16, 17, 18, 19, 20]
		];

	this.levelSelectionScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['levelSelectionBackground'],12 * this.MULTIPLIER, 0);
	this.levelSelectionGroup = new Kiwi.Group(this);
	for (var i = 1; i<=20; i++){
		var row = Math.floor((i-1)/5.0);
		var col = i%5; 
		if(col == 0){
			col = 5;
		}
		var icon = new LevelSelectionIcon(this, 165*col-60, 55+150*row, i);	
		if(this.game.levelsData[i-1][this.game.numPlayers-1].unlocked){
			var stars = this.game.levelsData[i-1][this.game.numPlayers-1].stars;		
			icon.animation.play('on' + stars);
			icon.addHovering();
			icon.addClicking();
		}else{
			icon.animation.play('off');
		}
		this.levelSelectionGroup.addChild(icon);
	}

	this.backButton = new MenuIcon(this, 30, 665, 'backLevelSelection');
	this.levelSelectionGroup.addChild(this.backButton);

	this.levelSelectionGroup.active = true;
	this.addChild(this.levelSelectionScreen);
	this.addChild(this.levelSelectionGroup);	

	this.selectedIconRow = 0;
	this.selectedIconCol = 0;
	this.selectedIcon = this.levelSelectionGroup.members[this.map[this.selectedIconRow][this.selectedIconCol]-1];
	console.log(this.selectedIcon.number);
	
	if(this.game.gamepads){
		this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnce, this);
	}

}

levelSelectionState.startGame = function(levelSelected){
	this.game.currentLevel = levelSelected;
	if(this.game.gamepads){
		this.game.gamepads.gamepads[0].buttonOnDownOnce.removeAll();
	}
	this.game.states.switchState('gameState');
}

levelSelectionState.changeSelectedIcon = function(row, col){
	if(this.selectedIcon.objType() == "LevelSelectionIcon"){
		this.selectedIcon.playOn();
	}else{
		console.log(this.selectedIcon);
		this.selectedIcon.playOff();
	}
	this.selectedIconRow = row;
	this.selectedIconCol = col;
	if(row < 4){
		this.selectedIcon = this.levelSelectionGroup.members[this.map[this.selectedIconRow][this.selectedIconCol]-1];
	}else{
		this.selectedIcon = this.backButton;
	}
	this.selectedIcon.playHover();
}

levelSelectionState.getIncreasedRow = function(){
	var row = this.selectedIconRow + 1;
	if(row > 4){
		row = 0;
	}
	return row;
}

levelSelectionState.getDecreasedRow = function(){
	var row = this.selectedIconRow - 1;
	if(row < 0){
		row = 4;
	}
	return row;
}

levelSelectionState.getIncreasedCol = function(){
	var col = this.selectedIconCol + 1;
	if(col > 4){
		col = 0;
	}
	return col;
}

levelSelectionState.getDecreasedCol = function(){
	var col = this.selectedIconCol - 1;
	if(col < 0){
		col = 4;
	}
	return col;
}

levelSelectionState.buttonOnDownOnce = function(button){
	switch( button.name ){
		case "XBOX_A":
			if(this.selectedIcon.objType() == 'LevelSelectionIcon'){
				this.selectedIcon.startLevel();
			}else{
				this.selectedIcon.mouseClicked();
			}
			break;
		case "XBOX_B":
			break;
		case "XBOX_X":
			break;
		case "XBOX_Y":

			break;
		case "XBOX_DPAD_LEFT":
			this.changeSelectedIcon(this.selectedIconRow, this.getDecreasedCol());
			break;
		case "XBOX_DPAD_RIGHT":
			this.changeSelectedIcon(this.selectedIconRow, this.getIncreasedCol());
			break;
		case "XBOX_DPAD_UP":
			this.changeSelectedIcon(this.getDecreasedRow(), this.selectedIconCol);
			break;
		case "XBOX_DPAD_DOWN":
			this.changeSelectedIcon(this.getIncreasedRow(), this.selectedIconCol);
			break;
		default:		
	}
}