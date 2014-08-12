var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

	this.BLOCK_PIXEL_SIZE = 50; 
	this.bps = this.BLOCK_PIXEL_SIZE; 
	this.MULTIPLIER = 1; 
	this.numPlayers = 2;

	this.addSpriteSheet('sprites','bandit_spritesheet.png',this.bps,this.bps);
	this.addSpriteSheet('ghouliath','ghouliath_spritesheet.png',this.bps*2, this.bps*2);
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

	this.addAudio('bombSound','sounds/Cannon-SoundBible.com-1661203605.wav');
	this.addAudio('coinSound','sounds/coin.wav');
	this.addAudio('gunSound','sounds/gunshot.wav');
	this.addAudio('blockReappearSound','sounds/blockappear.wav');
	this.addAudio('banditDeathSound','sounds/death_1.wav');
	this.addAudio('diamondSound','sounds/diamond_1.wav');
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

	if(this.currentLevel>1){
		this.blue.bombsCollected = 0;
		this.red.bombsCollected = 0;
		this.updateBombCounter(this.blue);
		this.updateBombCounter(this.red);
	}




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

	this.blue.isAlive = true;
	this.red.isAlive = true;


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

	this.ghouliath = new Ghouliath(this, 100, 100, 'right');
	this.ghouliath.animation.add('moveleft',[0,1,2,3,4,5,6,7,8,9],0.12,true);
	this.ghouliath.animation.add('moveright',[10,11,12,13,14,15,16,17,18,19],0.12,true);
	this.ghouliath.animation.play('moveright');
	this.ghouliath.facing = 'right';


	this.addChild(this.background);
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.hiddenBlockGroup);	
	this.addChild(this.tilemap.layers[1]);
	this.addChild(this.tilemap.layers[2]);
	
	this.addChild(this.coinGroup);
	this.addChild(this.ghoulGroup);
	this.addChild(this.banditGroup);

	this.addChild(this.ghouliath);

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

	this.mouse = this.game.input.mouse;


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

