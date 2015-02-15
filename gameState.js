var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);

	this.BLOCK_PIXEL_SIZE = 50; 
	this.bps = this.BLOCK_PIXEL_SIZE; 
	this.MULTIPLIER = 1; 
	this.numPlayers = this.game.numPlayers;
	this.currentLevel = this.game.currentLevel; 
	this.numberOfLevels = 21;	

}

gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.isPaused = false;
	this.soundsOn = true;
	this.musicOn = true;

	this.STAGE_Y_OFFSET = 32 * this.MULTIPLIER;
	this.STAGE_X_OFFSET = 38 * this.MULTIPLIER;

	this.x = this.bps - this.STAGE_X_OFFSET;
	this.y = this.bps - this.STAGE_Y_OFFSET;

	this.GRID_ROWS = 15;
	this.GRID_COLS = 20;	

	myGame.stage.color = '000000';

	this.winScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['win'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);
	this.loseScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['lose'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);

	this.mouse = this.game.input.mouse;
	this.mouse.onUp.add(this.mouseClicked, this);

	this.menuBackground = new Kiwi.GameObjects.StaticImage(this, this.textures['menuBackground'],250,-800);
	this.menuTween = this.game.tweens.create(this.menuBackground);	
	this.menuArrow = new Kiwi.GameObjects.Sprite(this, this.textures['menuArrow'], 450, -18*this.MULTIPLIER);
	this.menuArrow.name = 'menu';
	this.menuArrowTween = this.game.tweens.create(this.menuArrow);
	this.menuBackground.name = 'menu';

	this.menuGroup = new Kiwi.Group(this);
	this.MENU_XPOS = 250; 
	this.menuSound_yPosition = 330;
	this.menuMusic_yPosition = 400;
	this.menuRestart_yPosition = 470;
	this.menuHome_yPosition = 540;
	
	this.menuSound = new MenuIcon(this, this.MENU_XPOS, this.menuSound_yPosition, 'sound');
	this.menuMusic = new MenuIcon(this, this.MENU_XPOS, this.menuMusic_yPosition, 'music');
	this.menuRestart = new MenuIcon(this, this.MENU_XPOS, this.menuRestart_yPosition, 'restart');
	this.menuHome = new MenuIcon(this, this.MENU_XPOS, this.menuHome_yPosition, 'home');

	this.menuGroup.addChild(this.menuSound);
	this.menuGroup.addChild(this.menuMusic);
	this.menuGroup.addChild(this.menuRestart);
	this.menuGroup.addChild(this.menuHome);

	this.menuGroup.y = -800;
	this.menuGroupTween = this.game.tweens.create(this.menuGroup);

	this.betweenScreenGroup = new Kiwi.Group(this);
	this.MONEY_YPOS = 100;
	this.DEATH_YPOS = 195;
	this.TIME_YPOS = 290;		
	if(this.numPlayers == 1){
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'time', 300, this.TIME_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'death', 300, this.DEATH_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'money', 300, this.MONEY_YPOS));		
	}else{
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'time', 100, this.TIME_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'death', 100, this.DEATH_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'money', 100, this.MONEY_YPOS));	
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'time', 550, this.TIME_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'death', 550, this.DEATH_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'money', 550, this.MONEY_YPOS));	
	}

	this.bigDigitGroup = new Kiwi.Group(this);
		
	if(this.numPlayers == 1){
		for(var i = 2; i < 6; i++){
			var bigDigit = new BigDigit(this, 370+(i*52), 400, 'red', 6-i);
			bigDigit.animation.play('cycle');
			this.bigDigitGroup.addChild(bigDigit);
			if(i>2){
				var bigDigit = new BigDigit(this, 370+(i*52), this.MONEY_YPOS+15, 'black', 'money'+(6-i));
				bigDigit.visible = false;
				this.betweenScreenGroup.addChild(bigDigit);
				var bigDigit = new BigDigit(this, 370+(i*52), this.DEATH_YPOS+15, 'black', 'death'+(6-i));
				bigDigit.visible = false;
				this.betweenScreenGroup.addChild(bigDigit);
				var bigDigit = new BigDigit(this, 370+(i*52), this.TIME_YPOS+15, 'black', 'time'+(6-i));
				bigDigit.visible = false;	
				this.betweenScreenGroup.addChild(bigDigit);							
			}
		}			
	}else{
		var colors = ['red','blue'];
		for (var j = 0; j < 2; j++){
			for(var i = 2; i < 6; i++){
				var bigDigit = new BigDigit(this, 120+(i*52)+(j*450), 400, colors[j], 6-i);
				bigDigit.animation.play('cycle');
				this.bigDigitGroup.addChild(bigDigit);
			
				if(i>2){
					var bigDigit = new BigDigit(this, 120+(i*52)+(j*450), this.MONEY_YPOS+15, 'black', 'money'+(6-i));
					bigDigit.visible = false;
					this.betweenScreenGroup.addChild(bigDigit);
					var bigDigit = new BigDigit(this, 120+(i*52)+(j*450), this.DEATH_YPOS+15, 'black', 'death'+(6-i));
					bigDigit.visible = false;
					this.betweenScreenGroup.addChild(bigDigit);
					var bigDigit = new BigDigit(this, 120+(i*52)+(j*450), this.TIME_YPOS+15, 'black', 'time'+(6-i));
					bigDigit.visible = false;	
					this.betweenScreenGroup.addChild(bigDigit);	
				}						
			}	
		}
	}

	this.bonusGroup = new Kiwi.Group(this);
	this.bonusTweens = [];

	if(this.numPlayers == 1){
		var bonusRed = new BetweenScreenIcon(this, 'bonus', 378, this.MONEY_YPOS + 8);
		this.bonusGroup.addChild(bonusRed);
		this.bonusTweens.push(this.game.tweens.create(bonusRed));
	}else{
		var bonusRed = new BetweenScreenIcon(this, 'bonus', 178, this.MONEY_YPOS + 8);
		var bonusBlue = new BetweenScreenIcon(this, 'bonus', 628, this.MONEY_YPOS + 8);
		this.bonusGroup.addChild(bonusRed);
		this.bonusGroup.addChild(bonusBlue);
		this.bonusTweens.push(this.game.tweens.create(bonusRed));
		this.bonusTweens.push(this.game.tweens.create(bonusBlue));
	}

	this.digitGroup = new Kiwi.Group(this);
	this.timerDigitGroup = new Kiwi.Group(this);
	this.bombIconGroup = new Kiwi.Group(this);
	this.ghoulKillCountGroup = [];

	
	this.ghoulKillCountGroup[0] = new Kiwi.Group(this);
	//var skull = new Digit(this, 118,-18,'ghoul',1);
	//skull.animation.play('skull');
	//this.ghoulKillCountGroup[0].addChild(skull);
	for(var i = 0; i < 17; i++){
		var dot = new Digit(this, 118+18*i, -18, 'ghoul', 1);
		dot.animation.play('dot');
		this.ghoulKillCountGroup[0].addChild(dot);
		console.log(dot);
	}		
	if(this.numPlayers == 2){
		this.ghoulKillCountGroup[1] = new Kiwi.Group(this);
		//var skull = new Digit(this, 866,-18,'ghoul',1);
		//skull.animation.play('skull');
		//this.ghoulKillCountGroup[1].addChild(skull);	
		for(var i = 0; i < 17; i++){
			var dot = new Digit(this, 866-18*i, -18, 'ghoul', 1);
			dot.animation.play('dot');
			this.ghoulKillCountGroup[1].addChild(dot);
		}			
	}

	if(this.numPlayers==1){
		for (var i = 0; i<4; i++){
			if(i<2){
				var digit = new Digit(this, (i*18), -18,'red',i+1);
			}else{
				var digit = new Digit(this, 6+(i*18), -18,'red',i+1);			
			}
			digit.animation.play('0');
			this.timerDigitGroup.addChild(digit);
		}
	}

	for (var i = 0; i<3; i++){
		var digit = new Digit(this, 10+(i*18),-18,'red', 3-i);
		digit.animation.play('0');
		this.digitGroup.addChild(digit);
	}
	for (var i = 0; i<3; i++){
		var bomb = new Digit(this, 10+((3+i)*18),-18,'red', i+7);
		bomb.animation.play('bomb');
		this.bombIconGroup.addChild(bomb);
	}
	if(this.numPlayers == 2){
		for (var i = 0; i<3; i++){
			var digit = new Digit(this, 938+(i*18),-18,'blue', 3-i);
			digit.animation.play('0');
			this.digitGroup.addChild(digit);
		}	
		for (var i = 0; i<3; i++){
			var bomb = new Digit(this, 938-(18*(i+1)),-18,'blue', i+7);
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

	this.horseGroup = new Kiwi.Group(this);
	this.redHorse = new Horse(this, this.bps*(this.GRID_COLS+2), 570);
	this.redHorse.animation.play('redrun');
	this.blueHorse = new Horse(this, this.bps*(this.GRID_COLS+2), 610);
	this.blueHorse.animation.play('bluerun');
	this.horseGroup.addChild(this.redHorse);
	if(this.numPlayers == 2){
		this.horseGroup.addChild(this.blueHorse);
	}

	this.stageCoach = new StageCoach(this, this.bps*(this.GRID_COLS+2), 500);
	this.stageCoach.animation.play('move');
	this.horseGroup.addChild(this.stageCoach);


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

	//Gamepad experimenting
	console.log('NUMBER OF GAMEPADS: ' + this.game.gamepads.gamepads.length);
	this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnce0, this);
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUp0, this);
	this.game.gamepads.gamepads[0].buttonIsDown.add(this.buttonIsDown0, this)
	if(this.numPlayers == 2){
		this.game.gamepads.gamepads[1].buttonOnDownOnce.add(this.buttonOnDownOnce1, this);
		this.game.gamepads.gamepads[1].buttonOnUp.add(this.buttonOnUp1, this);
		this.game.gamepads.gamepads[1].buttonIsDown.add(this.buttonIsDown1, this)
	}

	this.game.input.keyboard.onKeyDown.add(this.onKeyDownCallback, this);
	this.debugKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.I);

	this.coinGroup = new Kiwi.Group(this);
	this.potionGroup = new Kiwi.Group(this);
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
	this.shotgunSound = new Kiwi.Sound.Audio(this.game, 'shotgunSound', 0.1, false);
	this.shotgunSound.addMarker('start',0,3,false);

	this.blockReappearSound = new Kiwi.Sound.Audio(this.game, 'blockReappearSound',0.3,false);
	this.blockReappearSound.addMarker('start',.5,1,false);

	this.banditDeathSound = new Kiwi.Sound.Audio(this.game, 'banditDeathSound',0.3, false);
	this.banditDeathSound.addMarker('start',0,1,false);
	this.diamondSound = new Kiwi.Sound.Audio(this.game, 'diamondSound', 0.1, false);
	this.diamondSound.addMarker('start',0,1,false);

	this.ghoulTeleportOutSound = new Kiwi.Sound.Audio(this.game, 'ghoulTeleportOutSound', 0.2, false);
	this.ghoulTeleportOutSound.addMarker('start', 0, 1, false);
	this.ghoulTeleportInSound = new Kiwi.Sound.Audio(this.game, 'ghoulTeleportInSound', 0.2, false);
	this.ghoulTeleportInSound.addMarker('start', 0, 1, false);
	this.ghoulDeathSound = new Kiwi.Sound.Audio(this.game, 'ghoulDeathSound', 0.2, false);
	this.ghoulDeathSound.addMarker('start', 0, 1, false);

	this.voicesSound = new Kiwi.Sound.Audio(this.game, 'voicesSound', 0.3, false);
	this.voicesSound.addMarker('bombPickup',0,1.3845,false);
	this.voicesSound.addMarker('bombPlace',1.3845,3.1347,false);
	this.voicesSound.addMarker('bombPlace2',3.1347,4.2057,false);
	this.voicesSound.addMarker('critters',4.2057,6.4261,false);
	this.voicesSound.addMarker('dontTread',6.4261,7.6016,false);
	this.voicesSound.addMarker('ghoulKiller',7.6016,9.0645,false);
	this.voicesSound.addMarker('hotDamnSon',9.0645,10.5535,false);
	this.voicesSound.addMarker('killAllThemGhouls',10.5535, 12.3820,false);
	this.voicesSound.addMarker('laugh1',12.3820,19.7747,false);
	this.voicesSound.addMarker('money1',19.7747,21.6555,false);
	this.voicesSound.addMarker('money2',21.6555, 23.1967, false);
	this.voicesSound.addMarker('restInPieces',23.1967, 25.2082, false);
	this.voicesSound.addMarker('rideOut',25.2082, 26.3837, false);
	this.voicesSound.addMarker('sixFeetUnder',26.3837,28.3429, false);
	this.voicesSound.addMarker('standYourGround',28.3429,30.3804,false);
	this.voicesSound.addMarker('tenFootTall',30.3804, 33.0971, false);
	this.voicesSound.addMarker('westBest',33.0971,34.8996,false);
	this.voicesSound.addMarker('whatBlazes',34.8996, 36.2580, false);
	this.voicesSound.addMarker('whoa1',36.2580, 37.6424, false);
	this.voicesSound.addMarker('whoa2',37.6424, 39.0008, false);
	this.voicesSound.addMarker('yaaahhh',39.0008,40.5682, false);
	this.voicesSound.addMarker('yeehaw',40.5682, 42.6057, false);

	this.musicSound = new Kiwi.Sound.Audio(this.game, 'musicSound', 0.2, true);

	this.beginningLevelVoices = ['critters','dontTread','killAllThemGhouls','westBest'];

	this.gameTimer = this.game.time.clock.createTimer('updateTimer',1,-1,false);
	this.gameTimerEvent = this.gameTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.updateTimer, this);
	this.gameTimer.start();
	this.gameTimer.pause();

	this.pressUpSignLocations = [[550, 650], [550, 650], [200, 650]];
	this.signGridPositions = [[14, 12], [14, 12], [14, 5]];


	this.showLevelScreen();
	
	
}

