var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

	this.BLOCK_PIXEL_SIZE = 50; 
	this.bps = this.BLOCK_PIXEL_SIZE; 
	this.MULTIPLIER = 1; 

	this.addSpriteSheet('sprites','bandit_spritesheet.png',this.bps,this.bps);
	this.currentLevel = 1; 
	this.numberOfLevels = 14;

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('level'+i,'level'+i+'_screen.png',true);
	}		

	for (var i = 1; i<=this.numberOfLevels; i++){
		this.addImage('background'+i,'canvas'+i+'.png',true);
		this.addSpriteSheet('backgroundSpriteSheet'+i,'canvas'+i+'.png',this.bps,this.bps);
		this.addJSON('level_tilemap'+i,'level'+i+'.json');		
	}

	this.addSpriteSheet('digits','digits.png',18*this.MULTIPLIER,18*this.MULTIPLIER);	
	this.addImage('lose','gameover.png');
	this.addImage('win','bandit_win.png');

}


gameState.onDownCallback = function(x, y, timeDown, timeUp, duration, pointer){
	if(x<1080){
		this.redDownTouch = [x, y, pointer];
	}else{
		this.blueDownTouch = [x, y, pointer];
	}
}

gameState.onUpCallback = function(x, y, timeDown, timeUp, duration, pointer){

	if(x<1080){
		var dx = x - this.redDownTouch[0];
		var dy = y - this.redDownTouch[1];
		if(Math.abs(dx)>Math.abs(dy)){
			if(dx<0){
				this.redMovingDirection = 'left';
			}else{
				this.redMovingDirection = 'right';
			}
		}else{
			console.log('up/down');
			if(dy<0){
				this.redMovingDirection = 'up';
			}else{
				this.redMovingDirection = 'down';
			}
		}
		console.log('moving direction ' + this.blueMovingDirection);
	}else{
		var dx = x - this.blueDownTouch[0];
		var dy = y - this.blueDownTouch[1];
		if(Math.abs(dx)>Math.abs(dy)){
			if(dx<0){
				this.blueMovingDirection = 'left';
			}else{
				this.blueMovingDirection = 'right';
			}
		}else{
			console.log('up/down');
			if(dy<0){
				this.blueMovingDirection = 'up';
			}else{
				this.blueMovingDirection = 'down';
			}
		}
		console.log('moving direction ' + this.blueMovingDirection);		
	}

	
	
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

	this.blueCoinsCollected = 0;
	this.redCoinsCollected = 0;

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
			if(bombsLayerArray[i] == 69)
				this.permBlocks[this.getRow(i, width)][this.getCol(i,width)] = 1;
		}
	}

	this.blueBombsCollected = 0;
	this.redBombsCollected = 0;

	this.redBombs = [];
	this.blueBombs = [];



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
					}
				}
			}
		}
	}

	this.blueStartingPixelLocations = [0,0];
	this.redStartingPixelLocations = [0,0];
	for(var i = 0; i<ghoulsLayerArray.length; i++){
		if(ghoulsLayerArray[i] == 19){
			this.blueStartingPixelLocations = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
		}
		if(ghoulsLayerArray[i] == 1){
			this.redStartingPixelLocations = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
		}
	}

	this.blue.x = this.blueStartingPixelLocations[0];
	this.blue.y = this.blueStartingPixelLocations[1];

	this.red.x = this.redStartingPixelLocations[0];
	this.red.y = this.redStartingPixelLocations[1];


	for(var i =1; i<=3; i++){
		var redHeart = new Heart(this, this.redStartingPixelLocations[0], this.redStartingPixelLocations[1], 'red', i);
		var blueHeart = new Heart(this, this.blueStartingPixelLocations[0], this.blueStartingPixelLocations[1], 'blue', i);

		redHeart.animation.add('blink',[84,17],.2,true);
		blueHeart.animation.add('blink',[56,17],.2,true);
		redHeart.animation.play('blink');
		blueHeart.animation.play('blink');

		this.redHeartsGroup.addChild(redHeart);
		this.blueHeartsGroup.addChild(blueHeart);
	}
	
	this.blueNumberOfHearts = 3;
	this.redNumberOfHearts = 3;

	this.blueDeathCount = 0;
	this.redDeathCount = 0;

	this.blueIsAlive = true;
	this.redIsAlive = true;


	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'+this.currentLevel],-this.TILE_WIDTH,-this.TILE_WIDTH);

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

	this.permBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);

	this.removeBackgroundImages();

	this.addChild(this.background);
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.hiddenBlockGroup);	
	this.addChild(this.tilemap.layers[1]);
	this.addChild(this.tilemap.layers[2]);
	
	this.addChild(this.coinGroup);
	this.addChild(this.ghoulGroup);
	this.addChild(this.banditGroup);

	this.addChild(this.tilemap.layers[5]);

	this.addChild(this.bombGroup);

	this.addChild(this.redHeartsGroup);
	this.addChild(this.blueHeartsGroup);	
	this.addChild(this.digitGroup);
	this.addChild(this.bombIconGroup);
		
	this.updateCoinCounter('red');
	this.updateCoinCounter('blue'); 
	
	this.timer = this.game.time.clock.createTimer('levelOver',10,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.levelOver,this);

	this.showingLevelScreen = false;
}

gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.STAGE_WIDTH = 1024;
	this.STAGE_HEIGHT = 768;

	this.TILE_WIDTH = 50;

	this.STAGE_Y_OFFSET = 32 * this.MULTIPLIER;
	this.STAGE_X_OFFSET = 38 * this.MULTIPLIER;

	this.x = this.TILE_WIDTH - this.STAGE_X_OFFSET;
	this.y = this.TILE_WIDTH - this.STAGE_Y_OFFSET;

	this.GRID_ROWS = 15;
	this.GRID_COLS = 20;	

	myGame.stage.color = '000000';
	myGame.stage.resize(this.STAGE_WIDTH, this.STAGE_HEIGHT);

	this.winScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['win'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);
	this.loseScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['lose'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);


	this.game.input.onUp.add(this.onUpCallback, this);
	this.game.input.onDown.add(this.onDownCallback, this);


	this.digitGroup = new Kiwi.Group(this);
	this.bombIconGroup = new Kiwi.Group(this);

	for (var i = 0; i<4; i++){
		var digit = new Digit(this, 10+(i*18),-18,'red', 4-i);
		digit.animation.play('0');
		this.digitGroup.addChild(digit);
	}
	for (var i = 0; i<4; i++){
		var digit = new Digit(this, 920+(i*18),-18,'blue', 4-i);
		digit.animation.play('0');
		this.digitGroup.addChild(digit);
	}
	for (var i = 0; i<3; i++){
		var bomb = new Digit(this, 10+((4+i)*18),-18,'red', i+7);
		bomb.animation.play('bomb');
		this.bombIconGroup.addChild(bomb);
	}
	for (var i = 0; i<3; i++){
		var bomb = new Digit(this, 920-(18*(i+1)),-18,'blue', i+7);
		bomb.animation.play('bomb');
		this.bombIconGroup.addChild(bomb);
	}

	for(var i = 0; i <this.bombIconGroup.members.length; i++){
		this.bombIconGroup.members[i].x = -2*this.bps;
	}


	this.BANDIT_HITBOX_X_PERCENTAGE = .2;
	this.BANDIT_HITBOX_Y_PERCENTAGE = .1;

	this.COIN_HITBOX_X_PERCENTAGE = .46;
	this.COIN_HITBOX_Y_PERCENTAGE = .46;

	this.BOMB_HITBOX_X_PERCENTAGE = .33;
	this.BOMB_HITBOX_Y_PERCENTAGE = .33;	



	this.banditGroup = new Kiwi.Group(this);
	
	this.blue = new Bandit(this,-(this.bps),-(this.bps),'blue');

	this.blue_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.blue_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.blue_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
	this.blue_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
	this.blue_fireKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);

	this.blue.animation.play('idleleft');

	this.red = new Bandit(this,-(this.bps),-(this.bps),'red');

	this.red_leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
	this.red_rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
	this.red_upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
	this.red_downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
	this.red_fireKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

	this.game.input.keyboard.onKeyDown.add(this.onKeyDownCallback, this);

	this.red.animation.play('idleleft');


	this.debugKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.I);

	this.banditGroup.addChild(this.red);
	this.banditGroup.addChild(this.blue);

	this.coinGroup = new Kiwi.Group(this);
	this.bombGroup = new Kiwi.Group(this);
	this.ghoulGroup = new Kiwi.Group(this);
	this.blueHeartsGroup = new Kiwi.Group(this);
	this.redHeartsGroup = new Kiwi.Group(this);

	this.hiddenBlockGroup = new Kiwi.Group(this);

	this.random = new Kiwi.Utils.RandomDataGenerator();


	this.showLevelScreen();
	
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
					bandits[j].bombsCollected ++;
					bandits[j].bombs.push(bombs[i]);

					bombs[i].hide();
					this.updateBombCounter(bandits[j]);
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
				if(j == 0){
					if(coins[i].animation.currentAnimation.name == 'shine'){
						this.redCoinsCollected += 10;
					}else{
						this.redCoinsCollected ++;
					}
					this.updateCoinCounter('red');		
				}else{
					if(coins[i].animation.currentAnimation.name == 'shine'){
						this.blueCoinsCollected += 10;
					}else{
						this.blueCoinsCollected ++;
					}
					this.updateCoinCounter('blue');
				}
				coins[i].destroy();
				this.coinSound.play('start',true);
			}
		}
	}
}

