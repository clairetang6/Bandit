var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

	this.BLOCK_PIXEL_SIZE = 50; 
	this.bps = this.BLOCK_PIXEL_SIZE; 
	this.MULTIPLIER = 1; 
	this.numPlayers = this.game.numPlayers;

	this.addSpriteSheet('sprites','bandit_spritesheet.png',this.bps,this.bps);
	this.addSpriteSheet('ghouliath','ghouliath_spritesheet.png',this.bps*2, this.bps*2);
	this.currentLevel = 1; 
	this.numberOfLevels = 16;

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('level'+i,'level'+i+'_screen.png',true);
	}		

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('background'+i,'canvas'+i+'.png',true);
		this.addSpriteSheet('backgroundSpriteSheet'+i,'canvas'+i+'.png',this.bps,this.bps);
		this.addJSON('level_tilemap'+i,'level'+i+'.json');		
	}
	this.addSpriteSheet('digits','digits.png',18*this.MULTIPLIER,18*this.MULTIPLIER);	

}

gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;

	this.STAGE_Y_OFFSET = 32 * this.MULTIPLIER;
	this.STAGE_X_OFFSET = 38 * this.MULTIPLIER;

	this.x = this.bps - this.STAGE_X_OFFSET;
	this.y = this.bps - this.STAGE_Y_OFFSET;

	this.GRID_ROWS = 15;
	this.GRID_COLS = 20;	

	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.winScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['win'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);
	this.loseScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['lose'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);

	this.mouse = this.game.input.mouse;


	this.digitGroup = new Kiwi.Group(this);
	this.bombIconGroup = new Kiwi.Group(this);

	for (var i = 0; i<4; i++){
		var digit = new Digit(this, 10+(i*18),-18,'red', 4-i);
		digit.animation.play('0');
		this.digitGroup.addChild(digit);
	}
	for (var i = 0; i<3; i++){
		var bomb = new Digit(this, 10+((4+i)*18),-18,'red', i+7);
		bomb.animation.play('bomb');
		this.bombIconGroup.addChild(bomb);
	}
	if(this.numPlayers == 2){
		for (var i = 0; i<4; i++){
			var digit = new Digit(this, 920+(i*18),-18,'blue', 4-i);
			digit.animation.play('0');
			this.digitGroup.addChild(digit);
		}	
		for (var i = 0; i<3; i++){
			var bomb = new Digit(this, 920-(18*(i+1)),-18,'blue', i+7);
			bomb.animation.play('bomb');
			this.bombIconGroup.addChild(bomb);
		}
	}

	for(var i = 0; i <this.bombIconGroup.members.length; i++){
		this.bombIconGroup.members[i].x = -2*this.bps;
	}


	this.BANDIT_HITBOX_X_PERCENTAGE = 0.2;
	this.BANDIT_HITBOX_Y_PERCENTAGE = 0.1;

	this.COIN_HITBOX_X_PERCENTAGE = 0.46;
	this.COIN_HITBOX_Y_PERCENTAGE = 0.46;

	this.BOMB_HITBOX_X_PERCENTAGE = 0.33;
	this.BOMB_HITBOX_Y_PERCENTAGE = 0.33;	



	this.banditGroup = new Kiwi.Group(this);

	this.red = new Bandit(this,-(this.bps),-(this.bps),'red');
	this.red.animation.play('idleleft');
	this.banditGroup.addChild(this.red);
	this.redHeartsGroup = new Kiwi.Group(this);

	if(this.numPlayers == 2){
		this.blue = new Bandit(this,-(this.bps),-(this.bps),'blue');
		this.blue.animation.play('idleleft');
		this.banditGroup.addChild(this.blue);
		this.blueHeartsGroup = new Kiwi.Group(this);	
	}

	this.game.input.keyboard.onKeyDown.add(this.onKeyDownCallback, this);
	this.debugKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.I);

	this.coinGroup = new Kiwi.Group(this);
	this.bombGroup = new Kiwi.Group(this);
	this.ghoulGroup = new Kiwi.Group(this);
	this.hiddenBlockGroup = new Kiwi.Group(this);
	this.cracksGroup = new Kiwi.Group(this);

	this.random = new Kiwi.Utils.RandomDataGenerator();

	this.bombSound = new Kiwi.Sound.Audio(this.game, 'bombSound', 0.3, false);
	this.coinSound = new Kiwi.Sound.Audio(this.game, 'coinSound', 0.1, false);
	this.coinSound.addMarker('start',0,1,false);
	this.gunSound = new Kiwi.Sound.Audio(this.game, 'gunSound', 0.1, false);
	this.gunSound.addMarker('start',0,1,false);
	this.blockReappearSound = new Kiwi.Sound.Audio(this.game, 'blockReappearSound',0.3,false);
	this.blockReappearSound.addMarker('start',.5,1,false);

	this.banditDeathSound = new Kiwi.Sound.Audio(this.game, 'banditDeathSound',0.3, false);
	this.banditDeathSound.addMarker('start',0,1,false);
	this.diamondSound = new Kiwi.Sound.Audio(this.game, 'diamondSound', 0.1, false);
	this.diamondSound.addMarker('start',0,1,false);

	this.showLevelScreen();
	
}