gameState.showLevelScreen = function(){
	this.showingLevelScreen = true;
	this.horseGroup.visible = false;
	this.levelScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['level'+this.currentLevel],0,-18*this.MULTIPLIER);
	this.levelScreen.alpha = 0;
	this.levelScreen.name = 'levelScreen';
	this.addChild(this.levelScreen);

	this.levelScreenTweenIn = this.game.tweens.create(this.levelScreen, this);
	this.levelScreenTweenOut = this.game.tweens.create(this.levelScreen, this);
	this.levelScreenTweenIn.to({ alpha: 1 }, 800, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.levelScreenTweenOut.to({ alpha: 0 }, 1000, Kiwi.Animations.Tweens.Easing.Cubic.In);

	this.levelScreenTweenIn.onComplete(this.onLevelScreenInComplete, this);
	this.levelScreenTweenOut.onComplete(this.createLevel, this);

	this.levelScreenTweenIn.chain(this.levelScreenTweenOut);
	this.levelScreenTweenIn.start();
}

gameState.createLevel = function(){

	var blockArrays = this.parseBlocks('level_tilemap'+this.currentLevel);
	this.permBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);

	//coins
	var coinsLayerArray = blockArrays[4];
	var width = blockArrays[8];
	var tileWidth = blockArrays[7];

	var coinHitboxX = Math.round(this.bps*this.COIN_HITBOX_X_PERCENTAGE);
	var coinHitboxY = Math.round(this.bps*this.COIN_HITBOX_Y_PERCENTAGE);

	for(var i = 0; i<coinsLayerArray.length;i++){
		if(coinsLayerArray[i] == 67){
			var coinPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var coin = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],coinPixels[0],coinPixels[1]);
			coin.animation.add('spin',[66,67,68,69],0.1,true);
			coin.animation.play('spin');
			coin.box.hitbox = new Kiwi.Geom.Rectangle(coinHitboxX,coinHitboxY,this.bps - 2*coinHitboxX,this.bps-2*coinHitboxY);			
			this.coinGroup.addChild(coin);
		}else if(coinsLayerArray[i] == 89){
				var diamondPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
				var diamond = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],diamondPixels[0], diamondPixels[1]);
				diamond.animation.add('shine',[88],0.1,false);
				diamond.animation.play('shine');
				diamond.box.hitbox = new Kiwi.Geom.Rectangle(coinHitboxX,coinHitboxY,this.bps - 2*coinHitboxX,this.bps-2*coinHitboxY);			
				this.coinGroup.addChild(diamond);
		}
		else if(coinsLayerArray[i] == 117){
			var potionPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var potion = new Potion(this, potionPixels[0], potionPixels[1], 'whiskey');
			potion.box.hitbox = new Kiwi.Geom.Rectangle(coinHitboxX,coinHitboxY,this.bps - 2*coinHitboxX,this.bps-2*coinHitboxY);			
			this.potionGroup.addChild(potion);
		}
	}

	//bombs and cracks
	var bombsLayerArray = blockArrays[6];

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
			}
		}
	}

	/*
	//breaking blocks
	this.breakingBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	this.breakingBlocks[8][14] = 1;
	this.breakingBlocks[8][15] = 1;
	this.breakingBlocks[8][16] = 1;
	this.breakingBlocks[8][17] = 1;
	var pixels = this.getPixelPositionFromRowCol(8, 14);
	var breakingBlock = new BreakingBlock(this, pixels[0], pixels[1]);
	this.cracksGroup.addChild(breakingBlock);
	var pixels = this.getPixelPositionFromRowCol(8, 15);
	var breakingBlock = new BreakingBlock(this, pixels[0], pixels[1]);
	this.cracksGroup.addChild(breakingBlock);
	var pixels = this.getPixelPositionFromRowCol(8, 16);
	var breakingBlock = new BreakingBlock(this, pixels[0], pixels[1]);
	this.cracksGroup.addChild(breakingBlock);
	var pixels = this.getPixelPositionFromRowCol(8, 17);
	var breakingBlock = new BreakingBlock(this, pixels[0], pixels[1]);
	this.cracksGroup.addChild(breakingBlock);	
	*/

	//ghouls
	var ghoulsLayerArray = blockArrays[3];
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
						}else{
							if(ghoulsLayerArray[i]==164){
								var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
								var ghoul = new TurboKingGhoul(this,ghoulPixels[0],ghoulPixels[1],'left');
								this.ghoulGroup.addChild(ghoul);
							}
						}
					}
				}
			}
		}
	}

	var count = 0;

	for(var i = 0; i<ghoulsLayerArray.length; i++){
		if(ghoulsLayerArray[i] == 163){
			var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var ghouliath = new Ghouliath(this, ghoulPixels[0], ghoulPixels[1], 'right');
			count++;
			//if(count == 3){
				this.ghoulGroup.addChild(ghouliath);					
			//}					
		}else{
			if(ghoulsLayerArray[i] == 1){
				this.red.startingPixelLocations = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			}
			if(this.numPlayers == 2){
				if(ghoulsLayerArray[i] == 19){
					this.blue.startingPixelLocations = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
				}	
			}	
		}
	}

	//this.ghoulGroup.addChild(ghouliath);
	//this.ghouliath = ghouliath;

	this.red.resetPropertiesAtBeginningOfLevel();
	this.updateCoinCounter(this.red);
	this.updateBombCounter(this.red);
		
	if(this.numPlayers==2){
		this.blue.resetPropertiesAtBeginningOfLevel();
		this.updateCoinCounter(this.blue);
		this.updateBombCounter(this.blue);
	}

	this.removeGhoulDots();
	

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


	if(this.currentLevel <= 3){
		this.tutorialSign = new Kiwi.GameObjects.StaticImage(this, this.textures['tutorial' + this.currentLevel],125*this.MULTIPLIER, this.GRID_ROWS * this.bps);
		this.tutorialSignTween = this.game.tweens.create(this.tutorialSign);	
		var pressUpSignLocation = this.pressUpSignLocations[this.currentLevel - 1];
		this.pressUpSign = new Kiwi.GameObjects.StaticImage(this, this.textures['pressup'], pressUpSignLocation[0], pressUpSignLocation[1])
		this.pressUpSign.alpha = 0;
		this.pressUpSignTween = this.game.tweens.create(this.pressUpSign);
	}

	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'+this.currentLevel],-this.bps,-this.bps);
	this.background.name = 'background';
	this.background2 = new Kiwi.GameObjects.StaticImage(this, this.textures['background'+this.currentLevel],-this.bps,-this.bps);
	this.background2.alpha = 0;
	
	this.background2Tween = this.game.tweens.create(this.background2);
	this.background2Tween.onComplete(this.showCutScene, this);
	this.background2Tween.to({ alpha: 1 }, 1000, Kiwi.Animations.Tweens.Easing.Sinusoidal.Out);

	this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this,'level_tilemap'+this.currentLevel, this.textures.sprites);
	
	
	this.groundBlocks = this.getGroundBlocks(blockArrays[0],width);
	this.originalGroundBlocks = this.getGroundBlocks(blockArrays[0],width);
	this.ladderBlocks = this.getLadderBlocks(blockArrays[1],width);
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

	this.addChild(this.background);
		
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.cracksGroup);	
	this.addChild(this.hiddenBlockGroup);	
	this.addChild(this.tilemap.layers[1]);
	this.addChild(this.tilemap.layers[2]);

	this.addChild(this.coinGroup);
	this.addChild(this.potionGroup);
	this.addChild(this.ghoulGroup);
	this.addChild(this.banditGroup);

	this.addChild(this.horseGroup);
	this.horseGroup.active = false;
	this.horseGroup.visible = false;

	//this.addChild(this.ghouliath);


	this.addChild(this.tilemap.layers[5]);
	this.addChild(this.bombGroup);

	this.addChild(this.redHeartsGroup);
	if(this.numPlayers == 2){
		this.addChild(this.blueHeartsGroup);
	}	
	
	this.iconsNotDuringCutscene();
	this.betweenScreenGroup.addChild(this.bonusGroup);
	this.addChild(this.betweenScreenGroup);
	this.addChild(this.bigDigitGroup);

	this.addChild(this.digitGroup);
	this.addChild(this.bombIconGroup);
	this.addChild(this.timerDigitGroup);
	this.timerDigitGroup.x = 920;
	for (var i = 0; i < this.ghoulKillCountGroup.length; i++){
		this.addChild(this.ghoulKillCountGroup[i]);
	}

	this.addChild(this.background2);

	this.addChild(this.menuArrow);
	this.addChild(this.menuBackground);
	this.addChild(this.menuGroup);

	if(this.currentLevel <= 3){
		this.addChild(this.pressUpSign);		
		this.addChild(this.tutorialSign);
	}

	this.rideOutPlayed = false;
	if(this.soundsOn){
		var toPlay = this.beginningLevelVoices[this.random.integerInRange(0,this.beginningLevelVoices.length)];
		this.voicesSound.play(toPlay,true);
	}	
	
	this.timer = this.game.time.clock.createTimer('levelOver',2,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.levelOver,this);

	if(this.musicOn){
		this.musicSound.play();
	}
	
	this.gameTimeSeconds = 0;
	if(this.numPlayers==1){
		for (var i = 0; i < this.timerDigitGroup.members.length; i++){
			this.timerDigitGroup.members[i].resetCounter();
		}
	}
	this.gameTimer.resume();

	this.showingLevelScreen = false;
	this.showingTutorial = false;
	this.showingPressUp = false;
}