gameState.updateBombCounter = function(bandit){
	var numBombs = bandit.bombsCollected;
	var bombIcons = bandit.bombIconGroup.members;
	console.log(numBombs);
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
		case 2:
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
gameState.updateCoinCounter = function(color){
	switch(color){
		case 'red':
			var ones = this.redCoinsCollected % 10; 
			var tens = Math.floor(this.redCoinsCollected / 10) % 10;
			var huns = Math.floor(this.redCoinsCollected / 100) % 10;
			digits = this.digitGroup.members;
			for(var i =0; i<digits.length; i++){
				if(digits[i].color == 'red'){
					if(digits[i].index == 1){
						digits[i].animation.play(ones.toString());
					}else {
						if(digits[i].index == 2){
							digits[i].animation.play(tens.toString());
						}else{
							if(digits[i].index == 3){
								digits[i].animation.play(huns.toString());
							}
						}
					}
				}
			}
			break;
		case 'blue':
			var ones = this.blueCoinsCollected % 10; 
			var tens = Math.floor(this.blueCoinsCollected / 10) % 10;
			var huns = Math.floor(this.blueCoinsCollected / 100) % 10;
			digits = this.digitGroup.members;
			for(var i =0; i<digits.length; i++){
				if(digits[i].color == 'blue'){
					if(digits[i].index == 1){
						digits[i].animation.play(ones.toString());
					}else {
						if(digits[i].index == 2){
							digits[i].animation.play(tens.toString());
						}else{
							if(digits[i].index == 3){
								digits[i].animation.play(huns.toString());
							}
						}
					}
				}
			}		
			break;
	}

}

gameState.checkGhoulCollision = function(){
	var ghouls = this.ghoulGroup.members;
	var bandits = this.banditGroup.members;

	for (var i = 0; i<ghouls.length; i++){
		for (var j = 0; j<bandits.length; j++){		
			var ghoulBox = ghouls[i].box.hitbox;
			if(bandits[j].box.hitbox.intersects(ghoulBox)){
				console.log('DEATH');
				if(j==0){
					this.redIsAlive = false;
				}else{
					this.blueIsAlive = false;
				}
			}
		}
	}
}

gameState.deathCount = function(bandit){
	switch(bandit){
		case 'red':
			if(this.redDeathCount<100){
				if(this.redDeathCount==1){
					var hearts = this.redHeartsGroup.members;
					for(var i = 0; i<hearts.length; i++){
						hearts[i].disappear();
					}
				}
				this.redDeathCount++;
				this.red.animation.play('die');
			}else{
				this.redNumberOfHearts -= 1;
				if(this.redNumberOfHearts>0){
					this.red.x = this.redStartingPixelLocations[0];
					this.red.y = this.redStartingPixelLocations[1];
					this.redIsAlive = true;
					this.showHearts('red');
					this.redDeathCount = 0;			
				}	
			}
			break;
		case 'blue':	
			if(this.blueDeathCount<100){
				if(this.blueDeathCount==1){
					var hearts = this.blueHeartsGroup.members;
					for(var i = 0; i<hearts.length; i++){
						hearts[i].disappear();
					}					
				}
				this.blueDeathCount ++;
				this.blue.animation.play('die');
			}else{
				this.blueNumberOfHearts -= 1;
				if(this.blueNumberOfHearts>0){
					this.blue.x = this.blueStartingPixelLocations[0];
					this.blue.y = this.blueStartingPixelLocations[1];
					this.blueIsAlive = true;
					this.showHearts('blue');				
					this.blueDeathCount = 0;
				}	
			}
			break;	
	}
}

gameState.showHearts = function(bandit){
	switch(bandit){
		case 'red':
			var redHearts = this.redHeartsGroup.members;
			for(var i = 0; i< redHearts.length; i++){
				redHearts[i].disappear();
				if(i<this.redNumberOfHearts){
					redHearts[i].shouldBeGone = false;
					redHearts[i].timerStarted = false;
				}
			}
			break;
		case 'blue':
			console.log(this.blueHeartsGroup);
			var blueHearts = this.blueHeartsGroup.members;
			for(var i = 0; i< blueHearts.length; i++){
				blueHearts[i].disappear();
				if(i<this.blueNumberOfHearts){
					blueHearts[i].shouldBeGone = false;
					blueHearts[i].timerStarted = false;
				}
			}	
			break;
	}
}

var Heart = function(state, banditX, banditY, bandit, number){
	this.banditX = banditX;
	this.banditY = banditY;
	var y = banditY - 35;
	var x = null;
	switch(number){
		case 1: 
			x = banditX - 15;
			break;
	    case 2:
	    	x = banditX;
	    	break;
	    case 3:
	    	x = banditX + 15;
	    	break; 
	}
	
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state;
	this.bandit = bandit;
	this.number = number;
	this.timerStarted = false;
	this.shouldBeGone = false;

	this.timer = this.state.game.time.clock.createTimer('heartTimer',3,0,false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.disappear, this);

	Heart.prototype.update = function(){
		if(!this.shouldBeGone){
			if(this.animation.currentAnimation.name != 'blink'){
				this.animation.play('blink');
			}
			switch(this.bandit){
				case 'red':
					if(this.state.red.x != this.banditX || this.state.red.y != this.banditY){
						if(this.timerStarted == false){
							console.log('timer starting');
							this.timer.start();
						}
						this.timerStarted = true;
					}
					break;
				case 'blue':
					if(this.state.blue.x != this.banditX || this.state.blue.y != this.banditY){
						if(this.timerStarted == false){
							console.log('timer starting');
							this.timer.start();
						}
						this.timerStarted = true;
					}
					break;			
			}		

			this.showSelf();
		}
	}
}
Kiwi.extend(Heart, Kiwi.GameObjects.Sprite);

Heart.prototype.disappear = function(){
	this.x = 4000;
	this.shouldBeGone = true;
	this.timer.stop();
}

Heart.prototype.showSelf = function(){
	var banditX = null;
	switch(this.bandit){
		case 'red':
			banditX = this.state.red.x;
			this.y = this.state.red.y - 70;
			break;

		case 'blue':
			banditX = this.state.blue.x;
			this.y = this.state.blue.y - 70;
			break;
	}
	switch (this.number){
				case 1: 
					this.x = banditX -30;
					break;
				case 2:
					this.x = banditX;
					break;
				case 3:
					this.x = banditX +30;
					break;
	}		
}

var Bandit = function(state, x, y, color){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state; 
	this.color = color; 
	this.bombsCollected = 0;
	this.bombs = [];
	this.bombClock = this.state.game.time.addClock(color+'BombClock',100);
	this.bombClock.start();
	this.bombIconGroup = this.state.bombIconGroup;

	var banditHitboxX = Math.round(this.state.bps*this.state.BANDIT_HITBOX_X_PERCENTAGE);
	var banditHitboxY = Math.round(this.state.bps*this.state.BANDIT_HITBOX_Y_PERCENTAGE);

	this.box.hitbox = new Kiwi.Geom.Rectangle(banditHitboxX, banditHitboxY, this.state.bps-2*banditHitboxX,this.state.bps-2*banditHitboxY);

	switch(color){
		case 'blue':
			this.animation.add('climb',[53,54],0.1,true);
			this.animation.add('idleleft',[33],0.1,false);
			this.animation.add('idleright',[25],0.1,false);
			this.animation.add('moveright',[19,20,21,22,23,24],0.1,true);
			this.animation.add('moveleft',[32,31,30,29,28,27],0.1,true);
			this.animation.add('fireleft',[26],0.1,false);
			this.animation.add('fireright',[18],0.1,false);
			this.animation.add('idleclimb',[53],0.1,false);
			this.animation.add('die',[55],0.1,false);
			break;
		case 'red':
			this.animation.add('climb',[81,82],0.1,true);
			this.animation.add('idleleft',[15],0.1,false);
			this.animation.add('idleright',[0],0.1,false);
			this.animation.add('moveright',[1,2,3,4,5,6],0.1,true);
			this.animation.add('moveleft',[14,13,12,11,10,9],0.1,true);
			this.animation.add('fireright',[7],0.1,false);
			this.animation.add('fireleft',[8],0.1,false);
			this.animation.add('idleclimb',[81],0.1,false);
			this.animation.add('die',[83],0.1,false);
			break;
	}

	this.facing = 'left';
	console.log(this);

	this.canShoot = true; 

}
Kiwi.extend(Bandit, Kiwi.GameObjects.Sprite);

var Bomb = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	console.log('bomb created at ' + x + ' ' + y);
	this.state = state;

	this.rowPlaced = -1;
	this.colPlaced = -1;

	this.timerStarted = false; 


	this.timer = this.state.game.time.clock.createTimer('bombTimer',3,0,false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.explode, this);

	this.timerAnimation = this.state.game.time.clock.createTimer('bombAnimation',2,0,false);
	this.timerAnimationEvent = this.timerAnimation.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.explodeAnimation, this);

}
Kiwi.extend(Bomb, Kiwi.GameObjects.Sprite);

Bomb.prototype.explode = function(){
	this.state.blastBlock([this.rowPlaced, this.colPlaced-1]); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced-2]);
	this.state.blastBlock([this.rowPlaced, this.colPlaced]);	
	this.state.blastBlock([this.rowPlaced, this.colPlaced+1]); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced+2]);
	this.state.bombSound.play();
	this.destroy();
}

Bomb.prototype.explodeAnimation = function(){
	this.animation.play('explode');
	console.log(this.animation.currentAnimation.name);
}

Bomb.prototype.startTimer = function(){
	this.timerStarted = true;
	this.timer.start();
	this.timerAnimation.start();

}

Bomb.prototype.hide = function(){
	this.x = -3*this.state.bps;
	this.y = -3*this.state.bps;
}

var Digit = function(state, x, y, color, index){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['digits'], x, y, false);
	console.log('adding digit');
	this.color = color;
	this.state = state;
	this.index = index; 
	this.originalx = x;
	this.originaly = y;

	switch(color){
		case 'blue':
			this.animation.add('0',[0],0.1,false);
			this.animation.add('1',[1],0.1,false); 
			this.animation.add('2',[2],0.1,false);
			this.animation.add('3',[3],0.1,false); 
			this.animation.add('4',[4],0.1,false);
			this.animation.add('5',[5],0.1,false); 
			this.animation.add('6',[6],0.1,false);
			this.animation.add('7',[7],0.1,false); 
			this.animation.add('8',[8],0.1,false);
			this.animation.add('9',[9],0.1,false); 	
			this.animation.add('bomb',[10],0.1,false);											
			break;
		case 'red':
			this.animation.add('0',[11],0.1,false);
			this.animation.add('1',[12],0.1,false); 
			this.animation.add('2',[13],0.1,false);
			this.animation.add('3',[14],0.1,false); 
			this.animation.add('4',[15],0.1,false);
			this.animation.add('5',[16],0.1,false); 
			this.animation.add('6',[17],0.1,false);
			this.animation.add('7',[18],0.1,false); 
			this.animation.add('8',[19],0.1,false);
			this.animation.add('9',[20],0.1,false); 	
			this.animation.add('bomb',[10],0.1,false);																									
			break;
	}

	Digit.prototype.resetCounter = function(){
		this.animation.play('0');
	}
}
Kiwi.extend(Digit, Kiwi.GameObjects.Sprite);