gameState.showLevelScreen = function(){
	this.showingLevelScreen = true;
	this.levelScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['level'+this.currentLevel],-18*this.MULTIPLIER,-18*this.MULTIPLIER);
	this.addChild(this.levelScreen);

	this.createLevelTimer = this.game.time.clock.createTimer('createLevelTimer',.5,0,false);
	this.createLevelTimerEvent = this.createLevelTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.createLevel,this);
	
	this.createLevelTimer.start();	
}

gameState.createLevel = function(){
	console.log('creating level '+ this.currentLevel);

	var blockArrays = this.parseBlocks('level_tilemap'+this.currentLevel);
	this.permBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);

	//coins
	var coinsLayerArray = blockArrays[2];
	var width = blockArrays[4];
	var tileWidth = blockArrays[3];

	var coinHitboxX = Math.round(this.bps*this.COIN_HITBOX_X_PERCENTAGE);
	var coinHitboxY = Math.round(this.bps*this.COIN_HITBOX_Y_PERCENTAGE);

	for(var i = 0; i<coinsLayerArray.length;i++){
		if(coinsLayerArray[i]==67){
			var coinPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var coin = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],coinPixels[0],coinPixels[1]);
			coin.animation.add('spin',[66,67,68,69],0.1,true);
			coin.animation.play('spin');
			coin.box.hitbox = new Kiwi.Geom.Rectangle(coinHitboxX,coinHitboxY,this.bps - 2*coinHitboxX,this.bps-2*coinHitboxY);			
			this.coinGroup.addChild(coin);
		}else{
			if(coinsLayerArray[i]!=0){
				var diamondPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
				var diamond = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],diamondPixels[0], diamondPixels[1]);
				diamond.animation.add('shine',[88],0.1,false);
				diamond.animation.play('shine');
				this.coinGroup.addChild(diamond);
			}
		}
	}

	//bombs
	var bombsLayerArray = blockArrays[8];

	var bombHitboxX = Math.round(this.bps*this.BOMB_HITBOX_X_PERCENTAGE);
	var bombHitboxY = Math.round(this.bps*this.BOMB_HITBOX_Y_PERCENTAGE);

	for(var i = 0; i<bombsLayerArray.length; i++){
		if(bombsLayerArray[i] == 58){
			var bombPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var bomb = new Bomb(this, bombPixels[0], bombPixels[1]);
			bomb.animation.add('idle',[57],0.1,false);
			bomb.animation.add('explode',[64,63,62,58],0.3,false);
			bomb.animation.play('idle');
			bomb.box.hitbox = new Kiwi.Geom.Rectangle(bombHitboxX, bombHitboxY, this.bps-2*bombHitboxX, this.bps-2*bombHitboxY);
			this.bombGroup.addChild(bomb);
		}else{
			if(bombsLayerArray[i] == 69){
				var cracksPixel = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
				var cracks = new Cracks(this, cracksPixel[0], cracksPixel[1]);
				this.cracksGroup.addChild(cracks);
				this.permBlocks[this.getRow(i, width)][this.getCol(i,width)] = 1;
				console.log('perm blocks: ' + this.getRow(i,width) + ' ' + this.getCol(i,width));
			}
		}
	}

	//ghouls
	var ghoulsLayerArray = blockArrays[5];
	for(var i = 0; i<ghoulsLayerArray.length;i++){
		if(ghoulsLayerArray[i]==74){
			var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var ghoul = new Ghoul(this,ghoulPixels[0],ghoulPixels[1],'left','gray');
			this.ghoulGroup.addChild(ghoul);
		}else{
			if(ghoulsLayerArray[i]==91){
				var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
				var ghoul = new RedGhoul(this,ghoulPixels[0],ghoulPixels[1],'left');
				this.ghoulGroup.addChild(ghoul);
			}else{
				if(ghoulsLayerArray[i]==104){
					var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
					var ghoul = new BlueGhoul(this,ghoulPixels[0],ghoulPixels[1],'left');
					this.ghoulGroup.addChild(ghoul);					
				}else{
					if(ghoulsLayerArray[i]==127){
						var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
						var ghoul = new BlackGhoul(this,ghoulPixels[0],ghoulPixels[1],'left');
						this.blackGhoul = ghoul;
						this.ghoulGroup.addChild(ghoul);
					}else{
						if(ghoulsLayerArray[i]==167){
							var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
							var ghoul = new KingGhoul(this,ghoulPixels[0],ghoulPixels[1],'left');
							this.ghoulGroup.addChild(ghoul);
							this.kingGhoul = ghoul;
						}
					}
				}
			}
		}
	}

	for(var i = 0; i<ghoulsLayerArray.length; i++){
		if(ghoulsLayerArray[i] == 1){
			this.red.startingPixelLocations = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
		}
		if(this.numPlayers == 2){
			if(ghoulsLayerArray[i] == 19){
				this.blue.startingPixelLocations = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			}	
		}	
	}

	
	this.red.coinsCollected = 0;
	this.updateCoinCounter(this.red);
	this.red.bombsCollected = 0;
	this.updateBombCounter(this.red);
	this.red.numberOfHearts = 3;
	this.red.isAlive = true;
	this.red.isDeadAndOnGround = false;	
	
	this.red.x = this.red.startingPixelLocations[0];
	this.red.y = this.red.startingPixelLocations[1];	
		
	if(this.numPlayers==2){
		this.blue.coinsCollected = 0;
		this.updateCoinCounter(this.blue); 				
		this.blue.bombsCollected = 0;
		this.updateBombCounter(this.blue);	
		this.blue.numberOfHearts = 3;
		this.blue.isAlive = true;
		this.blue.isDeadAndOnGround = false;
		
		this.blue.x = this.blue.startingPixelLocations[0];
		this.blue.y = this.blue.startingPixelLocations[1];
	}
	



	for(var i =1; i<=3; i++){
		var redHeart = new Heart(this, this.red.startingPixelLocations[0], this.red.startingPixelLocations[1], 'red', i);
		redHeart.animation.add('blink',[84,17],.2,true);
		redHeart.animation.play('blink');
		this.redHeartsGroup.addChild(redHeart);
		
		if(this.numPlayers == 2){
			var blueHeart = new Heart(this, this.blue.startingPixelLocations[0], this.blue.startingPixelLocations[1], 'blue', i);
			blueHeart.animation.add('blink',[56,17],.2,true);
			blueHeart.animation.play('blink');
			this.blueHeartsGroup.addChild(blueHeart);
		}
	}


	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'+this.currentLevel],-this.bps,-this.bps);

	this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this,'level_tilemap'+this.currentLevel, this.textures.sprites);
	
	
	this.groundBlocks = this.getGroundBlocks(blockArrays[0],blockArrays[4]);
	this.originalGroundBlocks = this.getGroundBlocks(blockArrays[0],blockArrays[4]);
	this.ladderBlocks = this.getLadderBlocks(blockArrays[1],blockArrays[4]);
	this.firstLadderBlocks = this.getFirstLadderBlocks(this.ladderBlocks);

	this.topLadderBlocks = this.getTopBlocks(this.ladderBlocks);

	this.originalLeftBlockedBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	this.getBlockedBlocks(this.originalGroundBlocks,'leftghoul',this.originalLeftBlockedBlocks);
	this.originalRightBlockedBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	this.getBlockedBlocks(this.originalGroundBlocks,'rightghoul', this.originalRightBlockedBlocks);
	
	this.leftBlockedBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	this.rightBlockedBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	this.topGroundBlocks = this.getTopBlocks(this.groundBlocks);

	this.updateTopGroundBlocks();
	this.updateBlockedBlocks();
	
	this.ghoulBlocks = this.getGhoulBlocks();


	this.removeBackgroundImages();


	this.ghouliath = new Ghouliath(this, 100, 100, 'right');
	this.ghouliath.animation.add('moveleft',[0,1,2,3,4,5,6,7,8,9],0.12,true);
	this.ghouliath.animation.add('moveright',[10,11,12,13,14,15,16,17,18,19],0.12,true);
	this.ghouliath.animation.play('moveright');
	this.ghouliath.facing = 'right';


	this.addChild(this.background);
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.cracksGroup);	
	this.addChild(this.hiddenBlockGroup);	
	this.addChild(this.tilemap.layers[1]);
	this.addChild(this.tilemap.layers[2]);

	this.addChild(this.coinGroup);
	this.addChild(this.ghoulGroup);
	this.addChild(this.banditGroup);

	//this.addChild(this.ghouliath);

	this.addChild(this.tilemap.layers[5]);

	this.addChild(this.bombGroup);

	this.addChild(this.redHeartsGroup);
	if(this.numPlayers == 2){
		this.addChild(this.blueHeartsGroup);
	}	
	this.addChild(this.digitGroup);
	this.addChild(this.bombIconGroup);

	
	this.timer = this.game.time.clock.createTimer('levelOver',10,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.levelOver,this);

	this.showingLevelScreen = false;
}

