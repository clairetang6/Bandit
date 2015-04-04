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
	this.game.input.keyboard.onKeyDown.add(this.onPress, this);

	if(this.game.saveManager.localStorage.exists('levelsData')){
		this.game.levelsData = this.game.saveManager.localStorage.getData('levelsData');
	}else{
		this.createLevelsData();
	}

	this.random = new Kiwi.Utils.RandomDataGenerator();

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

	var rowcol = this.getRowColOfHighestUnlockedLevel();
	this.availableIcons = [];

	//availableIcons goes from level 1 to highest level unlocked PLUS 1 for the back button. 
	for(var i = 0; i <= this.map[rowcol[0]][rowcol[1]]; i++){
		this.availableIcons.push(i);
	}

	this.selectedIconRow = rowcol[0];
	this.selectedIconCol = rowcol[1];
	this.selectedIcon = this.levelSelectionGroup.members[this.map[this.selectedIconRow][this.selectedIconCol]-1];
	this.selectedIcon.playHover();

	//index into the members array, which is 1 less than the level number. 
	this.availableIconsIndex = this.map[this.selectedIconRow][this.selectedIconCol] - 1;
	
	if(this.game.gamepads){
		this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnce, this);
	}

}

levelSelectionState.onPress = function(keyCode){
	if(keyCode == Kiwi.Input.Keycodes.LEFT){
		this.tryDirection('left');
	}else if(keyCode == Kiwi.Input.Keycodes.RIGHT){
		this.tryDirection('right');
	}else if(keyCode == Kiwi.Input.Keycodes.UP){
		this.tryDirection('up');
	}else if(keyCode == Kiwi.Input.Keycodes.DOWN){
		this.tryDirection('down');
	}else if(keyCode == Kiwi.Input.Keycodes.TAB){
		this.changeSelectedIconByTab();
	}else if(keyCode == Kiwi.Input.Keycodes.ENTER || keyCode == Kiwi.Input.Keycodes.SPACEBAR){
		if(this.selectedIcon.number){
			this.startGame(this.selectedIcon.number);
		}else{
			this.selectedIcon.mouseClicked();
		}
	}else if(keyCode == Kiwi.Input.Keycodes.I){
		console.log(this.selectedIcon.type + ' row:' + this.selectedIconRow + ' col:' + this.selectedIconCol);

	}
}

levelSelectionState.createLevelsData = function(){
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

levelSelectionState.getRowColOfHighestUnlockedLevel = function(){
	var highestUnlockedLevel = 0;
	for (var i = 1; i <= 20; i++){
		if(this.game.levelsData[i-1][this.game.numPlayers-1].unlocked == true){
			highestUnlockedLevel = i;
		}else{
			break;
		}
	}
	var row = 0;
	var col = 0;
	for (var i = 0; i < this.map.length; i++){
		for (var j = 0; j < this.map[0].length; j++){
			if(this.map[i][j] == highestUnlockedLevel){
				row = i;
				col = j;
			}
		}
	}
	return [row, col];
}

levelSelectionState.startGame = function(levelSelected){
	this.game.currentLevel = levelSelected;
	if(this.game.gamepads){
		this.game.gamepads.gamepads[0].buttonOnDownOnce.removeAll();
	}
	this.game.states.switchState('gameState');
}

levelSelectionState.changeSelectedIconByTab = function(){
	if(this.selectedIcon.objType() == "LevelSelectionIcon"){
		this.selectedIcon.playOn();
	}else{
		this.selectedIcon.playOff();
	}	

	if(this.availableIconsIndex == this.availableIcons.length){
		this.availableIconsIndex = 0;
	}else{
		this.availableIconsIndex++;
	}

	this.changeSelectedIconByLevel(this.availableIconsIndex + 1);
	this.selectedIcon.playHover();	
}

levelSelectionState.changeSelectedIconByLevel = function(level){
	var index = level - 1; 
	if(index == this.availableIcons.length){
		this.selectedIcon = this.backButton;
		this.selectedIconRow = 4;
		this.selectedIconCol = 0;
	}else{
		this.selectedIcon = this.levelSelectionGroup.members[index];
		var row = 0;
		var col = 0;
		for (var i = 0; i < this.map.length; i++){
			for (var j = 0; j < this.map[0].length; j++){
				if(this.map[i][j] == index + 1){
					row = i;
					col = j;
				}
			}
		}
		this.selectedIconRow = row;
		this.selectedIconCol = col;
	}
}

levelSelectionState.changeSelectedIcon = function(row, col){
	if(this.selectedIcon.objType() == "LevelSelectionIcon"){
		this.selectedIcon.playOn();
	}else{
		this.selectedIcon.playOff();
	}
	this.selectedIconRow = row;
	this.selectedIconCol = col;
	if(row < 4){
		this.selectedIcon = this.levelSelectionGroup.members[this.map[this.selectedIconRow][this.selectedIconCol]-1];
		this.availableIconsIndex = this.map[this.selectedIconRow][this.selectedIconCol] - 1;
	}else{
		this.selectedIcon = this.backButton;
		this.availableIconsIndex = this.availableIcons.length - 1;
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

levelSelectionState.tryDirection = function(direction){
	switch(direction){
		case 'left':
			var tryRow = this.selectedIconRow;
			var tryCol = this.getDecreasedCol();
			if(tryRow < 4){
				if(this.game.levelsData[this.map[tryRow][tryCol]-1][this.game.numPlayers-1].unlocked){
					this.changeSelectedIcon(tryRow, tryCol);
				}					
			}else{
				this.changeSelectedIcon(tryRow, 0);
			}
	
			break;
		case 'right':
			var tryRow = this.selectedIconRow;
			var tryCol = this.getIncreasedCol();
			if(tryRow < 4){
				if(this.game.levelsData[this.map[tryRow][tryCol]-1][this.game.numPlayers-1].unlocked){
					this.changeSelectedIcon(tryRow, tryCol);
				}					
			}else{
				this.changeSelectedIcon(tryRow, 0);
			}	
			break;
		case 'up':
			var tryRow = this.getDecreasedRow();
			var tryCol = this.selectedIconCol;
			if(tryRow < 4){
				if(this.game.levelsData[this.map[tryRow][tryCol]-1][this.game.numPlayers-1].unlocked){
					this.changeSelectedIcon(tryRow, tryCol);
				}else{
					this.changeSelectedIcon(0, 0);
				}					
			}else{
				this.changeSelectedIcon(tryRow, 0);
			}		
			break;
		case 'down':
			var tryRow = this.getIncreasedRow();
			var tryCol = this.selectedIconCol;
			if(tryRow < 4){
				if(this.game.levelsData[this.map[tryRow][tryCol]-1][this.game.numPlayers-1].unlocked){
					this.changeSelectedIcon(tryRow, tryCol);
				}else{
					this.changeSelectedIcon(4, 0);
				}					
			}else{
				this.changeSelectedIcon(tryRow, 0);
			}		
			break;						
	}
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
		case "XBOX_START":
			if(this.selectedIcon.objType() == 'LevelSelectionIcon'){
				this.selectedIcon.startLevel();
			}else{
				this.selectedIcon.mouseClicked();
			}
			break;			
		case "XBOX_DPAD_LEFT":
			this.tryDirection('left');
			break;
		case "XBOX_DPAD_RIGHT":
			this.tryDirection('right');
			break;
		case "XBOX_DPAD_UP":
			this.tryDirection('up');
			break;
		case "XBOX_DPAD_DOWN":
			this.tryDirection('down');
			break;
		default:		
	}
}

levelSelectionState.shutDown = function(){
	this.game.input.keyboard.onKeyDown.removeAll();
}