var HiddenBlock = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['backgroundSpriteSheet'+state.currentLevel], x, y, false);
	this.occupiedBy = []; //array of Ghouls 
	this.gridPosition = state.getGridPosition(x,y);
	this.row = this.gridPosition[0];
	this.col = this.gridPosition[1];
	console.log(this.row + ' ' + this.col) 
	this.state = state;

	this.timer = state.game.time.clock.createTimer('hiddenBlockTimer',5,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.hiddenBlockTimer, this);
	
	if(this.state.permBlocks[this.row][this.col] != 1){
		this.timer.start();
	}

	HiddenBlock.prototype.update = function(){
		if(this.occupied){
			console.log('is occupied');
			console.log(this.occupiedBy);
			this.occupied =false; 
		}
	}
}
Kiwi.extend(HiddenBlock, Kiwi.GameObjects.Sprite);

HiddenBlock.prototype.hiddenBlockTimer = function(){
	var numberOfGhouls = this.occupiedBy.length;
	for(var i =0; i < numberOfGhouls; i++){
		var ghoul = this.occupiedBy.pop();
		if(ghoul.objType() == 'BlueGhoul'){
			ghoul.teleportTimer.stop();
		}
		ghoul.destroy(false);
	}
	this.destroy();
	this.state.addToBlocks(this.row, this.col, this.state.groundBlocks);
	this.state.updateTopGroundBlocks();
	this.state.updateBlockedBlocks();

	var redGridPosition = this.state.getGridPosition(this.state.red.x, this.state.red.y, 'middle');
	var blueGridPosition = this.state.getGridPosition(this.state.blue.x, this.state.blue.y, 'middle');


	
	if(redGridPosition[0] == this.row && redGridPosition[1] == this.col){
		for(var i =0; i<101; i++){
			this.state.deathCount('red');
		}
	}
	if(blueGridPosition[0] == this.row && blueGridPosition[1] == this.col){
		for(var i=0; i<101; i++){
			this.state.deathCount('blue');
		}
	}
}

var Ghoul = function(state, x, y, facing, ghoulType){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.facing = facing; 
	this.shouldFall = false;
	this.isInHole = false;
	this.testvar = 0;
	this.state = state;
	this.shouldCheckDirection = true;
	this.ghoulType = ghoulType;

	var ghoulHitboxX = Math.round(this.state.bps*this.state.BANDIT_HITBOX_X_PERCENTAGE);
	var ghoulHitboxY = Math.round(this.state.bps*this.state.BANDIT_HITBOX_Y_PERCENTAGE);	
 
	this.box.hitbox = new Kiwi.Geom.Rectangle(ghoulHitboxX,ghoulHitboxY,this.state.bps-2*ghoulHitboxX,this.state.bps-2*ghoulHitboxY);

	console.log('creating ghoul of type ' + ghoulType);

	switch(ghoulType){
		case 'gray':
			this.animation.add('idleleft',[70],0.1,false);
			this.animation.add('idleright',[73],0.1,false);
			this.animation.add('upright',[75],0.1,false);
			this.animation.add('upleft',[72],0.1,false);
			this.animation.add('dieright',[74,75],0.1,true);
			this.animation.add('dieleft',[71,72],0.1,true);
			break;
		case 'red':
			this.animation.add('idleleft',[90],0.1,false);
			this.animation.add('idleright',[106],0.1,false);
			this.animation.add('upright',[99],0.1,false);
			this.animation.add('upleft',[102],0.1,false);
			this.animation.add('dieright',[95,106],0.1,true);
			this.animation.add('dieleft',[98,102],0.1,true);	
			this.animation.add('climb',[91,94],0.1,true);	
			break;
		case 'blue':
			this.animation.add('idleleft',[103],0.1,false);
			this.animation.add('idleright',[96],0.1,false);
			this.animation.add('upright',[104],0.1,false);
			this.animation.add('upleft',[92],0.1,false);
			this.animation.add('dieright',[100,104],0.1,true);
			this.animation.add('dieleft',[107,92],0.1,true);
			this.animation.add('disappear',[93,97,101,105,113],0.1,false);		
			this.animation.add('orb',[113],0.1,false);
			this.animation.add('reappear',[113,105,101,97,93],0.15,false);
			break;
		case 'black':
			this.animation.add('idleleft',[126],0.1,false);
			this.animation.add('idleright',[137],0.1,false);
			this.animation.add('swingleft',[126,135,136,135],0.1,true);
			this.animation.add('swingright',[137,145,146,145],0.1,true);
			this.animation.add('upright',[144],0.1,false);
			this.animation.add('dieright',[144,139],0.1,true);
			this.animation.add('dieleft',[134,128],0.1,true);
			this.animation.add('climb',[127,138],0.1,true);
			this.animation.add('disappear',[129,130,131,132,133],0.1,false);
			this.animation.add('orb',[133],0.1,false);
			this.animation.add('reappear',[133,132,131,130,129],0.1,false);

			this.animation.
			break;	
	}

	this.animation.play('idleleft');	


	this.gravity = function(){
		this.shouldCheckDirection = false;	
		var southGridPosition = state.getGridPosition(this.x, this.y, 'south');
		var inStoppingBlock = false;
		for(var i = 0; i <state.topGroundBlocks.length; i++){
			if(state.onBlockType(state.topGroundBlocks, southGridPosition)){
				inStoppingBlock = true;
			}
		}
		if(inStoppingBlock){
			var pixelNum = state.getPixelNumberForGridPosition(southGridPosition, 'south');
			if(this.y + this.state.bps <pixelNum-10){
				this.y += 10;
			}
			else{
				this.y = pixelNum-this.state.bps+1;
				this.shouldFall = false;
				var gridPosition = state.getGridPosition(this.x, this.y, 'middle');
				var ghoulCode = this.state.ghoulBlocks[gridPosition[0]][gridPosition[1]];	
				if(ghoulCode % 2 != 0 && ghoulCode % 3 != 0){
					this.isInHole = true;
					console.log('in stopping block deaht?');
					this.singleBlockDeath();
				}		
			}
		}else{
			this.y+=10;
		}
		//if fallen off bottom of the stage. 
		if(this.y > this.state.bps * this.state.GRID_ROWS){
			this.isInHole = true;
			if(this.objType() == 'BlueGhoul'){
				this.teleportTimer.stop();
			}
			this.destroy();
		}

	}

	this.inHole = function(){
		//this.animation.play('up' + this.facing);
		if(this.animation.currentAnimation.name != 'die' + this.facing){
			this.animation.play('die' + this.facing);
		}

	}

	Ghoul.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		var rightGridPosition = state.getGridPosition(this.x, this.y, 'east');
		var leftGridPosition = state.getGridPosition(this.x, this.y, 'west');
      	var topGridPosition = state.getGridPosition(this.x, this.y+15, 'north');



		if(this.isInHole){
			this.inHole();
		}else{
			this.shouldCheckDirection = (this.x % this.state.bps == 0 && this.y % this.state.bps == 0); 	

			if(this.shouldFall){
				this.gravity();
				if(!(this.y>this.state.bps*(this.state.GRID_ROWS-1))){
					switch(this.facing){
						case 'left':
							var ghoulCode = this.state.ghoulBlocks[rightGridPosition[0]][rightGridPosition[1]];
							if(ghoulCode % 3 != 0){
								this.facing = 'right';
								this.animation.play('idleright');
							}
							break;
						case 'right':
							var ghoulCode = this.state.ghoulBlocks[leftGridPosition[0]][leftGridPosition[1]];
							if(ghoulCode % 2 != 0){
								this.facing = 'left';
								this.animation.play('idleleft');
							}					
							break;
					}
				}
			}

			this.checkDirection();
			
			if(!this.shouldFall){
				switch(this.facing){
					case 'left':
						var checkForHiddenBlockPosition = [rightGridPosition[0]+1, rightGridPosition[1]];
						var hiddenBlock = null;
						for (var i = 0; i<state.hiddenBlockGroup.members.length; i++){
							hiddenBlock = state.hiddenBlockGroup.members[i];
							if(hiddenBlock.row == checkForHiddenBlockPosition[0] && hiddenBlock.col == checkForHiddenBlockPosition[1]){
								this.shouldFall = true;
							}else{
								if(hiddenBlock.row == topGridPosition[0] && hiddenBlock.col == topGridPosition[1]){
									if(this.shouldFall == false){
										this.isInHole = true;
									}
								}
							}
						}
						if(this.isInHole){
							console.log('in hole');
							hiddenBlock.occupiedBy.push(this);
						}

						break;
					case 'right':
						var checkForHiddenBlockPosition = [leftGridPosition[0]+1, leftGridPosition[1]];
						var hiddenBlock = null;
						for (var i = 0; i<state.hiddenBlockGroup.members.length; i++){
							hiddenBlock = state.hiddenBlockGroup.members[i];
							if(hiddenBlock.row == checkForHiddenBlockPosition[0] && hiddenBlock.col == checkForHiddenBlockPosition[1]){
								this.shouldFall = true;
							}else{
								if(hiddenBlock.row == topGridPosition[0] && hiddenBlock.col == topGridPosition[1]){
									if(this.shouldFall == false){
										this.isInHole = true;
									}
								}
							}
						}
						if(this.isInHole){
							console.log('in hole right');
							hiddenBlock.occupiedBy.push(this);
						}
						break;
				}
			}

			switch(this.facing){
				case 'left':
					this.x -= 1;
					if(this.animation.currentAnimation.name != 'idleleft'){
						this.animation.play('idleleft');
					}
					break;
				case 'right':
					this.x += 1;
					if(this.animation.currentAnimation.name != 'idleright'){
						this.animation.play('idleright');
					}
					break;
				case 'up':
					this.y -= 1;
					if(this.animation.currentAnimation.name != 'climb'){
						this.animation.play('climb');
					}
					break;
				case 'down':
					this.y += 1;
					if(this.animation.currentAnimation.name != 'climb'){
						this.animation.play('climb');
					}
					break;
			}

			

		}

	}
}
Kiwi.extend(Ghoul, Kiwi.GameObjects.Sprite);