gameState.onKeyDownCallback = function(keyCode){
	if(this.numPlayers == 2){
		if(keyCode == this.red.fireKey.keyCode || keyCode == this.blue.fireKey.keyCode){
			this.gunSound.play('start',true);
		}
	}else{
		if(keyCode == this.red.fireKey.keyCode){
			this.gunSound.play('start',true);
		}		
	}
}

gameState.updateBlockedBlocks = function(){
	this.getBlockedBlocks(this.groundBlocks,'left',this.leftBlockedBlocks);
	this.getBlockedBlocks(this.groundBlocks,'right',this.rightBlockedBlocks);
}

gameState.checkBombCollision = function(){
	var bombs = this.bombGroup.members;
	var bandits = this.banditGroup.members; 
	
	for (var i = 0; i <bombs.length; i++){
		for (var j = 0; j<bandits.length; j++){
			if(bombs[i].timerStarted == false){
				var bombBox = bombs[i].box.hitbox;
				if(bandits[j].box.bounds.intersects(bombBox)){
					if(bandits[j].bombsCollected < 3){
						bandits[j].bombsCollected ++;
						bandits[j].bombs.push(bombs[i]);

						bombs[i].hide();
						this.updateBombCounter(bandits[j]);
					}
				}
			}
		}
	}
}