gameState.addGhoulKill = function(bandit){
	switch(bandit){
		case 'red':
			var index = 0;
			break;
		case 'blue':
			var index = 1;
			break;
	}		
	var ghoulsKilled = this.banditGroup.members[index].totalGhoulKills();
	var tensKilled = Math.floor(ghoulsKilled/10);
	var onesKilled = ghoulsKilled % 10; 
	for(var i = 0; i < tensKilled; i++){
		this.ghoulKillCountGroup[index].members[i].animation.play('skull');
		this.ghoulKillCountGroup[index].members[i].visible = true;
	}
	for(var i = tensKilled; i < 17; i++){
		if(i < tensKilled + onesKilled){
			this.ghoulKillCountGroup[index].members[i].animation.play('dot');
			this.ghoulKillCountGroup[index].members[i].visible = true;
		}else{
			this.ghoulKillCountGroup[index].members[i].visible = false;
		}
	}	
}

gameState.removeGhoulDots = function(){
	for(var i = 0; i < this.banditGroup.members.length; i++){
		var dots = this.ghoulKillCountGroup[i].members;
		for (var j = 0; j<dots.length; j++){
			if(dots[j].animation.currentAnimation.name != 'skull'){
				dots[j].visible = false;
			}
		}
	}
}


gameState.updateTimer = function(){
	this.gameTimeSeconds++;
	if(this.numPlayers==1){
		var minutes = Math.round(this.gameTimeSeconds / 60);
		var seconds = this.gameTimeSeconds % 60; 
		var ones = seconds % 10;

		var increaseNext = this.timerDigitGroup.members[3].increaseByOne();
		if(increaseNext == 1){
			var increaseNext = this.timerDigitGroup.members[2].increaseByOne();
		}
		if(increaseNext == 1){
			var increaseNext = this.timerDigitGroup.members[1].increaseByOne();
		}
		if(increaseNext == 1){
			var increaseNext = this.timerDigitGroup.members[0].increaseByOne();
		}	
	}
}