Ghoul.prototype.singleBlockDeath = function(){
	this.timer = this.state.game.time.clock.createTimer('singleBlockDeathTimer',3,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.destroy, this);
	if(this.objType() == 'BlueGhoul'){
		this.teleportTimer.stop();
	}
	this.timer.start();	
}

Ghoul.prototype.checkDirection = function(){
	if(this.shouldCheckDirection){
		var gridPosition = this.state.getGridPosition(this.x, this.y);		
		var ghoulCode = this.state.ghoulBlocks[gridPosition[0]][gridPosition[1]];	

		switch(this.facing){
			case 'left':
				if(ghoulCode % 3 != 0){
					this.facing = 'right';
					this.animation.play('idleright');
				}

			break;
			case 'right':
				if(ghoulCode % 2 != 0){
					this.facing = 'left';
					this.animation.play('idleleft');
				}
			break;
		}
	}	
}

var RedGhoul = function(state, x, y, facing){
	Ghoul.call(this, state, x, y, facing, 'red');

	RedGhoul.prototype.update = function(){
		Ghoul.prototype.update.call(this);
	}
}
Kiwi.extend(RedGhoul, Ghoul);

RedGhoul.prototype.checkDirection = function(){
	if(this.shouldCheckDirection){
		var gridPosition = this.state.getGridPosition(this.x, this.y);		
		var ghoulCode = this.state.ghoulBlocks[gridPosition[0]][gridPosition[1]];	

		switch(this.facing){
			case 'left':
				var moveOptions = [];
				if(ghoulCode % 3 != 0){
					moveOptions.push('right');
				}else{
					moveOptions.push('left');
				}
				if(ghoulCode % 5 == 0){
					moveOptions.push('up');
				} 
				if(ghoulCode % 7 == 0){
					moveOptions.push('down');
				}
				this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
	
				break;
			case 'right':
				var moveOptions = [];
				if(ghoulCode % 2 != 0){
					moveOptions.push('left');
				}else{
					moveOptions.push('right');
				}
				if(ghoulCode % 5 == 0){
					moveOptions.push('up');
				} 
				if(ghoulCode % 7 == 0){
					moveOptions.push('down');
				}
				this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
				
				break;
			case 'up':
				var moveOptions = [];
				if(ghoulCode % 5 == 0){
					moveOptions.push('up');
				}
				if(ghoulCode % 2 == 0){
					moveOptions.push('right');
				} 
				if(ghoulCode % 3 == 0){
					moveOptions.push('left');
				}
				this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
				
				if(moveOptions.length == 0){
					this.facing = 'down';
				}
				
				break;
			case 'down':
				var moveOptions = [];
				if(ghoulCode % 7 == 0){
					moveOptions.push('down');
				}
				if(ghoulCode % 2 == 0){
					moveOptions.push('right');
				} 
				if(ghoulCode % 3 == 0){
					moveOptions.push('left');
				}
				this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
				
				if(moveOptions.length == 0){
					this.facing = 'up';
				}
				
				break;						

		}

	}
}