gameState.checkCoinCollision = function(){
	var coins = this.coinGroup.members;
	var bandits = this.banditGroup.members;

	for (var i = 0; i <coins.length; i++){
		for (var j = 0; j<bandits.length; j++){
			var coinBox = coins[i].box.hitbox;
			if(bandits[j].box.bounds.intersects(coinBox)){
				if(coins[i].animation.currentAnimation.name == 'shine'){
					bandits[j].coinsCollected += 10;
					this.diamondSound.play('start',true);
				}else{
					bandits[j].coinsCollected ++;
					this.coinSound.play('start',true);
				}
				this.updateCoinCounter(bandits[j]);
				coins[i].destroy();
			}
		}
	}
}

gameState.updateBombCounter = function(bandit){
	var numBombs = bandit.bombsCollected;
	var bombIcons = bandit.bombIconGroup.members;
	switch(numBombs){
		case 0:
			for (var i =0; i<bombIcons.length; i++){
				var bombIcon = bombIcons[i];
				if(bombIcon.color == bandit.color){
					bombIcon.x = -2*this.bps;
				}
			}
			break;
		case 1:
			for (var i =0; i<bombIcons.length; i++){
				var bombIcon = bombIcons[i];
				if(bombIcon.color == bandit.color){	
					if(bombIcon.index == 7)
						bombIcon.x = bombIcon.originalx;
					else
						bombIcon.x = -2*this.bps;
				}
			}		
			break;
		case 2:
			for (var i =0; i<bombIcons.length; i++){
				var bombIcon = bombIcons[i];
				if(bombIcon.color == bandit.color){
					if(bombIcon.index <9)
						bombIcon.x = bombIcon.originalx;
					else
						bombIcon.x = -2*this.bps;
				}
			}
			break;
		case 3:
			for (var i =0; i<bombIcons.length; i++){
				var bombIcon = bombIcons[i];
				if(bombIcon.color == bandit.color){
					if(bombIcon.index <10)
						bombIcon.x = bombIcon.originalx;
					else
						bombIcon.x = -2*this.bps;
				}
			}	
			break;				
	}
}