gameState.onKeyDownCallback = function(keyCode){
	if(keyCode == this.red_fireKey.keyCode || keyCode == this.blue_fireKey.keyCode){
		this.gunSound.play('start',true);
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
						this.diamondSound.play('start',true);
					}else{
						this.redCoinsCollected ++;
					}
					this.updateCoinCounter('red');		
				}else{
					if(coins[i].animation.currentAnimation.name == 'shine'){
						this.blueCoinsCollected += 10;
						this.diamondSound.play('start',true);						
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
				if(bandits[j].isAlive){
					this.banditDeathSound.play('start',false);
					bandits[j].isAlive = false;
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
					this.red.isAlive = true;
					this.red.isDeadAndOnGround = false;
					this.red.animation.play('idleleft');
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
					this.blue.isAlive = true;
					this.blue.isDeadAndOnGround = false;
					this.blue.animation.play('idleleft');
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
	this.x = 2000;
	this.shouldBeGone = true;
	this.timer.stop();
}

Heart.prototype.showSelf = function(){
	var banditX = null;
	switch(this.bandit){
		case 'red':
			banditX = this.state.red.x;
			this.y = this.state.red.y - 35;
			break;

		case 'blue':
			banditX = this.state.blue.x;
			this.y = this.state.blue.y - 35;
			break;
	}
	switch (this.number){
				case 1: 
					this.x = banditX -15;
					break;
				case 2:
					this.x = banditX;
					break;
				case 3:
					this.x = banditX +15;
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
	this.isAlive = true;
	this.isDeadAndOnGround = false;

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
		ghoul.destroy(false);
	}
	this.destroy();
	this.state.blockReappearSound.play('start',true);

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

gameState.onGunShotCallback = function(){
	this.gunSound.play('start',true);
}

gameState.banditGravity = function(bandit, southGridPosition){
	if(this.onBlockType(this.topGroundBlocks,southGridPosition)){
		var pixelNum = this.getPixelNumberForGridPosition(southGridPosition,'south');
		if(bandit.y+this.bps<pixelNum-26){
			bandit.y+=13;
		}else{
			bandit.y=pixelNum-this.bps+1;
			if(!bandit.isAlive){
				bandit.isDeadAndOnGround = true;
			}
		}
	}else{
		if(bandit.y+this.bps<this.bps*this.GRID_ROWS-26){
			bandit.y+=13;
		}else{
			bandit.y=this.bps*this.GRID_ROWS-this.bps;
			if(!bandit.isAlive){
				bandit.isDeadAndOnGround = true;
			}
		}
	}	
}


gameState.update = function(){
	Kiwi.State.prototype.update.call(this);

	if(this.showingLevelScreen == false){
		//blue player 
		if(!this.blue.isDeadAndOnGround){
			var blue_southGridPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y,'south');
		 	if(this.blue.isAlive){
			 	if(!(this.onBlockType(this.ladderBlocks,blue_southGridPosition) || this.onBlockType(this.groundBlocks, blue_southGridPosition))){
			 		this.banditGravity(this.blue, blue_southGridPosition);
			 	}
			}else{
				if(this.onBlockType(this.ladderBlocks,blue_southGridPosition) || !this.onBlockType(this.groundBlocks, blue_southGridPosition)){
					this.banditGravity(this.blue, blue_southGridPosition);
				}
			}
		}
		if(this.blue.isAlive){		 	
		 	if(this.blue_fireKey.isDown){
				this.blue.animation.play('fire' + this.blue.facing);
				if(this.blue.canShoot){
					var blastedBlockPosition = this.getBlastedBlockPosition(blue_southGridPosition, this.blue.facing, this.groundBlocks);
					this.blastBlock(blastedBlockPosition);
				}
			}
			else if(this.blue_upKey.isDown){
				var blue_gridPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y, 'north');
				
				if(this.onBlockType(this.topLadderBlocks, blue_gridPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(blue_gridPosition,'north');
					if(this.blue.transform.y>6+pixelNum){
						this.blue.transform.y-=3;
						if(this.blue.animation.currentAnimation.name!='climb'){
							this.blue.animation.play('climb');
						}				
					}else{
						this.blue.transform.y=pixelNum;
						this.blue.animation.play('idle'+this.blue.facing);			
					}
				}else if(this.onBlockType(this.ladderBlocks, blue_gridPosition)){
					if(this.blue.transform.y>3)
						this.blue.transform.y-=3;
					if(this.blue.animation.currentAnimation.name != 'climb')
						this.blue.animation.play('climb');
				}
				
			}
			else if(this.blue_rightKey.isDown){
				this.blue.facing = 'right';
				if(this.onBlockType(this.rightBlockedBlocks, blue_southGridPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'east');
					if(this.blue.transform.x+this.bps<pixelNum-6){
						this.blue.transform.x +=5;
					}else{
						this.blue.transform.x = pixelNum-this.bps+1;
						this.blue.animation.play('idle'+this.blue.facing);
					}
				}
				else{
					if(!this.onBlockType(this.groundBlocks, blue_southGridPosition)){
						this.blue.transform.x+=5;
						if(this.blue.animation.currentAnimation.name != 'moveright')
							this.blue.animation.play('moveright');
					}
				}
			}
			else if(this.blue_leftKey.isDown){
				this.blue.facing = 'left';
				if(this.onBlockType(this.leftBlockedBlocks, blue_southGridPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'west');
					if(this.blue.transform.x>pixelNum+6){
						this.blue.transform.x-=5;
					}else{
						this.blue.transform.x = pixelNum;
						this.blue.animation.play('idle'+this.blue.facing);
					}
				}else{
					if(!this.onBlockType(this.groundBlocks, blue_southGridPosition)){
						this.blue.transform.x-=5;
						if(this.blue.animation.currentAnimation.name != 'moveleft')
							this.blue.animation.play('moveleft');
					}
				}
			}
			else if(this.blue_downKey.isDown){
				var ladderPixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'west') + this.bps/2;
				var blue_belowFeetPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y+1,'south');				
				if(this.blue.x+this.bps/2>ladderPixelNum-10 && this.blue.x+this.bps/2<ladderPixelNum+10){	
					if(this.onBlockType(this.firstLadderBlocks, blue_southGridPosition)){
						if(!this.onBlockType(this.groundBlocks, blue_belowFeetPosition)){
							this.blue.transform.y+=3;
						}else{
							var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'south');
							if(this.blue.transform.y+this.bps<pixelNum-6){
								this.blue.transform.y+=3;
								if(this.blue.animation.currentAnimation.name!='climb'){
									this.blue.animation.play('climb');
								}				
							}
							else{
								this.blue.transform.y=pixelNum-this.bps+1; 
								this.blue.animation.play('idle'+this.blue.facing);
							}
						}
					}
					else if(this.onBlockType(this.ladderBlocks, blue_belowFeetPosition)){
						if(this.blue.transform.y<this.bps*this.GRID_ROWS)
							this.blue.transform.y+=5;
						else
							this.blue.transform.y = this.bps*this.GRID_ROWS;
						if(this.blue.animation.currentAnimation.name != 'climb')
							this.blue.animation.play('climb');
					}else{
						if(this.onBlockType(this.topGroundBlocks, blue_southGridPosition)){
							if(this.blue.bombClock.elapsed() > 5){
								this.placeBomb(this.blue);
							}
						}
					}
				}
			}
			else {
		 		var blue_belowFeetPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y+1,'south');
				if(this.onBlockType(this.ladderBlocks,blue_belowFeetPosition) && !this.onBlockType(this.topLadderBlocks,blue_southGridPosition)){
					if(this.blue.animation.currentAnimation.name != 'idleclimb')
						this.blue.animation.play('idleclimb');
				}		
				else if(this.blue.animation.currentAnimation.name != 'idle' + this.blue.facing)
					this.blue.animation.play('idle' + this.blue.facing);	
			}
		}
		else{
			this.deathCount('blue');
		}

		//red player 
		if(!this.red.isDeadAndOnGround){
			var red_southGridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y,'south');
		 	if(this.red.isAlive){
		 		if(!(this.onBlockType(this.ladderBlocks,red_southGridPosition) || this.onBlockType(this.groundBlocks, red_southGridPosition))){
					this.banditGravity(this.red, red_southGridPosition);
				}
			}else{
				if(this.onBlockType(this.ladderBlocks, red_southGridPosition) || !this.onBlockType(this.groundBlocks, red_southGridPosition)){
					this.banditGravity(this.red, red_southGridPosition);
				}
			}
		}
		if(this.red.isAlive){		 	
		 	if(this.red_fireKey.isDown){
		 		console.log('fire key down for red');
				this.red.animation.play('fire' + this.red.facing);
				console.log(this.red.animation.currentAnimation.name);
				if(this.red.canShoot){
					var blastedBlockPosition = this.getBlastedBlockPosition(red_southGridPosition, this.red.facing, this.groundBlocks);
					this.blastBlock(blastedBlockPosition);
				}
			}
			else if(this.red_upKey.isDown){
				var red_gridPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y, 'north');
				var ladderPixelNum = this.getPixelNumberForGridPosition(red_gridPosition,'west') + this.bps/2;
				if(this.red.x+this.bps/2>ladderPixelNum-15 && this.red.x+this.bps/2<ladderPixelNum+15){
					if(this.onBlockType(this.topLadderBlocks, red_gridPosition)){
						var pixelNum = this.getPixelNumberForGridPosition(red_gridPosition,'north');
						if(this.red.transform.y>6+pixelNum){
							this.red.transform.y-=3;
							if(this.red.animation.currentAnimation.name!='climb'){
								this.red.animation.play('climb');
							}				
						}else{
							this.red.transform.y=pixelNum;
							this.red.animation.play('idle'+this.red.facing);			
						}
					}else if(this.onBlockType(this.ladderBlocks, red_gridPosition)){
						if(this.red.transform.y>3)
							this.red.transform.y-=3;
						if(this.red.animation.currentAnimation.name != 'climb')
							this.red.animation.play('climb');
					}
				}
				
			}
			else if(this.red_rightKey.isDown){
				this.red.facing = 'right';
				if(this.onBlockType(this.rightBlockedBlocks, red_southGridPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'east');
					if(this.red.transform.x+this.bps<pixelNum-6){
						this.red.transform.x +=5;
					}else{
						this.red.transform.x = pixelNum-this.bps;
						this.red.animation.play('idleright');
					}
				}
				else{
					if(!this.onBlockType(this.groundBlocks, red_southGridPosition)){
						this.red.transform.x+=5;
						if(this.red.animation.currentAnimation.name != 'moveright')
							this.red.animation.play('moveright');
					}
				}
			}
			else if(this.red_leftKey.isDown){
				this.red.facing = 'left';
				if(this.onBlockType(this.leftBlockedBlocks, red_southGridPosition)){
					var pixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'west');
					if(this.red.transform.x>pixelNum+6){
						this.red.transform.x-=5;
					}else{
						this.red.transform.x = pixelNum;
						this.red.animation.play('idleleft');
					}
				}else{
					if(!this.onBlockType(this.groundBlocks, red_southGridPosition)){
						this.red.transform.x-=5;
						if(this.red.animation.currentAnimation.name != 'moveleft')
							this.red.animation.play('moveleft');
					}
				}
			}
			else if(this.red_downKey.isDown){
				var ladderPixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'west') + this.bps/2;
				var red_belowFeetPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y+1,'south');				
				if(this.red.x+this.bps/2>ladderPixelNum-10 && this.red.x+this.bps/2<ladderPixelNum+10){	
					if(this.onBlockType(this.firstLadderBlocks,red_southGridPosition)){
						if(!this.onBlockType(this.groundBlocks, red_belowFeetPosition)){
							this.red.transform.y+=3;
						}else{
							var pixelNum = this.getPixelNumberForGridPosition(red_southGridPosition,'south');
							if(this.red.transform.y+this.bps<pixelNum-6){
								this.red.transform.y+=3;
								if(this.red.animation.currentAnimation.name!='climb'){
									this.red.animation.play('climb');
								}				
							}
							else{
								this.red.transform.y=pixelNum-this.bps+1; 
								this.red.animation.play('idle'+this.red.facing);
							}
						}
					}
					else if(this.onBlockType(this.ladderBlocks, red_belowFeetPosition)){
						if(this.red.transform.y<this.bps*this.GRID_ROWS)
							this.red.transform.y+=5;
						else
							this.red.transform.y = this.bps*this.GRID_ROWS;
						if(this.red.animation.currentAnimation.name != 'climb')
							this.red.animation.play('climb');
					}else{
						if(this.onBlockType(this.topGroundBlocks, red_southGridPosition)){
							if(this.red.bombClock.elapsed() > 5){
								this.placeBomb(this.red);
							}
						}
					}
				}
			}
			else {
		 		var red_belowFeetPosition = this.getGridPosition(this.red.transform.x, this.red.transform.y+1,'south');
				if(this.onBlockType(this.ladderBlocks,red_belowFeetPosition) && !this.onBlockType(this.topLadderBlocks,red_southGridPosition)){
					if(this.red.animation.currentAnimation.name != 'idleclimb')
						this.red.animation.play('idleclimb');
				}		
				else{ 
					if(!this.onBlockType(this.groundBlocks,red_belowFeetPosition) && this.onBlockType(this.ladderBlocks,red_southGridPosition)){
						this.red.animation.play('idleclimb');
					}else{
						if(this.red.animation.currentAnimation.name != 'idle' + this.red.facing){
						this.red.animation.play('idle' + this.red.facing);	
						}
					}
				}
			}
		}else{
			this.deathCount('red');
		}

		this.checkCoinCollision();
		this.checkGhoulCollision();
		this.checkBombCollision();
		this.isLevelOver();
		this.isGameOver();

		if(this.debugKey.isDown){
			this.blackGhoul.findPathToBandit();	
		}

		if(this.mouse.isDown){
			this.levelOver();
			this.game.input.mouse.reset();
		}
	}	
}