var BlueGhoul = function(state, x, y, facing){
	Ghoul.call(this, state, x, y, facing, 'blue');
	this.nextRow = 0;
	this.nextCol = 0;
	
	
	this.ghoulHitboxX = Math.round(this.state.bps*this.state.BANDIT_HITBOX_X_PERCENTAGE);
	this.ghoulHitboxY = Math.round(this.state.bps*this.state.BANDIT_HITBOX_Y_PERCENTAGE);	

	this.box.hitbox = new Kiwi.Geom.Rectangle(this.ghoulHitboxX,this.ghoulHitboxY,this.state.bps-2*this.ghoulHitboxX,this.state.bps-2*this.ghoulHitboxY);
	var randTime = this.state.random.integerInRange(10,20);
	console.log(randTime);

	this.teleportTimer = this.state.game.time.clock.createTimer('teleportTimer',randTime, -1, false);
	this.teleportTimerEvent = this.teleportTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.teleport, this);

	this.orbTimer = this.state.game.time.clock.createTimer('orbTimer',1.4,0,false);
	this.orbTimerEvent = this.orbTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.showOrb, this);
	
	this.orbTimer2 = this.state.game.time.clock.createTimer('orbTimer2',.6,0,false);
	this.orbTimerEvent2 = this.orbTimer2.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.reappearAnimation, this);

	this.reappearTimer = this.state.game.time.clock.createTimer('reappearTimer',.6,0,false);
	this.reappearTimerEvent = this.reappearTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.reappear, this);

	this.teleportTimer.start();

}
Kiwi.extend(BlueGhoul, Ghoul);

Ghoul.prototype.teleport = function(){
	if(typeof this != 'undefined'){
		this.facing = 'teleport';
		this.animation.play('disappear');

		do{
			this.nextRow = this.state.random.integerInRange(0,this.state.GRID_ROWS);
			this.nextCol = this.state.random.integerInRange(0,this.state.GRID_COLS);
		}
		while(this.state.ghoulBlocks[this.nextRow][this.nextCol] % 6 != 0);
		this.orbTimer.start();
	}
}

Ghoul.prototype.showOrb = function(){
	if(typeof this != 'undefined'){
		this.box.hitbox = new Kiwi.Geom.Rectangle(0,0,0,0);
		this.animation.play('orb');
		var pixels = this.state.getPixelPositionFromRowCol(this.nextRow, this.nextCol);
		this.x = pixels[0];
		this.y = pixels[1];		
		this.orbTimer2.start();
	}
}

Ghoul.prototype.reappearAnimation = function(){
	if(typeof this != 'undefined'){
		this.animation.play('reappear');
		this.reappearTimer.start();
	}	
}

Ghoul.prototype.reappear = function(){
	if(typeof this != 'undefined'){
		this.box.hitbox = new Kiwi.Geom.Rectangle(this.ghoulHitboxX,this.ghoulHitboxY,this.state.bps-2*this.ghoulHitboxX,this.state.bps-2*this.ghoulHitboxY);
		this.facing = 'left';
	}
}

BlueGhoul.prototype.objType = function(){
	return 'BlueGhoul';
}

var BlackGhoul = function(state, x, y, facing){
	Ghoul.call(this, state, x, y, facing, 'black');
	
	this.orbTimer = this.state.game.time.clock.createTimer('orbTimer',1.4,0,false);
	this.orbTimerEvent = this.orbTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.showOrb, this);
	
	this.orbTimer2 = this.state.game.time.clock.createTimer('orbTimer2',.6,0,false);
	this.orbTimerEvent2 = this.orbTimer2.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.reappearAnimation, this);

	this.reappearTimer = this.state.game.time.clock.createTimer('reappearTimer',.6,0,false);
	this.reappearTimerEvent = this.reappearTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.reappear, this);


}
Kiwi.extend(BlackGhoul, BlueGhoul);
Kiwi.extend(BlackGhoul, RedGhoul);

BlackGhoul.prototype.objType = function(){
	return 'BlackGhoul';
}