gameState.updateCoinCounter = function(bandit){
	var ones = bandit.coinsCollected % 10; 
	var tens = Math.floor(bandit.coinsCollected / 10) % 10;
	var huns = Math.floor(bandit.coinsCollected / 100) % 10;
	digits = this.digitGroup.members;
	for(var i =0; i<digits.length; i++){
		if(digits[i].color == bandit.color){
			if(digits[i].index == 1){
				digits[i].animation.play(ones.toString());
			}else if (digits[i].index == 2){
				digits[i].animation.play(tens.toString());
			}else if(digits[i].index == 3){
				digits[i].animation.play(huns.toString());
			}
		}
	}
}

gameState.checkGhoulCollision = function(){
	var ghouls = this.ghoulGroup.members;
	var bandits = this.banditGroup.members;

	for (var i = 0; i<ghouls.length; i++){
		for (var j = 0; j<bandits.length; j++){		
			var ghoulBox = ghouls[i].box.hitbox;
			if(bandits[j].box.hitbox.intersects(ghoulBox)){
				if(bandits[j].isAlive){
					this.banditDeathSound.play('start',false);
					bandits[j].isAlive = false;
				}
			}
		}
	}
}

gameState.showHearts = function(color){
	switch(color){
		case 'red':
			var heartsGroup = this.redHeartsGroup;
			var numberOfHearts = this.red.numberOfHearts;
			break;
		case 'blue':
			var heartsGroup = this.blueHeartsGroup;
			var numberOfHearts = this.blue.numberOfHearts;
			break;
	}

	var hearts = heartsGroup.members;
	for(var i = 0; i< hearts.length; i++){
		hearts[i].disappear();
		if(i<numberOfHearts){
			hearts[i].shouldBeGone = false;
			hearts[i].timerStarted = false;
		}
	}
}

//code below to build map logic
gameState.make2DArray = function(rows, cols){
	var zero2DArray = [];
	for(var i = 0; i<rows; i++){
		var newRow = [];
		for(var j = 0; j<cols; j++){
			newRow.push(0);
		}
		zero2DArray.push(newRow);

	}
	return zero2DArray;
}

gameState.empty2Darray = function(nonzero2DArray){
	for (var i = 0; i < nonzero2DArray.length; i++){
		for(var j = 0; j<nonzero2DArray[i].length; j++){
			nonzero2DArray[i][j] = 0;
		}
	}
	return nonzero2DArray;
}

gameState.getGhoulBlocks = function(){
	var ghoulBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	console.log('getting ghoul blocks');
	for (var i = 0; i<this.GRID_ROWS; i++){
		for (var j = 0; j<this.GRID_COLS; j++){
			var ghoulCode = 1; 
			if(this.topGroundBlocks[i][j]==1){
				if(this.originalRightBlockedBlocks[i][j] == 0){
					ghoulCode *= 2;
				}
				if(this.originalLeftBlockedBlocks[i][j] == 0){
					ghoulCode *= 3;
				}
			}
			if(this.ladderBlocks[i][j] == 1){
				ghoulCode *= 5;
				if(this.firstLadderBlocks[i][j] == 0){
					ghoulCode *=7;
				}
			}
			if(this.topLadderBlocks[i][j] == 1){
				ghoulCode *= 7;
			}

			ghoulBlocks[i][j] = ghoulCode; 
		}
	}
	return ghoulBlocks;
}

