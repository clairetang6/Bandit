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

	this.levelSelectionScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['levelSelectionBackground'],0,-18*this.MULTIPLIER);
	this.levelSelectionGroup = new Kiwi.Group(this);
	for (var i = 1; i<=20; i++){
		var row = Math.floor((i-1)/5.0);
		var col = i%5; 
		if(col == 0){
			col = 5;
		}
		var icon = new LevelSelectionIcon(this, 165*col-60, 55+150*row, i);
		if(this.game.levelsUnlocked[i-1]==1){
			icon.animation.play('on1');
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

}

levelSelectionState.startGame = function(levelSelected){
	this.game.currentLevel = levelSelected;
	this.game.states.switchState('gameState');
}