gameState.onKeyDownCallback = function(keyCode){
	if(this.soundsOn){
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
}

gameState.updateBlockedBlocks = function(){
	this.getBlockedBlocks(this.groundBlocks,'left',this.leftBlockedBlocks);
	this.getBlockedBlocks(this.groundBlocks,'right',this.rightBlockedBlocks);
}

gameState.checkCollisions = function(){
	this.checkCoinCollision();
	this.checkPotionCollision();
	this.checkGhoulCollision();
	this.checkBombCollision();
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
						if(this.soundsOn){
							this.voicesSound.play('bombPickup',true);
						}
					}
				}
			}
		}
	}
}

gameState.checkPotionCollision = function(){
	var potions = this.potionGroup.members;
	var bandits = this.banditGroup.members;

	for (var i = 0; i <potions.length; i++){
		for (var j = 0; j<bandits.length; j++){	
			var potionBox = potions[i].box.hitbox;
			if(bandits[j].box.bounds.intersects(potionBox)){
				if(potions[i].type == 'whiskey'){
					if(bandits[j].numberOfHearts < 3){
						bandits[j].numberOfHearts ++;
						this.showHearts(bandits[j].color);
						potions[i].destroy();
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
					if(this.soundsOn){
						this.diamondSound.play('start',true);
					}
				}else{
					bandits[j].coinsCollected ++;
					if(this.soundsOn){
						this.coinSound.play('start',true);
						if(bandits[j].coinsCollected == 40){
							this.voicesSound.play('money2',true);
						}else if(bandits[j].coinsCollected == 80){
							this.voicesSound.play('money1',true);
						}else if(bandits[j].coinsCollected == 120){
							this.voicesSound.play('yeehaw',true);
						}
					}
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
					if(this.soundsOn){
						this.banditDeathSound.play('start',false);
					}
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

	return [groundLayerArray, ladderLayerArray, backObjectsLayerArray, ghoulsLayerArray, coinsLayerArray, frontObjectsLayerArray, bombsLayerArray, tileWidth, width];
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

gameState.levelOver = function(showCutScene){
	showCutScene = typeof showCutScene !== 'undefined' ? showCutScene : true;
	console.log(showCutScene + ' show showCutScene');
	if(this.gameIsOver){
		this.destroyEverything(true);
		this.gameTimer.pause();
		this.game.states.switchState('titleState');
	}else{
		this.currentLevel += 1;
		if(this.currentLevel > this.numberOfLevels+1){
			this.destroyEverything(true);
			this.game.states.switchState('titleState');
		}else if(this.currentLevel > this.numberOfLevels){
			this.addChild(this.winScreen);
		}else{
			this.updateLevelSelectionScreen(this.currentLevel);
			if(showCutScene){
				this.showingLevelScreen = true;	
				this.background2Tween.start();
			}else{
				this.showLevelScreen();
			}
		}
	}
}

gameState.updateLevelSelectionScreen = function(levelUnlocked){
	if(levelUnlocked <= 20){
		this.game.levelsUnlocked[levelUnlocked-1] = 1;
	}
}

gameState.showCutScene = function(){
	this.destroyEverything(false);

	var members = this.banditGroup.members;
	for(var i = 0; i<members.length; i++){
		members[i].totalCoinsCollected += members[i].coinsCollected;
	}

	this.iconsDuringCutScene();
	var totalPoints = this.addPointCounters();	
	for(var i =0; i<members.length; i++){
		members[i].totalCoinsCollected = totalPoints[i];		
	}

	this.addBonusIcons();
	
	this.updateBigCoinCounter();

	this.moveBanditsOffscreen();
	this.showStageCoachAndHorses();

	this.showingLevelScreenTimer = this.game.time.clock.createTimer('showingLevelScreenTimer',10,0,false);
	this.showingLevelScreenTimerEvent = this.showingLevelScreenTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.showLevelScreen,this);
	
	this.showingLevelScreenTimer.start();	

	//this.showLevelScreen();

}

gameState.addBonusIcons = function(){
	for(var i = 0; i < this.bonusGroup.members.length; i++){
		var bonus = this.bonusGroup.members[i];
		bonus.alpha = 0; 
		bonus.scaleX = 3;
		bonus.scaleY = 3;
		if(this.banditGroup.members[i].numberOfHearts == 1){
			bonus.visible = false;
		}else{
			bonus.animation.play('bonus' + this.banditGroup.members[i].numberOfHearts);
			bonus.visible = true;
			this.bonusTweens[i].to({alpha: 0.8, scaleX: 1, scaleY: 1}, 500, Kiwi.Animations.Tweens.Easing.Sinusoidal.Out, true);
		}
	}
}

gameState.addPointCounters = function(){
	totalPoints = [];
	var timePoints = Math.round(600.0/Math.exp(this.gameTimeSeconds/120));

	if(this.numPlayers == 1){
		var addWhat = 1;
	}else{
		var addWhat = 2;
	}
	for(var j = 0; j < this.banditGroup.members.length; j++){
		var moneyPoints = this.banditGroup.members[j].coinsCollected * this.banditGroup.members[j].numberOfHearts;
		var deathPoints = this.banditGroup.members[j].totalGhoulKills()*10;

		var moneyPointsArray = [Math.floor(moneyPoints/100), Math.floor((moneyPoints - 100*Math.floor(moneyPoints/100))/10), moneyPoints % 10];
		var startingIndex = this.getStartingIndex(moneyPointsArray);
		for (var i = 0; i < moneyPointsArray.length; i++){
			if(i >= startingIndex){
				this.betweenScreenGroup.members[(i+addWhat)*3+(j*9)].animation.play(''+moneyPointsArray[i]);
				this.betweenScreenGroup.members[(i+addWhat)*3+(j*9)].visible = true;
			}else{
				this.betweenScreenGroup.members[(i+addWhat)*3+(j*9)].visible = false;
			}
		}
		var deathPointsArray = [Math.floor(deathPoints/100), Math.floor((deathPoints - 100*Math.floor(deathPoints/100))/10), deathPoints % 10];
		var startingIndex = this.getStartingIndex(deathPointsArray);
		for (var i = 0; i < deathPointsArray.length; i++){
			if(i >= startingIndex){
				this.betweenScreenGroup.members[(i+addWhat)*3+1+(j*9)].animation.play(''+deathPointsArray[i]);
				this.betweenScreenGroup.members[(i+addWhat)*3+1+(j*9)].visible = true;
			}else{
				this.betweenScreenGroup.members[(i+addWhat)*3+1+(j*9)].visible = false;
			}
		}
		var timePointsArray = [Math.floor(timePoints/100), Math.floor((timePoints - 100*Math.floor(timePoints/100))/10), timePoints % 10];
		var startingIndex = this.getStartingIndex(timePointsArray);		
		for (var i = 0; i < timePointsArray.length; i++){
			if(i >= startingIndex){
				this.betweenScreenGroup.members[(i+addWhat)*3+2+(j*9)].animation.play(''+timePointsArray[i]);
				this.betweenScreenGroup.members[(i+addWhat)*3+2+(j*9)].visible = true;
			}else{
				this.betweenScreenGroup.members[(i+addWhat)*3+2+(j*9)].visible = false;
			}
		}	
		totalPoints[j] = moneyPoints + deathPoints + timePoints; 
	}
	return totalPoints;
}

gameState.getStartingIndex = function(threeArray){
	if(threeArray[0]>0){
		return 0;
	}else if(threeArray[1]>0){
		return 1;
	}else if(threeArray[2]>0){
		return 2;
	}else{
		return 3; 
	}
}

gameState.updateBigCoinCounter = function(){
	this.bigCoinCounterStep = 6;
	var bigDigits = this.bigDigitGroup.members;
	for(var i = 0; i < bigDigits.length; i++){
		bigDigits[i].animation.play('cycle');
	}
	
	this.bigCoinTimer = this.game.time.clock.createTimer('bigCoin',.1,6,false);
	this.bigCoinTimerEvent = this.bigCoinTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.tickBigCoinCounter, this);
	this.bigCoinTimer.start();
}

gameState.tickBigCoinCounter = function(){
	var bandits = this.banditGroup.members;	
	for(var i =0; i <bandits.length; i++){
		this.stepBigCoinCounter(bandits[i], this.bigCoinCounterStep);
		this.stepBigCoinCounter(bandits[i], this.bigCoinCounterStep);
	}	
	this.bigCoinCounterStep--;
}

gameState.stepBigCoinCounter = function(bandit, bigCoinCounterStep){
	var value = Math.floor(bandit.totalCoinsCollected/(Math.pow(10,bigCoinCounterStep-1)))% 10;
	bigDigits = this.bigDigitGroup.members;
	for(var i = 0; i<bigDigits.length; i++){
		if(bigDigits[i].color == bandit.color){
			if(bigDigits[i].index == bigCoinCounterStep){
				bigDigits[i].animation.play(value.toString());
			}
		}
	}
}

gameState.onLevelScreenInComplete = function(){
	var members = this.members;
	for(var i = 0; i<members.length; i++){
		if(members[i].objType()!='Group' && members[i].name!='menu'){
			 if(members[i].name!='levelScreen'){
				members[i].destroy();
			}
		}
	}
	this.iconsDuringLevelScreen();
}

gameState.iconsDuringCutScene = function(){
	this.bigDigitGroup.visible = true;
	this.betweenScreenGroup.visible = true;
	this.digitGroup.visible = false;
	this.timerDigitGroup.visible = false;
	this.bombIconGroup.visible = false;
	for (var i = 0; i < this.ghoulKillCountGroup.length; i++){
		this.ghoulKillCountGroup[i].visible = false;
	}
}

gameState.iconsDuringLevelScreen = function(){
	this.bigDigitGroup.visible = false;
	this.betweenScreenGroup.visible = false;
}

gameState.iconsNotDuringCutscene = function(){
	this.digitGroup.visible = true;
	this.timerDigitGroup.visible = true;
	this.bombIconGroup.visible = true;
	this.bigDigitGroup.visible = false;
	this.betweenScreenGroup.visible = false;	
	for (var i = 0; i < this.ghoulKillCountGroup.length; i++){
		this.ghoulKillCountGroup[i].visible = true;
	}	
}

gameState.showStageCoachAndHorses = function(){
	this.horseGroup.active = true;
	this.horseGroup.visible = true;
	this.redHorse.x = -1200;
	if(this.numPlayers == 2){
		this.blueHorse.x = -1000;
	}
	this.stageCoach.x = -500;
}

gameState.moveBanditsOffscreen = function(){
	for(var i = 0; i<this.banditGroup.members.length; i++){
		this.banditGroup.members[i].x = this.bps * (this.GRID_COLS + 2);
	}
}

gameState.destroyEverything = function(removeBackground){
	this.destroyAllMembersOfGroup('ghoul');
	this.destroyAllMembersOfGroup('coin');
	this.destroyAllMembersOfGroup('potion');
	this.destroyAllMembersOfGroup('bomb');
	this.destroyAllMembersOfGroup('hiddenBlock');
	this.destroyAllMembersOfGroup('cracks');
	if(removeBackground){
		this.removeBackgroundImages(false);	
	}else{
		this.removeBackgroundImages(true);
	}
}

gameState.removeBackgroundImages = function(leaveBackground){
	leaveBackground = typeof leaveBackground !== 'undefined' ? leaveBackground : false;
	var members = this.members;
	for(var i = 0; i<members.length; i++){
		if(members[i].objType()!='Group' && members[i].name!='menu'){
			if(leaveBackground){
			  	if(members[i].name!='background'){
					members[i].destroy();
				}
			}else{
				members[i].destroy(); 
			}
		}
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
			break;
		case 'cracks':
			var members = this.cracksGroup.members;	
			break;
		case 'potion':
			var members = this.potionGroup.members;
			break;
	}
	for (var i =0; i<members.length; i++){
		members[i].destroy();
	}

}

gameState.isLevelOver = function(){
	if(this.coinGroup.members.length==0){
		if(this.soundsOn){	
			if(this.rideOutPlayed == false){
				this.voicesSound.play('rideOut',false);
				this.rideOutPlayed = true;
			}
		}
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
		if(this.musicOn){
			this.musicSound.stop();
		}
		this.addChild(this.loseScreen);
	}
}

gameState.getArrayIndexFromRowCol = function(row, col){
	return (row)*this.GRID_COLS + col + (this.GRID_COLS+1) + (row+1);
}

gameState.getArrayIndexForTilemapFromRowCol = function(row, col){
	return (row)*this.GRID_COLS + col;
}

gameState.blastBlock = function(blastedBlockPosition, banditColor){
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
		var hiddenBlock = this.addHiddenBlock(blastedBlockPosition);
		hiddenBlock.blastedBy = banditColor;
		this.updateBlocksAfterAddingHiddenBlock(hiddenBlock);

		if(hiddenBlock.row > 0){
			if(this.groundBlocks[hiddenBlock.row - 1][hiddenBlock.col] == 0){
				var index = this.getArrayIndexForTilemapFromRowCol(hiddenBlock.row - 1, hiddenBlock.col);
				var tileTypeAbove = this.tilemap.layers[5].getTileFromIndex(index)
				hiddenBlock.tileTypeAboveFront = (tileTypeAbove.index);
				this.tilemap.layers[5].setTileByIndex(index, 0);
				this.tilemap.layers[5].dirty = true;
				var tileTypeAbove = this.tilemap.layers[2].getTileFromIndex(index)
				hiddenBlock.tileTypeAboveBack = (tileTypeAbove.index);		
				this.tilemap.layers[2].setTileByIndex(index, 0);
				this.tilemap.layers[2].dirty = true;	
			}
		}

		if(this.soundsOn){
			if(this.random.frac() <= 0.05){
				this.voicesSound.play('sixFeetUnder',true);
			}
		}
	}
}

gameState.addHiddenBlock = function(blockPosition){
	var pixels = this.getPixelPositionFromRowCol(blockPosition[0],blockPosition[1]);
	var hiddenBlock = new HiddenBlock(this, pixels[0],pixels[1]);
	hiddenBlock.animation.add('hide',[this.getArrayIndexFromRowCol(blockPosition[0],blockPosition[1])],0.1,false);
	hiddenBlock.animation.play('hide');
	this.hiddenBlockGroup.addChild(hiddenBlock);
	return hiddenBlock
}

gameState.updateBlocksAfterAddingHiddenBlock = function(hiddenBlock){
	this.removeFromGroundBlocks([hiddenBlock.row, hiddenBlock.col]);
	this.updateTopGroundBlocks();
	this.updateBlockedBlocks();	
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

gameState.mouseClicked = function(){
	if(this.isPaused == true){
		if(this.mouse.x > 250 && this.mouse.x < 750){
			if(this.mouse.x > 450 && this.mouse.x < 600){
				if(this.mouse.y > 620 && this.mouse.y < 680){
					this.closeMenu();
				}
			}
		}
	}
}

gameState.showPressUp = function(){
	this.pressUpSignTween.onComplete(function(){
		this.showingPressUp = true;
	}, this);	
	this.pressUpSignTween.to({alpha: 1}, 250, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
}

gameState.hidePressUp = function(){
	this.pressUpSignTween.onComplete(function(){
		this.showingPressUp = false;
	}, this);		
	this.pressUpSignTween.to({alpha: 0}, 1000, Kiwi.Animations.Tweens.Easing.Linear.Out, true);	
}

gameState.openTutorial = function(){
	this.tutorialSignTween.onComplete(function(){
		this.showingTutorial = true;
	}, this);		
	this.tutorialSignTween.to({y: 125}, 600, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
	this.pauseGame();
}

gameState.closeTutorial = function(){
	this.tutorialSignTween.onComplete(function(){
		this.showingTutorial = false;
	}, this);	
	this.tutorialSignTween.to({y: this.GRID_ROWS * this.bps}, 600, Kiwi.Animations.Tweens.Easing.Linear.Out, true);
	this.resumeGame();
}

gameState.closeMenu = function(param){
	this.menuGroup.active = false;
	if(param != 'noresume'){
		this.resumeGame();
	}
	this.menuArrowTween.to({alpha: 1}, 1000, Kiwi.Animations.Tweens.Easing.Linear.Out,true);
	this.menuTween.to({y: -800}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
	this.menuGroupTween.to({y: -800}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);		
}

gameState.checkIfOnSign = function(banditGridPosition){
	if(this.currentLevel <= 3){
		var signGridPosition = this.signGridPositions[this.currentLevel - 1];
		if(banditGridPosition[0] == signGridPosition[0] && banditGridPosition[1] == signGridPosition[1]){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

gameState.checkPressUp = function(){
	var bandits = this.banditGroup.members;
	var signGridPosition = this.signGridPositions[0];
	for (var i = 0; i < bandits.length; i++){
		banditGridPosition = this.getGridPosition(bandits[i].x, bandits[i].y, 'middle');
		if(banditGridPosition[0] == signGridPosition[0] && banditGridPosition[1] == signGridPosition[1]){
			return true;
		}
	}
	return false;
}

gameState.update = function(){
	if(this.isPaused == false){
		Kiwi.State.prototype.update.call(this);

		if(this.showingLevelScreen == false){
			this.checkCollisions();
			this.isLevelOver();
			this.isGameOver();

			if(this.currentLevel == 1){
				if(this.checkPressUp()){
					this.showPressUp();
				}else{
					if(this.showingPressUp == true){
						this.hidePressUp();
					}
				}
			}

			if(this.debugKey.isDown){
				console.log(this.getGridPosition(this.red.x, this.red.y, 'middle'))
			}
		
			if(this.mouse.isDown){
				this.game.fullscreen.launchFullscreen()
				if(this.gameIsOver){
					if(this.mouse.isDown){
						this.levelOver(true);
						this.game.input.mouse.reset();
					}						
				}
				if(this.mouse.y > this.bps*this.GRID_ROWS && this.mouse.x < 20){
					this.levelOver(true);
					this.game.input.mouse.reset();
				}
				if(this.mouse.y > this.bps*this.GRID_ROWS && this.mouse.x > 980){
					this.currentLevel = 15;
					this.levelOver(true);
					this.game.input.mouse.reset();
				}		
			}
		}
	}else if(this.showingTutorial){
		if(this.mouse.justReleased()){
			this.closeTutorial();
		}else if(this.game.input.keyboard.anyKeyJustPressed()){
			this.closeTutorial();
		}
	}else{
		//menu is down
		Kiwi.Group.prototype.update.call(this.menuGroup);
	}
	if(this.showingLevelScreen == false){
		if(this.mouse.isDown){
			if(this.mouse.x > 400 && this.mouse.x < 700 && this.mouse.y < 25 * this.MULTIPLIER){
				if(this.isPaused == false){
					this.menuGroup.active = true;
					this.pauseGame();
					this.menuArrow.alpha = 0;
					this.menuTween.to({y: -this.STAGE_Y_OFFSET}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
					this.menuGroupTween.to({y: -this.STAGE_Y_OFFSET}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
				}
				this.game.input.mouse.reset();
			}
		}
	}	
}

gameState.pauseGame = function(){
	this.isPaused = true;
	this.pauseAllTimers();
}

gameState.resumeGame = function(){
	this.isPaused = false;
	this.resumeAllTimers();
}

gameState.pauseAllTimers = function(){
	for (var i = 0; i < this.game.time.clock.timers.length; i++){
		this.game.time.clock.timers[i].pause();
	}
}

gameState.resumeAllTimers = function(){
	for (var i = 0; i < this.game.time.clock.timers.length; i++){
		this.game.time.clock.timers[i].resume();
	}	
}

gameState.buttonOnDownOnce0 = function(button){
	switch ( button.name ) {
		case "XBOX_A":
			this.red.goFire = true;
			this.gunSound.play('start',true);
			console.log('gun' + this.red.color);
			break;
		case "XBOX_B":
			this.red.goBomb = true;
			break;
		case "XBOX_X":
			this.red.goBomb = true;
			break;
		case "XBOX_Y":
			console.log('trying to launch full screen');
			this.game.fullscreen.launchFullscreen();
			break;
		case "XBOX_DPAD_LEFT":
			this.red.goLeft = true;
			this.red.goRight = false;
			break;
		case "XBOX_DPAD_RIGHT":
			this.red.goLeft = false;
			this.red.goRight = true;
			break;
		case "XBOX_DPAD_UP":
			this.red.goDown = false;
			this.red.goUp = true;
			break;
		case "XBOX_DPAD_DOWN":
			this.red.goDown = true;
			this.red.goUp = false;
			break;
		default:
			// Code
	}

}

gameState.buttonIsDown0 = function(button){
	switch ( button.name ) {
		case "XBOX_DPAD_LEFT":
			this.red.goLeft = true;
			this.red.goRight = false;
			break;
		case "XBOX_DPAD_RIGHT":
			this.red.goLeft = false;
			this.red.goRight = true;
			break;
		case "XBOX_DPAD_UP":
			this.red.goDown = false;
			this.red.goUp = true;
			break;
		case "XBOX_DPAD_DOWN":
			this.red.goDown = true;
			this.red.goUp = false;
			break;
		default:
			// Code
	}
}

gameState.buttonOnUp0 = function( button ){
	// console.log("UP:  ", button.name);
	switch ( button.name ) {
		case "XBOX_A":
			this.red.goFire = false;
			break;
		case "XBOX_B":
			this.red.goBomb = false;
			break;
		case "XBOX_X":
			this.red.goBomb = false;
			break;
		case "XBOX_Y":
			this.red.goBomb = false;
			break;
		case "XBOX_DPAD_LEFT":
			this.red.goLeft = false;
			this.red.goRight = false;
			break;
		case "XBOX_DPAD_RIGHT":
			this.red.goLeft = false;
			this.red.goRight = false;
			break;
		case "XBOX_DPAD_UP":
			this.red.goDown = false;
			this.red.goUp = false;	
			break;
		case "XBOX_DPAD_DOWN":
			this.red.goDown = false;
			this.red.goUp = false;	
			break;
		default:
			// Code
	}
}

gameState.buttonOnDownOnce1 = function(button){
	switch ( button.name ) {
		case "XBOX_A":
			this.blue.goFire = true;
			this.gunSound.play('start',true);
			console.log('blue gune')
			break;
		case "XBOX_B":
			this.blue.goBomb = true;
			break;
		case "XBOX_X":
			this.blue.goBomb = true;
			break;
		case "XBOX_Y":
			console.log('trying to launch full screen');
			this.game.fullscreen.launchFullscreen();
			break;
		case "XBOX_DPAD_LEFT":
			this.blue.goLeft = true;
			this.blue.goRight = false;
			break;
		case "XBOX_DPAD_RIGHT":
			this.blue.goLeft = false;
			this.blue.goRight = true;
			break;
		case "XBOX_DPAD_UP":
			this.blue.goDown = false;
			this.blue.goUp = true;
			break;
		case "XBOX_DPAD_DOWN":
			this.blue.goDown = true;
			this.blue.goUp = false;
			break;
		default:
			// Code
	}

}

gameState.buttonIsDown1 = function(button){
	switch ( button.name ) {
		case "XBOX_DPAD_LEFT":
			this.blue.goLeft = true;
			this.blue.goRight = false;
			break;
		case "XBOX_DPAD_RIGHT":
			this.blue.goLeft = false;
			this.blue.goRight = true;
			break;
		case "XBOX_DPAD_UP":
			this.blue.goDown = false;
			this.blue.goUp = true;
			break;
		case "XBOX_DPAD_DOWN":
			this.blue.goDown = true;
			this.blue.goUp = false;
			break;
		default:
			// Code
	}
}

gameState.buttonOnUp1 = function( button ){
	// console.log("UP:  ", button.name);
	switch ( button.name ) {
		case "XBOX_A":
			this.blue.goFire = false;
			break;
		case "XBOX_B":
			this.blue.goBomb = false;
			break;
		case "XBOX_X":
			this.blue.goBomb = false;
			break;
		case "XBOX_Y":
			this.blue.goBomb = false;
			break;
		case "XBOX_DPAD_LEFT":
			this.blue.goLeft = false;
			this.blue.goRight = false;
			break;
		case "XBOX_DPAD_RIGHT":
			this.blue.goLeft = false;
			this.blue.goRight = false;
			break;
		case "XBOX_DPAD_UP":
			this.blue.goDown = false;
			this.blue.goUp = false;	
			break;
		case "XBOX_DPAD_DOWN":
			this.blue.goDown = false;
			this.blue.goUp = false;	
			break;
		default:
			// Code
	}
}


gameState.checkController = function(bandit){
	if(bandit.color == 'red'){
		var index = 0;
	}else if(bandit.color =='blue'){
		var index = 1;
	}
	var leftright = this.game.gamepads.gamepads[index].axis0;
	var updown = this.game.gamepads.gamepads[index].axis1;

	if(leftright.value < 0){
		if(leftright.value < -0.5){
			if(Math.abs(updown.value) < 0.3 || Math.abs(leftright.value) > Math.abs(updown.value)){
				bandit.goLeft = true;
				bandit.goRight = false;
			}else{
				bandit.goLeft = false;
				bandit.goRight = false;
			}
		}else{
			if(leftright.value < -0.3){
				if(bandit.facing = 'right'){
					bandit.facing = 'left';
					bandit.goFire = false;
				}
			}
			bandit.goLeft = false;
			bandit.goRight = false;			
		}
	}else{
		if(leftright.value > 0.5){
			if(Math.abs(updown.value) < 0.3 || Math.abs(leftright.value) > Math.abs(updown.value)){
				bandit.goLeft = false;
				bandit.goRight = true;
			}else{
				bandit.goLeft = false;
				bandit.goRight = false;
			}
		}else{
			if(leftright.value > 0.3){
				if(bandit.facing = 'left'){
					bandit.facing = 'right';
					bandit.goFire = false;
				}
			}
			bandit.goLeft = false;
			bandit.goRight = false;			
		}
	}
	
	if(updown.value < 0){
		if(updown.value < -0.3){
			if(Math.abs(leftright.value) < 0.3 || Math.abs(updown.value) > Math.abs(leftright.value)){
				bandit.goDown = false;
				bandit.goUp = true;
			}else{
				bandit.goDown = false;
				bandit.goUp = false;
			}
		}else{
			bandit.goDown = false;
			bandit.goUp = false;			
		}
	}else{
		if(updown.value > 0.3){
			if(Math.abs(leftright.value) < 0.3 || Math.abs(updown.value) > Math.abs(leftright.value)){
				bandit.goDown = true;
				bandit.goUp = false;
			}else{
				bandit.goDown = false;
				bandit.goUp = false;
			}
		}else{
			bandit.goDown = false;
			bandit.goUp = false;			
		}
	}
}