/**
* getGroundBlocks returns a 2d array containing a 1 where there is a ground block and 0 otherwise. 
*/

gameState.getGroundBlocks = function(groundLayerArray, width){
	var groundBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	for (var i = 0; i<groundLayerArray.length; i++){
		if(groundLayerArray[i] != 0){
			groundBlocks[this.getRow(i,width)][this.getCol(i,width)] = 1;
		}
	}
	return groundBlocks;	
}

gameState.getLadderBlocks = function(ladderLayerArray, width){
	var ladderBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	for (var i = 0; i <ladderLayerArray.length; i++){
		if(ladderLayerArray[i] != 0){
			ladderBlocks[this.getRow(i,width)][this.getCol(i,width)] = 1;
		}
	}
	return ladderBlocks;
}


gameState.getTopBlocks = function(blocks){
	var topBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	for (var i = 0; i<this.GRID_ROWS-1; i++){
		var thisRow = blocks[i];
		var nextRow = blocks[i+1];
		for(var j = 0; j<this.GRID_COLS; j++){
			if(thisRow[j] == 0 && nextRow[j]==1){
				topBlocks[i][j] = 1; 
			}
		}
	}	

	return topBlocks;
}

gameState.updateTopGroundBlocks = function(){
	
	for (var i = 0; i<this.GRID_ROWS-1; i++){
		var thisRow = this.groundBlocks[i];
		var nextRow = this.groundBlocks[i+1];
		for(var j = 0; j<this.GRID_COLS; j++){
			if(thisRow[j] == 0 && nextRow[j]==1){
				this.topGroundBlocks[i][j] = 1; 
			}else{
				this.topGroundBlocks[i][j] = 0;
			}
		}
	}	
}


gameState.getBlockedBlocks = function(groundBlocks, direction, blockedBlocks){
	switch (direction){
		case 'left': 
			for(var i =0;i<this.GRID_ROWS; i++){
				for(var j=0; j<this.GRID_COLS; j++){
					if(j==0){
						blockedBlocks[i][j] = 1;
					}else{
						if(groundBlocks[i][j] ==0 && groundBlocks[i][j-1] == 1){
							blockedBlocks[i][j] = 1;
						}else{
							blockedBlocks[i][j] = 0; 
						}
					}
				}
			}
			break;
		case 'right':
			for(var i =0; i<this.GRID_ROWS; i++){
				for(var j=0; j<this.GRID_COLS; j++){
					if(j==this.GRID_COLS-1){
						blockedBlocks[i][j] = 1;
					}else{
						if(groundBlocks[i][j]==0 && groundBlocks[i][j+1] == 1){
							blockedBlocks[i][j] = 1;
						}else{
							blockedBlocks[i][j] = 0;
						}
					}
				}
			}
			break;
		case 'leftghoul':
			for(var i =0; i<this.GRID_ROWS; i++){
				for(var j=0; j<this.GRID_COLS; j++){
					if(j==0){
						blockedBlocks[i][j] = 1;
					}else{
						if(groundBlocks[i][j] == 0){
							if(groundBlocks[i][j-1] == 1){
								blockedBlocks[i][j] = 1;
							}else{
								if(i+1<this.GRID_ROWS && groundBlocks[i+1][j-1] == 0){
									blockedBlocks[i][j] = 1; 
								}else{
									blockedBlocks[i][j] = 0;
								}
							}
						}
					}
				}
			}			
			break;

		case 'rightghoul':
			for(var i =0; i<this.GRID_ROWS; i++){
				for(var j=0; j<this.GRID_COLS; j++){
					if(j==this.GRID_COLS-1){
						blockedBlocks[i][j] = 1;
					}else{
						if(groundBlocks[i][j]==0){
							if(groundBlocks[i][j+1] == 1){
								blockedBlocks[i][j] = 1;
							}else{
								if(i+1<this.GRID_ROWS && groundBlocks[i+1][j+1] == 0){
									blockedBlocks[i][j] = 1;
								}else{
									blockedBlocks[i][j] = 0;
								}
							}
						}
					}					
				}
			}
			break;
	}
}