BlackGhoul.prototype.checkDirection = function(){
	if(this.shouldCheckDirection){
		var gridPosition = this.state.getGridPosition(this.x, this.y);		
		var ghoulCode = this.state.ghoulBlocks[gridPosition[0]][gridPosition[1]];	

		var dx = this.state.banditGroup.members[0].x - this.x;
		var dy = this.state.banditGroup.members[0].y - this.y;

		

		if(Math.abs(dx)>Math.abs(dy)){
			if(dx>0){
				var pref1 = 'right';
			}else{
				var pref1 = 'left';
			}
			if(dy>0){
				var pref2 = 'down';
			}else{
				var pref2 = 'up';
			}
		}else{
			if(dy>0){
				var pref1 = 'down';
			}else{
				var pref1 = 'up';
			}	
			if(dx>0){
				var pref2 = 'right';
			}else{
				var pref2 = 'left';
			}			
		}

		var goToPref2 = true;
		switch(pref1){
			case 'right':
				if(ghoulCode % 2 == 0){
					this.facing = 'right';
					goToPref2 = false;
				}
				break;
			case 'up':
				if(ghoulCode % 5 == 0){
					this.facing = 'up';
					goToPref2 = false;
				}	
				break;
			case 'down':
				if(ghoulCode % 7 == 0){
					this.facing = 'down';
					goToPref2 = false;
				}
				break;
			case 'left':
				if(ghoulCode % 3 == 0){
					this.facing = 'left';
					goToPref2 = false;
				}	
				break;
		}

		var goToRedChoice = true;

		if(goToPref2){
			switch(pref2){
				case 'right':
					if(ghoulCode % 2 == 0){
						this.facing = 'right';
						goToRedChoice = false;
					}
					break;
				case 'up':
					if(ghoulCode % 5 == 0){
						this.facing = 'up';
						goToRedChoice = false;
					}	
					break;
				case 'down':
					if(ghoulCode % 7 == 0){
						this.facing = 'down';
						goToRedChoice = false;
					}
					break;
				case 'left':
					if(ghoulCode % 3 == 0){
						this.facing = 'left';
						goToRedChoice = false;
					}	
					break;
			}

			if(goToRedChoice){
				switch(this.facing){
					case 'left':
						var moveOptions = [];
						if(ghoulCode % 3 != 0){
							moveOptions.push('right');
						}else{
							moveOptions.push('left');
						}
						if(ghoulCode % 5 == 0){
							moveOptions.push('up');
						} 
						if(ghoulCode % 7 == 0){
							moveOptions.push('down');
						}
						this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
			
						break;
					case 'right':
						var moveOptions = [];
						if(ghoulCode % 2 != 0){
							moveOptions.push('left');
						}else{
							moveOptions.push('right');
						}
						if(ghoulCode % 5 == 0){
							moveOptions.push('up');
						} 
						if(ghoulCode % 7 == 0){
							moveOptions.push('down');
						}
						this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
						
						break;
					case 'up':
						var moveOptions = [];
						if(ghoulCode % 5 == 0){
							moveOptions.push('up');
						}
						if(ghoulCode % 2 == 0){
							moveOptions.push('right');
						} 
						if(ghoulCode % 3 == 0){
							moveOptions.push('left');
						}
						this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
						
						if(moveOptions.length == 0){
							this.facing = 'down';
						}
						
						break;
					case 'down':
						var moveOptions = [];
						if(ghoulCode % 7 == 0){
							moveOptions.push('down');
						}
						if(ghoulCode % 2 == 0){
							moveOptions.push('right');
						} 
						if(ghoulCode % 3 == 0){
							moveOptions.push('left');
						}
						this.facing = moveOptions[this.state.random.integerInRange(0,moveOptions.length)];
						
						if(moveOptions.length == 0){
							this.facing = 'up';
						}
						
						break;						
				}

			}			
		}
						

	}
}

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
	}
	for (var i =0; i<members.length; i++){
		if(members[i].objType() == 'BlueGhoul'){
			members[i].teleportTimer.stop();
		}
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
	if(this.blueNumberOfHearts < 1 && this.redNumberOfHearts < 1){
		this.addChild(this.loseScreen);
		this.gameIsOver = true;
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
	if(this.groundBlocks[blastedBlockPosition[0]][blastedBlockPosition[1]]==1){
		this.groundBlocks[blastedBlockPosition[0]][blastedBlockPosition[1]] = 0;
	}
}

gameState.placeBomb = function(bandit){
	if(bandit.bombsCollected > 0){
		bandit.bombClock.start();
		bomb = bandit.bombs.pop();
		bomb.x = this.getPixelNumberForGridPosition(this.getGridPosition(bandit.x, bandit.y,'middle'),'west');
		bomb.y = this.getPixelNumberForGridPosition(this.getGridPosition(bandit.x, bandit.y,'middle'),'north');	
		var bombGridPosition = this.getGridPosition(bomb.x,bomb.y);
		bomb.rowPlaced = bombGridPosition[0];
		bomb.colPlaced = bombGridPosition[1]; 
		bomb.startTimer();
		bandit.bombsCollected--;
		console.log(bandit.bombsCollected);	
		this.updateBombCounter(bandit);	
	}
}


gameState.update = function(){
	Kiwi.State.prototype.update.call(this);


	if(this.showingLevelScreen == false){
		if(this.blueIsAlive){
			var blue_southGridPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y,'south');
		 	if(!(this.onBlockType(this.ladderBlocks,blue_southGridPosition) || this.onBlockType(this.groundBlocks, blue_southGridPosition))){
		 		if(this.onBlockType(this.topGroundBlocks,blue_southGridPosition)){
		 			var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'south');
		 			if(this.blue.transform.y+this.bps<pixelNum-26)
		 				this.blue.transform.y+=13;
		 			else
		 				this.blue.transform.y=pixelNum-this.bps+1;
		 		}else{
		 			if(this.blue.transform.y+this.bps<this.bps*this.GRID_ROWS-26)
		 				this.blue.transform.y+=13;
		 			else
		 				this.blue.transform.y=this.bps*this.GRID_ROWS-this.bps;
		 		}
		 	}		
		
			if(this.blueMovingDirection != 'none'){
				switch(this.blueMovingDirection){
					case 'left':
						this.blueFacing = 'left';
						if(this.onBlockType(this.leftBlockedBlocks, blue_feetPosition)){
							var pixelNum = this.getPixelNumberForGridPosition(blue_feetPosition,'west');
							if(this.blue.transform.x>pixelNum+6*2/**/){
								this.blue.transform.x-=5*2/**/;
							}else{
								this.blue.transform.x = pixelNum;
								if(this.onBlockType(this.ladderBlocks, blue_feetPosition)){
									if(this.onBlockType(this.firstLadderBlocks, this.getGridPosition(this.blue.x, this.blue.y+3*2/**/,'north'))){
										this.blue.animation.play('idle'+this.blueFacing);
									}else{
										this.blue.animation.play('idleclimb');
										console.log('playing idleclimb');
									}						
								}else{
									this.blue.animation.play('idle'+this.blueFacing);
								}
								this.blueMovingDirection = 'none';
							}
						}else{
							if(!this.onBlockType(this.groundBlocks, blue_feetPosition)){
								this.blue.transform.x-=5*2/**/;
								if(this.blue.animation.currentAnimation.name != 'moveleft')
									this.blue.animation.play('moveleft');
							}else{
								if(this.onBlockType(this.ladderBlocks, blue_feetPosition)){
									this.blue.animation.play('idleclimb');
									console.log('playing idleclimb');
								}
							}	
						}
						break;
					case 'right':
					 	this.blueFacing = 'right';
						if(this.onBlockType(this.rightBlockedBlocks, blue_feetPosition)){
							var pixelNum = this.getPixelNumberForGridPosition(blue_feetPosition,'east');
							if(this.blue.transform.x+54*2/**/<pixelNum-6*2/**/){
								this.blue.transform.x +=5*2/**/;
							}else{
								this.blue.transform.x = pixelNum-51*2/**/;
								if(this.onBlockType(this.ladderBlocks, blue_feetPosition)){
									if(this.onBlockType(this.firstLadderBlocks, this.getGridPosition(this.blue.x, this.blue.y+3*2/**/,'north'))){
										this.blue.animation.play('idle' +this.blueFacing);
									}else{
										this.blue.animation.play('idleclimb');
										console.log('playing idleclimb');
									}
								}else{
									this.blue.animation.play('idle'+this.blueFacing);
								}
								this.blueMovingDirection = 'none';
							}
						}
						else{
							if(!this.onBlockType(this.groundBlocks, blue_feetPosition)){
								this.blue.transform.x+=5*2/**/;
								if(this.blue.animation.currentAnimation.name != 'moveright')
									this.blue.animation.play('moveright');
							}else{
								if(this.onBlockType(this.ladderBlocks, blue_feetPosition)){
									this.blue.animation.play('idleclimb');
									console.log('playing idleclimb');
								}
							}
						}
						break;
					case 'up':
						var blue_gridPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y, 'north');
						if(this.onBlockType(this.topLadderBlocks, blue_gridPosition)){
							var pixelNum = this.getPixelNumberForGridPosition(blue_gridPosition,'north');
							if(this.blue.transform.y>6*2/**/+pixelNum){
								this.blue.transform.y-=3*2/**/;
								if(this.blue.animation.currentAnimation.name!='climb'){
									this.blue.animation.play('climb');
								}				
							}else{
								this.blue.transform.y=pixelNum+2;
								this.blue.animation.play('idle'+this.blueFacing);			
							}
						}else if(this.onBlockType(this.ladderBlocks, blue_gridPosition)){
							if(this.blue.transform.y>3*2/**/)
								this.blue.transform.y-=3*2/**/;
							console.log(this.blue.animation.currentAnimation.name);
							if(this.blue.animation.currentAnimation.name != 'climb'){
								this.blue.animation.play('climb');
								console.log('playing climb');
							}
						}else{
							this.blue.animation.play('idle'+this.blueFacing);
						}
						break;
					case 'down':
						if(this.onBlockType(this.firstLadderBlocks,blue_southGridPosition)){
							var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'south');
							if(this.blue.transform.y+54*2/**/<pixelNum-6*2/**/){
								this.blue.transform.y+=3*2/**/;
								if(this.blue.animation.currentAnimation.name!='climb'){
									this.blue.animation.play('climb');
								}				
							}
							else{
								this.blue.transform.y=pixelNum-53*2/**/+2+1/**/; 
								this.blue.animation.play('idle'+this.blueFacing);
							}
						}
						else if(this.onBlockType(this.ladderBlocks, blue_southGridPosition)){
							if(this.blue.transform.y<866*2/**/)
								this.blue.transform.y+=5*2/**/;
							else
								this.blue.transform.y = 866*2/**/;
							if(this.blue.animation.currentAnimation.name != 'climb')
								this.blue.animation.play('climb');
						}else{
							this.blue.animation.play('idle'+this.blueFacing);
						}
						break;	
		}
	}
	


	

	if(this.redIsAlive){
		var red_southGridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y,'south');
		var red_belowFeetPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y+1*2/**/,'south');
		var red_feetPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y-3*2/**/,'south');	

		 	if(!(this.onBlockType(this.ladderBlocks,red_southGridPosition) || this.onBlockType(this.groundBlocks, red_southGridPosition))){
		 		if(this.onBlockType(this.topGroundBlocks,red_southGridPosition)){
		 			var pixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'south');
		 			if(this.red.transform.y+54*2/**/<pixelNum-26*2/**/)
		 				this.red.transform.y+=13*2/**/;
		 			else
		 				this.red.transform.y=pixelNum-53*2/**/+2*2/**/;
		 		}else{
		 			if(this.red.transform.y+54*2/**/<54*2/**/*15-14*2/**/)
		 				this.red.transform.y+=13*2/**/;
		 			else
		 				this.red.transform.y=54*2/**/*15-54*2/**/;
		 		}
		 	}
	}
	if(this.redMovingDirection != 'none'){
		switch(this.redMovingDirection){
			case 'left':
				this.redFacing = 'left';
				if(this.onBlockType(this.leftBlockedBlocks, red_feetPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(red_feetPosition,'west');
					if(this.red.transform.x>pixelNum+6*2/**/){
						this.red.transform.x-=5*2/**/;
					}else{
						this.red.transform.x = pixelNum;
						if(this.onBlockType(this.ladderBlocks, red_feetPosition)){
							if(this.onBlockType(this.firstLadderBlocks, this.getGridPosition(this.red.x, this.red.y+3*2/**/,'north'))){
								this.red.animation.play('idle'+this.redFacing);
							}else{
								this.red.animation.play('idleclimb');
								console.log('playing idleclimb');
							}						
						}else{
							this.red.animation.play('idle'+this.redFacing);
						}
						this.redMovingDirection = 'none';
					}
				}else{
					if(!this.onBlockType(this.groundBlocks, red_feetPosition)){
						this.red.transform.x-=5*2/**/;
						if(this.red.animation.currentAnimation.name != 'moveleft')
							this.red.animation.play('moveleft');
					}else{
						if(this.onBlockType(this.ladderBlocks, red_feetPosition)){
							this.red.animation.play('idleclimb');
							console.log('playing idleclimb');
						}
					}	
				}
				break;
			case 'right':
			 	this.redFacing = 'right';
				if(this.onBlockType(this.rightBlockedBlocks, red_feetPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(red_feetPosition,'east');
					if(this.red.transform.x+54*2/**/<pixelNum-6*2/**/){
						this.red.transform.x +=5*2/**/;
					}else{
						this.red.transform.x = pixelNum-51*2/**/;
						if(this.onBlockType(this.ladderBlocks, red_feetPosition)){
							if(this.onBlockType(this.firstLadderBlocks, this.getGridPosition(this.red.x, this.red.y+3*2/**/,'north'))){
								this.red.animation.play('idle' +this.redFacing);
							}else{
								this.red.animation.play('idleclimb');
								console.log('playing idleclimb');
							}
						}else{
							this.red.animation.play('idle'+this.redFacing);
						}
						this.redMovingDirection = 'none';
					}
				}
				else{
					if(!this.onBlockType(this.groundBlocks, red_feetPosition)){
						this.red.transform.x+=5*2/**/;
						if(this.red.animation.currentAnimation.name != 'moveright')
							this.red.animation.play('moveright');
					}else{
						if(this.onBlockType(this.ladderBlocks, red_feetPosition)){
							this.red.animation.play('idleclimb');
							console.log('playing idleclimb');
						}
					}
				}
				break;
			case 'up':
				var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y, 'north');
				if(this.onBlockType(this.topLadderBlocks, red_gridPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(red_gridPosition,'north');
					if(this.red.transform.y>6*2/**/+pixelNum){
						this.red.transform.y-=3*2/**/;
						if(this.red.animation.currentAnimation.name!='climb'){
							this.red.animation.play('climb');
						}				
					}else{
						this.red.transform.y=pixelNum+2;
						this.red.animation.play('idle'+this.redFacing);			
					}
				}else if(this.onBlockType(this.ladderBlocks, red_gridPosition)){
					if(this.red.transform.y>3*2/**/)
						this.red.transform.y-=3*2/**/;
					console.log(this.red.animation.currentAnimation.name);
					if(this.red.animation.currentAnimation.name != 'climb'){
						this.red.animation.play('climb');
						console.log('playing climb');
					}
				}else{
					this.red.animation.play('idle'+this.redFacing);
				}
				break;
			case 'down':
				if(this.onBlockType(this.firstLadderBlocks,red_southGridPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'south');
					if(this.red.transform.y+54*2/**/<pixelNum-6*2/**/){
						this.red.transform.y+=3*2/**/;
						if(this.red.animation.currentAnimation.name!='climb'){
							this.red.animation.play('climb');
						}				
					}
					else{
						this.red.transform.y=pixelNum-53*2/**/+2+1/**/; 
						this.red.animation.play('idle'+this.redFacing);
					}
				}
				else if(this.onBlockType(this.ladderBlocks, red_southGridPosition)){
					if(this.red.transform.y<866*2/**/)
						this.red.transform.y+=5*2/**/;
					else
						this.red.transform.y = 866*2/**/;
					if(this.red.animation.currentAnimation.name != 'climb')
						this.red.animation.play('climb');
				}else{
					this.red.animation.play('idle'+this.redFacing);
				}
				break;	
		}

	}

}	