gameState.getFirstLadderBlocks = function(ladderBlocks){
	var firstLadderBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);

	for(var i = 0; i<this.GRID_ROWS-1; i++){
		for(var j= 0; j<this.GRID_COLS; j++){
			if(ladderBlocks[i][j] == 1 && ladderBlocks[i+1][j] == 0){
				firstLadderBlocks[i][j] = 1;
			}
		}
	}
	for (var j=0; j<this.GRID_COLS; j++){
		if(ladderBlocks[this.GRID_ROWS-1][j] == 1){
			firstLadderBlocks[this.GRID_ROWS-1][j] = 1;
		}
	}

	return firstLadderBlocks;
}


gameState.parseBlocks = function(level_tilemap){
	var json = JSON.parse(this.game.fileStore.getFile(level_tilemap).data);
	var groundLayerArray = json.layers[0].data;
	var ladderLayerArray = json.layers[1].data;
	var backObjectsLayerArray = json.layers[2].data;
	var ghoulsLayerArray = json.layers[3].data;
	var coinsLayerArray = json.layers[4].data;
	var frontObjectsLayerArray = json.layers[5].data;
	var bombsLayerArray = json.layers[6].data;
	var width = json.width;
	var tileWidth = json.tilewidth;

	return [groundLayerArray, ladderLayerArray, coinsLayerArray, tileWidth, width, ghoulsLayerArray, backObjectsLayerArray, frontObjectsLayerArray, bombsLayerArray];
}

gameState.getPixelPositionFromArrayIndex = function(index, tileWidth, width){
	var row = this.getRow(index,width);
	var col = this.getCol(index,width);
	return [(col)*tileWidth, (row)*tileWidth];
}

gameState.getPixelPositionFromRowCol = function(row, col){
	return [(col)*this.bps, (row)*this.bps];
}

gameState.getRow = function(index,width){
	return Math.floor(index/width);
}

gameState.getCol = function(index,width){
	return index%width;
}

gameState.getGridPosition = function(x,y,cardinal){
	switch (cardinal){
		case 'north':
			return [Math.floor((y-3)/this.bps), Math.floor((x+this.bps/2)/this.bps)];
		case 'south':
			return [Math.floor((y+this.bps-1)/this.bps), Math.floor((x+this.bps/2)/this.bps)];
		case 'east':
			return [Math.floor((y+this.bps-1)/this.bps), Math.floor((x+this.bps)/this.bps)];
		case 'west':
			return [Math.floor((y+this.bps-1)/this.bps), Math.floor((x+1)/this.bps)];
		case 'middle':
			return [Math.floor((y+this.bps/2)/this.bps), Math.floor((x+this.bps/2)/this.bps)];
		default: 
			return [Math.floor(y/this.bps), Math.floor(x/this.bps)];
	}
	return 0;
}

gameState.onBlockType = function(blocks, gridPosition){
	if(gridPosition[0]<this.GRID_ROWS && gridPosition[0]>=0 && gridPosition[1]<this.GRID_COLS && gridPosition[1]>=0){
		if(blocks[gridPosition[0]][gridPosition[1]] == 1)
			return true;
		else
			return false;
	}else{
		return false;
	}
}
 
gameState.getPixelNumberForGridPosition = function(gridPosition, cardinal){
	switch (cardinal){
		case 'north':
			return gridPosition[0]*this.bps; 
		case 'south':
			return (gridPosition[0]+1)*this.bps - 1;
		case 'west':
			return gridPosition[1]*this.bps;
		case 'east':
			return (gridPosition[1]+1)*this.bps - 1;
	}
}

gameState.getBlastedBlockPosition = function(gridPosition, facing, groundBlocks){
	var firedPosition = [21, 21];
	switch(facing){
		case 'left':
			if(gridPosition[1]-1>=0 && gridPosition[0]+1<16){
				firedPosition[0] = gridPosition[0]+1;
				firedPosition[1] = gridPosition[1]-1;
			}
			break;
		case 'right':
			if(gridPosition[1]+1<20 && gridPosition[0]+1<16){
				firedPosition[0] = gridPosition[0]+1;
				firedPosition[1] = gridPosition[1]+1;
			}
			break;
	}
	return firedPosition;
}

gameState.levelOver = function(){
	if(this.gameIsOver){
		this.game.states.switchState('titleState');
	}else{
		this.currentLevel += 1;
		if(this.currentLevel > this.numberOfLevels+1){
			this.game.states.switchState('titleState');
		}else if(this.currentLevel > this.numberOfLevels){
			this.addChild(this.winScreen);
		}else{
			this.destroyAllMembersOfGroup('ghoul');
			this.destroyAllMembersOfGroup('coin');
			this.destroyAllMembersOfGroup('bomb');
			this.destroyAllMembersOfGroup('hiddenBlock');
			this.destroyAllMembersOfGroup('cracks');
			this.removeBackgroundImages();
			this.showLevelScreen();
		}
	}
}

gameState.removeBackgroundImages = function(){
	var members = this.members;
	for(var i = 0; i<members.length; i++){
		if(members[i].objType()!='Group')
			members[i].destroy();
	}
}

gameState.destroyAllMembersOfGroup = function(group){
	switch(group){
		case 'ghoul':
			var members = this.ghoulGroup.members;
			break;
		case 'coin':
			var members = this.coinGroup.members;
			break;
		case 'bomb':
			var members = this.bombGroup.members;
			break;
		case 'hiddenBlock':
			var members = this.hiddenBlockGroup.members;
			console.log(members);
		case 'cracks':
			var members = this.cracksGroup.members;	
			break;
	}
	for (var i =0; i<members.length; i++){
		members[i].destroy();
	}
}

gameState.isLevelOver = function(){
	if(this.coinGroup.members.length==0){	
		this.timer.start();
	}else if(!this.blue && !this.red){
		this.timer.start();
	}
}

gameState.isGameOver = function(){
	var bandits = this.banditGroup.members;
	this.gameIsOver = true;
	for(var i = 0; i < bandits.length; i++){
		if(bandits[i].numberOfHearts > 0){
			this.gameIsOver = false;
		}
	}
	if(this.gameIsOver){
		this.addChild(this.loseScreen);
	}
}

gameState.getArrayIndexFromRowCol = function(row, col){
	return (row)*this.GRID_COLS + col + (this.GRID_COLS+1) + (row+1);
}

gameState.blastBlock = function(blastedBlockPosition){
	console.log('blast block ' + blastedBlockPosition[0] + ' ' +blastedBlockPosition[1]);
	var hiddenBlocks = this.hiddenBlockGroup.members;
	var alreadyExists = false;
	var wasAGroundBlock = this.onBlockType(this.groundBlocks, blastedBlockPosition);
	for (var i = 0; i<hiddenBlocks.length; i++){
		var hiddenBlock = hiddenBlocks[i];
		if(hiddenBlock.row == blastedBlockPosition[0] && hiddenBlock.col == blastedBlockPosition[1]){
			alreadyExists = true;
		}
	}
	
	if(!alreadyExists && wasAGroundBlock){
		var pixels = this.getPixelPositionFromRowCol(blastedBlockPosition[0],blastedBlockPosition[1]);
		var hiddenBlock = new HiddenBlock(this, pixels[0],pixels[1]);
		hiddenBlock.animation.add('hide',[this.getArrayIndexFromRowCol(blastedBlockPosition[0],blastedBlockPosition[1])],0.1,false);
		hiddenBlock.animation.play('hide');
		this.hiddenBlockGroup.addChild(hiddenBlock);
		this.removeFromGroundBlocks(blastedBlockPosition);
		this.updateTopGroundBlocks();
		this.updateBlockedBlocks();
	}
}

gameState.addToBlocks = function(row, col, blocks){
	blocks[row][col] = 1;
}

gameState.removeFromGroundBlocks = function(blastedBlockPosition){
	this.groundBlocks[blastedBlockPosition[0]][blastedBlockPosition[1]] = 0;
}

gameState.onGunShotCallback = function(){
	this.gunSound.play('start',true);
}

gameState.update = function(){
	Kiwi.State.prototype.update.call(this);

	if(this.showingLevelScreen == false){
		this.checkCoinCollision();
		this.checkGhoulCollision();
		this.checkBombCollision();
		this.isLevelOver();
		this.isGameOver();

		if(this.debugKey.isDown){
			console.log(this.kingGhoul);
			this.kingGhoul.animation.play('laugh');
		}

		if(this.mouse.isDown){
			this.levelOver();
			this.game.input.mouse.reset();
		}
	}	
}