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
	this.soundOptions = this.game.soundOptions;

	this.STAGE_Y_OFFSET = 32 * this.MULTIPLIER;
	this.STAGE_X_OFFSET = 38 * this.MULTIPLIER;

	this.x = this.bps - this.STAGE_X_OFFSET;
	this.y = this.bps - this.STAGE_Y_OFFSET;

	this.GRID_ROWS = 15;
	this.GRID_COLS = 20;	

	myGame.stage.color = '000000';

	this.winScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['win'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);
	this.loseScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['lose'],-18*this.MULTIPLIER,-18*this.MULTIPLIER);

	this.curtainLeftX = -1 * this.STAGE_X_OFFSET/2;
	this.curtainRightX = 1000 - (50 - this.STAGE_X_OFFSET/2);
	this.curtainRight = new Kiwi.GameObjects.StaticImage(this, this.textures['curtain'], 1100, -18);
	this.curtainRight.scaleX = -1;
	this.curtainLeft = new Kiwi.GameObjects.StaticImage(this, this.textures['curtain'], -100, -18);
	this.curtainLeftTween = this.game.tweens.create(this.curtainLeft);
	this.curtainRightTween = this.game.tweens.create(this.curtainRight);

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

	this.availableMenuIcons = [0,1,2,3];
	this.availableMenuIconsIndex = 0;
	this.selectedIcon = null;

	this.menuGroup.y = -800;
	this.menuGroupTween = this.game.tweens.create(this.menuGroup);

	this.betweenScreenGroup = new Kiwi.Group(this);

	this.BETWEEN_SCREEN_SPACING = 80; 
	this.MONEY_YPOS = 124;
	this.DEATH_YPOS = this.MONEY_YPOS + this.BETWEEN_SCREEN_SPACING + 4;
	this.TIME_YPOS = this.DEATH_YPOS + this.BETWEEN_SCREEN_SPACING;		
	if(this.numPlayers == 1){
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'time', 310, this.TIME_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'death', 310, this.DEATH_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'money', 310, this.MONEY_YPOS));		
	}else{
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'time', 110, this.TIME_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'death', 110, this.DEATH_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'money', 110, this.MONEY_YPOS));	
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'time', 560, this.TIME_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'death', 560, this.DEATH_YPOS));
		this.betweenScreenGroup.addChild(new BetweenScreenIcon(this,'money', 560, this.MONEY_YPOS));	
	}

	//this.alphaBox = new Kiwi.GameObjects.StaticImage(this, this.textures['alphaBox'], 250, this.MONEY_YPOS-60);
	if(this.numPlayers == 1){
		var params = {state: this, width: 395, height: 398, centerOnTransform: false, x: 298, y: 114, alpha: 0.5, color: [1,1,1], strokeColor: [0,0,0], strokeWidth: 3};
		this.alphaBox = new Kiwi.Plugins.Primitives.Rectangle(params);
	
	}else{
		var params1 = {state: this, width: 365, height: 398, centerOnTransform: false, x: 93, y: 114, alpha: 0.5, color: [1,1,1], strokeColor: [0,0,0], strokeWidth: 3};
		var params2 = {state: this, width: 365, height: 398, centerOnTransform: false, x: 543, y: 114, alpha: 0.5, color: [1,1,1], strokeColor: [0,0,0], strokeWidth: 3};
		this.alphaBox = new Kiwi.Plugins.Primitives.Rectangle(params1);
		this.alphaBox2 = new Kiwi.Plugins.Primitives.Rectangle(params2);
	}

	this.iconGroup = new Kiwi.Group(this);
	this.iconTweens = [];

	this.playIcon = new Icon(this, 700, 600, 'play');
	this.iconGroup.addChild(this.playIcon);
	this.iconTweens.push(this.game.tweens.create(this.playIcon));
	this.homeIcon = new Icon(this, 200, 600, 'home');
	this.iconGroup.addChild(this.homeIcon);
	this.iconTweens.push(this.game.tweens.create(this.homeIcon));	
	this.restartIcon = new Icon(this, 450, 600, 'restart');
	this.iconGroup.addChild(this.restartIcon);
	this.iconTweens.push(this.game.tweens.create(this.restartIcon));


	this.availableBetweenScreenMenuIcons = [0,1,2];
	this.availableBetweenScreenMenuIconsIndex = 0;
	this.selectedBetweenScreenIcon = this.playIcon;

	this.bigDigitGroup = new Kiwi.Group(this);
	this.SCORE_LEVEL_YPOS = this.TIME_YPOS+ this.BETWEEN_SCREEN_SPACING +9; 
	this.SCORE_TOTAL_YPOS = this.SCORE_LEVEL_YPOS + this.BETWEEN_SCREEN_SPACING - 5; 
		
	if(this.numPlayers == 1){
		for(var i = 1; i < 6; i++){
			if(i > 1){
				var bigDigit = new BigDigit(this, 370+(i*52), this.SCORE_LEVEL_YPOS, 'red', 6-i, 'level');
				bigDigit.animation.play('cycle');
				this.bigDigitGroup.addChild(bigDigit);
			}
			var bigDigit2 = new BigDigit(this, 370+(i*52), this.SCORE_TOTAL_YPOS, 'red', 6-i, 'total');
			bigDigit2.animation.play('0');
			this.bigDigitGroup.addChild(bigDigit2);
			if(i>2){
				var bigDigit = new BigDigit(this, 370+(i*52), this.MONEY_YPOS+24, 'black', 'money'+(6-i));
				bigDigit.visible = false;
				this.betweenScreenGroup.addChild(bigDigit);
				var bigDigit = new BigDigit(this, 370+(i*52), this.DEATH_YPOS+19, 'black', 'death'+(6-i));
				bigDigit.visible = false;
				this.betweenScreenGroup.addChild(bigDigit);
				var bigDigit = new BigDigit(this, 370+(i*52), this.TIME_YPOS+14, 'black', 'time'+(6-i));
				bigDigit.visible = false;	
				this.betweenScreenGroup.addChild(bigDigit);							
			}
		}			
	}else{
		var colors = ['red','blue'];
		for (var j = 0; j < 2; j++){
			for(var i = 1; i < 6; i++){
				if(i>1){
					var bigDigit = new BigDigit(this, 120+(i*52)+(j*450), this.SCORE_LEVEL_YPOS, colors[j], 6-i, 'level');
					bigDigit.animation.play('cycle');
					this.bigDigitGroup.addChild(bigDigit);
				}
				var bigDigit2 = new BigDigit(this, 120+(i*52)+(j*450), this.SCORE_TOTAL_YPOS, colors[j], 6-i, 'total');
				bigDigit2.animation.play('0');
				this.bigDigitGroup.addChild(bigDigit2);			
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
		var bonusRed = new BetweenScreenIcon(this, 'bonus', 383, this.MONEY_YPOS + 10);
		this.bonusGroup.addChild(bonusRed);
		this.bonusTweens.push(this.game.tweens.create(bonusRed));
	}else{
		var bonusRed = new BetweenScreenIcon(this, 'bonus', 183, this.MONEY_YPOS + 10);
		var bonusBlue = new BetweenScreenIcon(this, 'bonus', 633, this.MONEY_YPOS + 10);
		this.bonusGroup.addChild(bonusRed);
		this.bonusGroup.addChild(bonusBlue);
		this.bonusTweens.push(this.game.tweens.create(bonusRed));
		this.bonusTweens.push(this.game.tweens.create(bonusBlue));
	}

	this.destroyingNow = false;

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
	this.redHorse = new Horse(this, this.bps*(this.GRID_COLS+2), 580);
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

	this.alphaBoxGroup = new Kiwi.Group(this);
	this.alphaBoxGroup.addChild(this.alphaBox);
	if(this.numPlayers == 2){
		this.alphaBoxGroup.addChild(this.alphaBox2);
	}

	var starXPositions = [317, 450, 582];
	this.stars = [];
	this.starTweens = [];
	this.starTweens2 = [];
	for(var i = 0; i < starXPositions.length; i++){
		var star = new BetweenScreenStar(this, starXPositions[i], 5);
		this.starTweens.push(this.game.tweens.create(star));
		this.starTweens2.push(this.game.tweens.create(star));
		this.stars.push(star);
		this.horseGroup.addChild(star);
	}

	this.cloudGroup = new Kiwi.Group(this);
	for(var i = 1; i <= 10; i++){
		this.cloudGroup.addChild(new Cloud(this, i));
	}

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

	for(var i =1; i<=3; i++){
		var redHeart = new Heart(this, 'red', i);
		this.redHeartsGroup.addChild(redHeart);
		
		if(this.numPlayers == 2){
			var blueHeart = new Heart(this, 'blue', i);
			this.blueHeartsGroup.addChild(blueHeart);
		}
	}

	this.banditFlashGroup = new Kiwi.Group(this);
	this.banditFlashGroup.addChild(new Flash(this, this.red));
	this.red.flash = this.banditFlashGroup.members[0];
	if(this.numPlayers == 2){
		this.banditFlashGroup.addChild(new Flash(this, this.blue));
		this.blue.flash = this.banditFlashGroup.members[1];
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
	this.bombSound.addMarker('start',0,1,false);
	this.coinSound = new Kiwi.Sound.Audio(this.game, 'coinSound', 0.1, false);
	this.coinSound.addMarker('start',0,1,false);
	this.gunSound = new Kiwi.Sound.Audio(this.game, 'gunSound', 0.1, false);
	this.gunSound.addMarker('start',0,1,false);
	this.shotgunSound = new Kiwi.Sound.Audio(this.game, 'shotgunSound', 0.05, false);
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

	this.wagonSound = new Kiwi.Sound.Audio(this.game, 'wagonSound', 0.2, false);
	this.wagonSound.addMarker('start', 1, 15, false);

	this.horseGallopSound = new Kiwi.Sound.Audio(this.game, 'horseGallopSound', 1, false);
	this.horseGallopSound.addMarker('start', 0, 8, false);
	this.horseGallopSound2 = new Kiwi.Sound.Audio(this.game, 'horseGallopSound', 1, false);
	this.horseGallopSound2.addMarker('start', 0, 8, false);

	this.flipSound = new Kiwi.Sound.Audio(this.game, 'flipSound', 0.3, true);
	this.dingSound = new Kiwi.Sound.Audio(this.game, 'dingSound', 0.1, false);
	this.dingSound.addMarker('start', 0, 0.8, false);
	this.starSound = new Kiwi.Sound.Audio(this.game, 'starSound', 0.3, false);
	this.starSound.addMarker('start', 0, 1, false);
	this.starDingSound = new Kiwi.Sound.Audio(this.game, 'starDingSound', 0.2, false);
	this.starDingSound.addMarker('start', 0, 1, false);

	this.whiskeySound = new Kiwi.Sound.Audio(this.game, 'whiskeySound', 0.3, false);
	this.evilLaughSound = new Kiwi.Sound.Audio(this.game, 'evilLaughSound', 0.3, false);

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

	this.musicSound1 = new Kiwi.Sound.Audio(this.game, 'musicSound1', 0.2, true);
	this.musicSound2 = new Kiwi.Sound.Audio(this.game, 'musicSound2', 0.2, true);
	this.musicSound3 = new Kiwi.Sound.Audio(this.game, 'musicSound3', 0.7, true);
	this.musicSoundList = [this.musicSound1, this.musicSound2, this.musicSound3];

	this.beginningLevelVoices = ['critters','dontTread','killAllThemGhouls','westBest'];

	this.gameTimer = this.game.time.clock.createTimer('updateTimer',1,-1,false);
	this.gameTimerEvent = this.gameTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.updateTimer, this);
	this.gameTimer.start();
	this.gameTimer.pause();

	this.pressUpSignLocations = [[515, 650], [515, 650], [165, 650]];
	this.signGridPositions = [[14, 12], [14, 12], [14, 5]];

	this.pointThresholds = [
	[
		[100, 600, 750], //  1
		[100, 400, 740], //
		[100, 400, 719], //
		[100, 400, 800], 
		[100, 400, 920], 
		[100, 400, 800], //  6
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], //  11
		[100, 400, 1000], 
		[100, 400, 680], 
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 930], //  16
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 										
	],
	[		
		[100, 400, 790], //  1
		[100, 400, 765], 
		[100, 400, 750], 
		[100, 400, 780], 
		[100, 400, 1200], 
		[100, 400, 1200], //  6
		[100, 400, 1300], 
		[100, 400, 1300], 
		[100, 400, 1300], 
		[100, 400, 800], 
		[100, 400, 800], //  11
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], //  16
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 
		[100, 400, 800], 	
	]
	];

	this.timePointsFactor = [100, 100, 100, 100, 100, 110, 120, 130, 140, 150, 
							160, 170, 180, 200, 320, 340, 340, 350, 360, 400,
							400];

	this.showLevelScreen();
	
	
}

gameState.showLevelScreen = function(){
	this.showingLevelScreen = true;
	this.horseGroup.visible = false;
	this.iconGroup.active = false;

	this.levelScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['level'+this.currentLevel],0,-18*this.MULTIPLIER);
	this.levelScreen.x = -1024;
	this.levelScreen.name = 'levelScreen';
	this.addChild(this.levelScreen);

	this.levelScreenTweenIn = this.game.tweens.create(this.levelScreen, this);
	this.levelScreenTweenOut = this.game.tweens.create(this.levelScreen, this);
	this.levelScreenTweenIn.to({ x: 0 }, 700, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	this.levelScreenTweenOut.to({ x: 1124 }, 700, Kiwi.Animations.Tweens.Easing.Cubic.Out);

	this.levelScreenTweenIn.onComplete(this.onLevelScreenInComplete, this);
	this.levelScreenTweenOut.onComplete(this.createLevel, this);

	this.levelScreenTweenIn.chain(this.levelScreenTweenOut);
	this.levelScreenTweenIn.start();
}

gameState.createLevel = function(){
	if(this.game.gamepads){
		this.removeAllGamepadSignals();
		this.addGamepadSignalsGame();
	}
	
	this.destroyingNow = false;

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
								this.turbo = ghoul;
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
	for(var i = 0; i < this.redHeartsGroup.members.length; i++){
		this.redHeartsGroup.members[i].banditX = this.red.startingPixelLocations[0];
		this.redHeartsGroup.members[i].banditY = this.red.startingPixelLocations[1];
		this.redHeartsGroup.members[i].shouldBeGone = false;
		this.redHeartsGroup.members[i].timerStarted = false;		
		this.redHeartsGroup.members[i].showSelf();
	}
		
	if(this.numPlayers==2){
		this.blue.resetPropertiesAtBeginningOfLevel();
		this.updateCoinCounter(this.blue);
		this.updateBombCounter(this.blue);
		for(var i = 0; i < this.blueHeartsGroup.members.length; i++){
			this.blueHeartsGroup.members[i].banditX = this.blue.startingPixelLocations[0];
			this.blueHeartsGroup.members[i].banditY = this.blue.startingPixelLocations[1];	
			this.blueHeartsGroup.members[i].shouldBeGone = false;
			this.blueHeartsGroup.members[i].timerStarted = false;		
			this.blueHeartsGroup.members[i].showSelf();
		}	
	}

	this.removeGhoulDots();


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
	this.originalTopGroundBlocks = this.getTopBlocks(this.originalGroundBlocks);

	this.leftBlockedBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	this.rightBlockedBlocks = this.make2DArray(this.GRID_ROWS, this.GRID_COLS);
	this.topGroundBlocks = this.getTopBlocks(this.groundBlocks);

	this.updateTopGroundBlocks();
	this.updateBlockedBlocks();
	
	this.ghoulBlocks = this.getGhoulBlocks();


	this.removeBackgroundImages();

	var params1 = {state: this, width: this.STAGE_X_OFFSET, height: 768, x: -1* this.STAGE_X_OFFSET, y: -1*this.STAGE_Y_OFFSET, color: [0,0,0], strokeColor: [0,0,0], strokeWidth: 0};
	var params2 = {state: this, width: this.STAGE_X_OFFSET, height: 768, x: 1000, y: -1*this.STAGE_Y_OFFSET, color: [0,0,0], strokeColor: [0,0,0], strokeWidth: 0}; 
	this.blackSide1 = new Kiwi.Plugins.Primitives.Rectangle(params1);
	this.blackSide2 = new Kiwi.Plugins.Primitives.Rectangle(params2);

	this.addChild(this.background);
	this.resetClouds();
	this.addChild(this.cloudGroup);
	this.addChild(this.blackSide1);
	this.addChild(this.blackSide2);
		
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.cracksGroup);	
	this.addChild(this.hiddenBlockGroup);	
	this.addChild(this.tilemap.layers[1]);
	this.addChild(this.tilemap.layers[2]);

	this.addChild(this.coinGroup);
	this.addChild(this.potionGroup);
	this.addChild(this.ghoulGroup);
	this.addChild(this.banditGroup);
	this.addChild(this.banditFlashGroup);

	//this.addChild(this.ghouliath);


	this.addChild(this.tilemap.layers[5]);
	this.addChild(this.bombGroup);

	this.addChild(this.redHeartsGroup);
	if(this.numPlayers == 2){
		this.addChild(this.blueHeartsGroup);
	}	

	
	this.addChild(this.alphaBoxGroup);
	this.iconsNotDuringCutscene();
	this.betweenScreenGroup.addChild(this.bonusGroup);
	this.addChild(this.betweenScreenGroup);
	this.addChild(this.bigDigitGroup);

	this.addChild(this.horseGroup);
	this.horseGroup.active = false;
	this.horseGroup.visible = false;

	this.addChild(this.digitGroup);
	this.addChild(this.bombIconGroup);
	this.addChild(this.timerDigitGroup);
	this.timerDigitGroup.x = 920;
	for (var i = 0; i < this.ghoulKillCountGroup.length; i++){
		this.addChild(this.ghoulKillCountGroup[i]);
	}


	this.addChild(this.menuArrow);
	this.addChild(this.menuBackground);
	this.addChild(this.menuGroup);
	this.addChild(this.background2);

	this.addChild(this.iconGroup);
	this.horseGroup.addChild(this.curtainRight);
	this.horseGroup.addChild(this.curtainLeft);

	if(this.currentLevel <= 3){
		this.addChild(this.pressUpSign);		
		this.addChild(this.tutorialSign);
	}

	this.rideOutPlayed = false;
	if(this.soundOptions.soundsOn){
		var toPlay = this.beginningLevelVoices[this.random.integerInRange(0,this.beginningLevelVoices.length)];
		this.voicesSound.play(toPlay,true);
	}	
	
	this.timer = this.game.time.clock.createTimer('levelOver',2,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.levelOver,this);

	if(this.currentLevel > 19){
		this.bossMusicSound = new Kiwi.Sound.Audio(this.game, 'bossMusicSound', 0.2, true);
	}
	
	if(this.currentLevel < 20){
		this.currentMusic = this.musicSoundList[this.currentLevel % 3];
	}else{
		this.currentMusic = this.bossMusicSound;
	}

	if(this.soundOptions.musicOn){
		this.currentMusic.play();
	}
	
	this.gameTimeSeconds = 0;
	if(this.numPlayers==1){
		for (var i = 0; i < this.timerDigitGroup.members.length; i++){
			this.timerDigitGroup.members[i].resetCounter();
		}
	}
	this.gameTimer.resume();

	this.resumeGame();

	this.showingLevelScreen = false;
	this.showingTutorial = false;
	this.showingPressUp = false;
}

gameState.resetClouds = function(){
	var randomInt = this.random.integerInRange(0, 2);
	if(randomInt == 0){
		var direction = -1;
	}else{
		var direction = 1;
	}

	for (var i = 0; i < this.cloudGroup.members.length; i++){
		if(this.random.frac() < 0.2){
			this.cloudGroup.members[i].visible = true;
			this.cloudGroup.members[i].active = true;
		}else{
			this.cloudGroup.members[i].visible = false;
			this.cloudGroup.members[i].active = false;
		}
		this.cloudGroup.members[i].direction = direction;
		this.cloudGroup.members[i].randomSpeedAndY();
		this.cloudGroup.members[i].randomX();
		this.cloudGroup.members[i].randomScale();
	}
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
	if(this.numPlayers == 2){
		if(keyCode == this.blue.fireKey.keyCode){
			if(!this.isPaused && !this.showingLevelScreen && this.blue.isAlive){
				if(this.soundOptions.soundsOn){
					this.gunSound.play('start', true);
				}
				this.blue.blastBlock();
			}
		}
	}

	if(keyCode == this.red.fireKey.keyCode){
		if(!this.isPaused && !this.showingLevelScreen && this.red.isAlive){
			if(this.soundOptions.soundsOn){
				this.gunSound.play('start', true);
			}
			this.red.blastBlock();
		}
	}

	if(keyCode == Kiwi.Input.Keycodes.T){
		this.launchFullscreen();
	}
	if(keyCode == Kiwi.Input.Keycodes.U){
		this.logAllTimers();
	}
	if(keyCode == Kiwi.Input.Keycodes.P){
		if(!this.isPaused){
			this.openMenu();
			this.availableMenuIconsIndex = 0;
			this.selectedIcon = this.menuGroup.members[this.availableMenuIconsIndex];
			this.menuGroup.members[this.availableMenuIconsIndex].playHover();
		}else{
			this.selectedIcon.playOff();
			this.closeMenu();
		}
	}

	if(this.isPaused){
		if(keyCode == Kiwi.Input.Keycodes.UP || keyCode == Kiwi.Input.Keycodes.W){
			this.backwardMenuIcon();
		}else if(keyCode == Kiwi.Input.Keycodes.DOWN || keyCode == Kiwi.Input.Keycodes.S){
			this.forwardMenuIcon();
		}else if(keyCode == Kiwi.Input.Keycodes.SPACEBAR || keyCode == Kiwi.Input.Keycodes.ENTER){
			if(this.selectedIcon){
				this.selectedIcon.mouseClicked();
			}
		}		
	}
	
	if(this.gameIsOver){
		if(keyCode == Kiwi.Input.Keycodes.SPACEBAR || keyCode == Kiwi.Input.Keycodes.ENTER){
			this.levelOver(false);		
		}		
	}
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
						if(this.soundOptions.soundsOn){
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
						if(this.soundOptions.soundsOn){
							this.whiskeySound.play();
						}
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
					if(this.soundOptions.soundsOn){
						this.diamondSound.play('start',true);
					}
				}else{
					bandits[j].coinsCollected ++;
					if(this.soundOptions.soundsOn){
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
					if(this.soundOptions.soundsOn){
						this.banditDeathSound.play('start',false);
					}
					bandits[j].isAlive = false;
					if(ghouls[i].objType() == 'Bullet'){
						ghouls[i].explode();
					}
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
			if(this.originalTopGroundBlocks[i][j]==1){
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

gameState.updateGhoulBlocks = function(){
	for (var i = 0; i<this.GRID_ROWS; i++){
		for (var j = 0; j<this.GRID_COLS; j++){
			var ghoulCode = 1; 
			if(this.originalTopGroundBlocks[i][j]==1){
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

			this.ghoulBlocks[i][j] = ghoulCode; 
		}
	}	
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

gameState.getBlockedBlocks = function(groundBlocks, direction, blockedBlocks){
	switch (direction){
		case 'left': 
			for(var i = 0;i<this.GRID_ROWS; i++){
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

gameState.getBlastedBlockPosition = function(gridPosition, facing){
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
			this.unlockLevel(this.currentLevel);
			if(showCutScene){
				this.showingLevelScreen = true;	
				this.background2Tween.start();
			}else{
				this.showLevelScreen();
			}
		}
	}
}

gameState.unlockLevel = function(level){
	if(level <= 20){
		this.game.levelsData[level-1][this.numPlayers-1].unlocked = true;
		this.game.saveManager.localStorage.edit('levelsData', this.game.levelsData, true );
	}
}

gameState.setHighScoreOnePlayer = function(levelScore){
	console.log(levelScore);
	if(this.currentLevel <= 21){
		if(levelScore > this.game.levelsData[this.currentLevel-2][this.numPlayers-1].highScore){
			this.game.levelsData[this.currentLevel-2][this.numPlayers-1].highScore = levelScore;
			this.game.saveManager.localStorage.edit('levelsData', this.game.levelsData, true);
		}
	}
	console.log(this.game.levelsData);
}

gameState.setHighScoreTwoPlayer = function(levelScore1, levelScore2){
	console.log(levelScore1 + ' ' + levelScore2);

	if(this.currentLevel <= 21){
		if(levelScore1 > this.game.levelsData[this.currentLevel-2][this.numPlayers-1].highScore1){
			this.game.levelsData[this.currentLevel-2][this.numPlayers-1].highScore1 = levelScore1;
			this.game.saveManager.localStorage.edit('levelsData', this.game.levelsData, true);
		}
		if(levelScore2 > this.game.levelsData[this.currentLevel-2][this.numPlayers-1].highScore2){
			this.game.levelsData[this.currentLevel-2][this.numPlayers-1].highScore2 = levelScore2;
			this.game.saveManager.localStorage.edit('levelsData', this.game.levelsData, true);
		}		
	}	
	console.log(this.game.levelsData);

}

gameState.setStarsForPreviousLevel = function(stars){
	if(this.currentLevel <= 21){
		this.game.levelsData[this.currentLevel-2][this.numPlayers-1].stars = stars;
		this.game.saveManager.localStorage.edit('levelsData', this.game.levelsData, true );
	}
}

gameState.getTotalScores = function(){
	var totalScores = [0, 0];
	if(this.numPlayers == 1){
		for(var i = 0; i < this.currentLevel - 1; i++){
			totalScores[0] += this.game.levelsData[i][0].highScore;
		}
	}else{
		for(var i = 0; i < this.currentLevel - 1; i++){
			totalScores[0] += this.game.levelsData[i][1].highScore1;
			totalScores[1] += this.game.levelsData[i][1].highScore2;
		}
	}
	return totalScores;
}

gameState.showCutScene = function(){
	this.destroyEverything(false);

	if(this.soundOptions.musicOn){
		this.currentMusic.stop();
	}

	var members = this.banditGroup.members;
	for(var i = 0; i<members.length; i++){
		members[i].totalCoinsCollected += members[i].coinsCollected;
	}

	this.iconsDuringCutScene();
	var totalPoints = this.addPointCounters();	
	for(var i =0; i<members.length; i++){
		members[i].totalCoinsCollected = totalPoints[i];		
	}

	if(this.numPlayers == 1){
		var previousLevelPoints = totalPoints[0]
		this.setHighScoreOnePlayer(totalPoints[0]);
	}else{
		var previousLevelPoints = totalPoints[0] + totalPoints[1];
		this.setHighScoreTwoPlayer(totalPoints[0], totalPoints[1]);
	}
		
	if(previousLevelPoints > this.pointThresholds[this.numPlayers-1][this.currentLevel-2][2]){
		this.setStarsForPreviousLevel(3);
		this.showStars(3);
	}else if(previousLevelPoints > this.pointThresholds[this.numPlayers-1][this.currentLevel-2][1]){
		this.setStarsForPreviousLevel(2);
		this.showStars(2);
	}else if(previousLevelPoints > this.pointThresholds[this.numPlayers-1][this.currentLevel-2][0]){
		this.setStarsForPreviousLevel(1);
		this.showStars(1);
	}else{
		this.setStarsForPreviousLevel(0);
	}

	this.addBonusIcons();
	
	this.updateBigCoinCounter();

	this.totalScores = this.getTotalScores();
	this.updateBigCoinCounterTotalTimer = this.game.time.clock.createTimer('updateBigCoinTotal', 3, 0, false);
	this.updateBigCoinCounterTotalTimerEvent = this.updateBigCoinCounterTotalTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.updateBigCoinCounterTotal, this);
	this.updateBigCoinCounterTotalTimer.start();

	if(this.game.gamepads){
		this.removeAllGamepadSignals();
		this.addGamepadSignalsBetweenScreen();
	}

	this.moveBanditsOffscreen();
	this.tweenInCurtains();
	this.showStageCoachAndHorses();



	this.showIconsTimer = this.game.time.clock.createTimer('showIconsTimer',7,0,false);
	this.showIconsTimerEvent = this.showIconsTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.addIcons,this);
	
	this.showIconsTimer.start();	
}

gameState.showStars = function(numStars){
	this.stars[0].visible = false;
	this.stars[1].visible = false;
	this.stars[2].visible = false;

	console.log('showing stars ' + numStars)
	this.showStarsIndex = 0;
	this.showStarsTimer = this.game.time.clock.createTimer('showStarsTimer', 0.5, numStars, false);
	this.showStarsTimerEvent = this.showStarsTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.tickStars, this);
	this.showStarsTimer.start();
}

gameState.tickStars = function(){
	this.stars[this.showStarsIndex].visible = true;
	this.stars[this.showStarsIndex].scaleX = 0;
	this.stars[this.showStarsIndex].scaleY = 0;
	this.stars[this.showStarsIndex].rotation = -1 * Math.PI;
	this.starTweens[this.showStarsIndex].to({scaleX: 2.5, scaleY: 2.5, rotation: 0}, 300, Kiwi.Animations.Tweens.Easing.Cubic.Out, false);
	this.starTweens2[this.showStarsIndex].to({scaleX: 1.0, scaleY: 1.0}, 500, Kiwi.Animations.Tweens.Easing.Bounce.Out, false);
	this.starTweens[this.showStarsIndex].chain(this.starTweens2[this.showStarsIndex]);
	this.starTweens[this.showStarsIndex].onComplete(function(){
		if(this.soundOptions.soundsOn){
			this.starDingSound.play('start', true);
		}
	}, this);
	this.starTweens[this.showStarsIndex].start();
	this.showStarsIndex++;
	if(this.soundOptions.soundsOn){
		this.starSound.play('start', true);
	}	
}

gameState.tweenInCurtains = function(){
	this.curtainRightTween.onComplete(null, null);
	this.curtainLeftTween.to({x: this.curtainLeftX}, 250, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);	
	this.curtainRightTween.to({x: this.curtainRightX}, 250, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
}

gameState.tweenOutCurtains = function(onCompleteCallback){
	this.curtainRightTween.onComplete(onCompleteCallback, this);
	this.curtainLeftTween.to({x: -100}, 250, Kiwi.Animations.Tweens.Easing.Cubic.In, true);	
	this.curtainRightTween.to({x: 1100}, 250, Kiwi.Animations.Tweens.Easing.Cubic.In, true);	
}

gameState.restartLevel = function(){
	this.destroyEverything(false);
	this.levelOver(false);
}

gameState.switchToTitleStateFromBetweenScreen = function(){
	this.destroyEverything(true);
	this.gameTimer.removeTimerEvent(this.gameTimerEvent);
	this.game.states.switchState('titleState');
}

gameState.switchToState = function(stateName){
	this.destroyEverything(true);
	this.gameTimer.removeTimerEvent(this.gameTimerEvent);
	this.game.states.switchState(stateName);
}

gameState.addIcons = function(){
	this.iconGroup.active = true;
	this.iconGroup.visible = true;
	for(var i = 0; i < this.iconGroup.members.length; i++){
		var icon = this.iconGroup.members[i];
		icon.alpha = 0;
		icon.scaleX = 3;
		icon.scaleY = 3;
		if(icon.type == 'play'){
			this.iconTweens[i].to({alpha: 1, scaleX: 1, scaleY: 1}, 500, Kiwi.Animations.Tweens.Easing.Sinusoidal.Out, true);
		}else{
			this.iconTweens[i].to({alpha: 0.3, scaleX: 1, scaleY: 1}, 500, Kiwi.Animations.Tweens.Easing.Sinusoidal.Out, true);
		}
	}
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
	var factor = this.timePointsFactor[this.currentLevel - 2];
	var timePoints = Math.round(600.0/Math.exp(this.gameTimeSeconds/factor));

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
	
	this.bigCoinTimer = this.game.time.clock.createTimer('bigCoin',0.1,6,false);
	this.bigCoinTimerEvent = this.bigCoinTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.tickBigCoinCounter, this);
	this.bigCoinTimer.start();
	if(this.soundOptions.soundsOn){
		this.flipSound.play();
	}
}

gameState.tickBigCoinCounter = function(){
	var bandits = this.banditGroup.members;	
	for(var i =0; i <bandits.length; i++){
		this.stepBigCoinCounter(bandits[i], this.bigCoinCounterStep);
	}	
	this.bigCoinCounterStep--;
}

gameState.stepBigCoinCounter = function(bandit, bigCoinCounterStep){
	var value = Math.floor(bandit.totalCoinsCollected/(Math.pow(10,bigCoinCounterStep-1)))% 10;
	bigDigits = this.bigDigitGroup.members;
	for(var i = 0; i<bigDigits.length; i++){
		if(bigDigits[i].color == bandit.color){
			if(bigDigits[i].index == bigCoinCounterStep && bigDigits[i].type == 'level'){
				bigDigits[i].animation.play(value.toString());
			}
		}
	}
	if(this.soundOptions.soundsOn){
		if(this.bigCoinCounterStep <= 4){
			this.dingSound.play('start', true);
		}
	}
}

gameState.updateBigCoinCounterTotal = function(){
	this.bigCoinCounterStepTotal = 6;
	var bigDigits = this.bigDigitGroup.members;
	for(var i = 0; i < bigDigits.length; i++){
		if(bigDigits[i].type == 'total'){
			bigDigits[i].animation.play('cycle');
		}
	}
	
	this.bigCoinTimerTotal = this.game.time.clock.createTimer('bigCoinTotal',0.1,6,false);
	this.bigCoinTimerEventTotal = this.bigCoinTimerTotal.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.tickBigCoinCounterTotal, this);
	this.bigCoinTimerTotal.start();
}

gameState.tickBigCoinCounterTotal = function(){
	var bandits = this.banditGroup.members;	
	for(var i =0; i <bandits.length; i++){
		this.stepBigCoinCounterTotal(bandits[i], i, this.bigCoinCounterStepTotal);
	}	
	this.bigCoinCounterStepTotal--;
}

gameState.stepBigCoinCounterTotal = function(bandit, banditIndex, bigCoinCounterStep){
	var value = Math.floor(this.totalScores[banditIndex]/(Math.pow(10,bigCoinCounterStep-1)))% 10;
	bigDigits = this.bigDigitGroup.members;
	for(var i = 0; i<bigDigits.length; i++){
		if(bigDigits[i].color == bandit.color){
			if(bigDigits[i].index == bigCoinCounterStep && bigDigits[i].type == 'total'){
				bigDigits[i].animation.play(value.toString());
			}
		}
	}
	if(this.soundOptions.soundsOn){
		if(this.bigCoinCounterStepTotal <= 5){
			this.dingSound.play('start', true);
		}
		if(this.bigCoinCounterStepTotal == 1){
			this.flipSound.stop();
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
	this.menuArrow.visible = false;
	this.bigDigitGroup.visible = true;
	this.betweenScreenGroup.visible = true;
	this.digitGroup.visible = false;
	this.timerDigitGroup.visible = false;
	this.bombIconGroup.visible = false;
	this.alphaBoxGroup.visible = true;
	this.cloudGroup.visible = false;
	for (var i = 0; i < this.ghoulKillCountGroup.length; i++){
		this.ghoulKillCountGroup[i].visible = false;
	}
	this.redHeartsGroup.visible = false;
	if(this.numPlayers == 2){
		this.blueHeartsGroup.visible = false;
	}	
}

gameState.iconsDuringLevelScreen = function(){
	this.cloudGroup.visible = false;
	this.alphaBoxGroup.visible = false;
	this.menuArrow.visible = false;	
	this.digitGroup.visible = false;
	this.timerDigitGroup.visible = false;
	this.bombIconGroup.visible = false;	
	this.bigDigitGroup.visible = false;
	this.betweenScreenGroup.visible = false;
	this.iconGroup.visible = false;
	this.redHeartsGroup.visible = false;
	if(this.numPlayers == 2){
		this.blueHeartsGroup.visible = false;
	}	
}

gameState.iconsNotDuringCutscene = function(){
	this.cloudGroup.visible = true;
	this.menuArrow.visible = true;
	this.digitGroup.visible = true;
	this.timerDigitGroup.visible = true;
	this.bombIconGroup.visible = true;
	this.bigDigitGroup.visible = false;
	this.betweenScreenGroup.visible = false;	
	this.iconGroup.visible = false;
	this.iconGroup.active = false;
	this.alphaBoxGroup.visible = false;
	for (var i = 0; i < this.ghoulKillCountGroup.length; i++){
		this.ghoulKillCountGroup[i].visible = true;
	}
	this.redHeartsGroup.visible = true;
	if(this.numPlayers == 2){
		this.blueHeartsGroup.visible = true;
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
	if(this.currentLevel > 20){
		this.stageCoach.animation.play('turbo');
	}else{
		this.stageCoach.animation.play('move');
	}
	if(this.soundOptions.soundsOn){
		this.wagonSound.play('start', true);
		this.horseGallopSound.play('start', true);
		if(this.numPlayers == 2){
			this.horseGallopTimer = this.game.time.clock.createTimer('horseGallopTimer',1,0,false);
			this.horseGallopTimerEvent = this.horseGallopTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.playHorseGallopSound2, this);
			this.horseGallopTimer.start();
		}

	}
}

gameState.playHorseGallopSound2 = function(){
	this.horseGallopSound2.play('start', true);
}

gameState.stopCutScene = function(){
	this.showIconsTimer.removeTimerEvent(this.showIconsTimerEvent);
	this.bigCoinTimer.removeTimerEvent(this.bigCoinTimerEvent);
	try{
		this.bigCoinTimerTotal.removeTimerEvent(this.bigCoinTimerEventTotal)
	}catch(err){
	}finally{
		this.updateBigCoinCounterTotalTimer.removeTimerEvent(this.updateBigCoinCounterTotalTimerEvent);
	}
	this.horseGallopSound.stop();
	this.horseGallopSound2.stop();
	this.wagonSound.stop();
	this.flipSound.stop();
}

gameState.moveBanditsOffscreen = function(){
	for(var i = 0; i<this.banditGroup.members.length; i++){
		this.banditGroup.members[i].x = this.bps * (this.GRID_COLS + 2);
	}
}

gameState.destroyEverything = function(removeBackground){
	this.destroyingNow = true;
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
		case 'redHearts':
			var members = this.redHeartsGroup.members;
			break;
		case 'blueHearts':
			var members = this.blueHeartsGroup.members;
			break;
	}
	for (var i =0; i<members.length; i++){
		members[i].destroy();
	}

}

gameState.isLevelOver = function(){
	if(this.coinGroup.members.length==0){
		if(this.soundOptions.soundsOn){	
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
		if(this.soundOptions.musicOn){
			this.currentMusic.stop();
		}
		this.addChild(this.loseScreen);
		this.pauseAllTimers();
		if(this.game.gamepads){
			this.removeAllGamepadSignals();
			this.addGamepadSignalsGameOver();
		}
		//this.destroyEverything(false);
		this.showingLevelScreen = true;
		this.iconsDuringCutScene();
		this.iconsDuringLevelScreen();
		this.moveBanditsOffscreen();
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

		this.removeCracksAtRowCol(hiddenBlock.row, hiddenBlock.col);

		var index = this.getArrayIndexForTilemapFromRowCol(hiddenBlock.row, hiddenBlock.col);
		var tileType = this.tilemap.layers[0].getTileFromIndex(index);
		hiddenBlock.tileType = tileType.index;
		this.tilemap.layers[0].setTileByIndex(index, 0);
		this.tilemap.layers[0].dirty = true;

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

		if(this.soundOptions.soundsOn){
			if(this.random.frac() <= 0.05){
				this.voicesSound.play('sixFeetUnder',true);
			}
		}
	}
}

gameState.removeCracksAtRowCol = function(row, col){
	for(var i = 0; i < this.cracksGroup.members.length; i++){
		if(this.cracksGroup.members[i].gridPosition[0] == row){
			if(this.cracksGroup.members[i].gridPosition[1] == col){
				var cracks = this.cracksGroup.removeChildAt(i);
				this.updateGhoulBlocksAfterRemovingCracks(cracks);
				return 1;
			}
		}
	}
	return 0;
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

gameState.updateGhoulBlocksAfterRemovingCracks = function(cracks){
	this.removeFromGroundBlocksGhoul(cracks.gridPosition);
	this.updateTopGroundBlocksGhoul();
	this.updateBlockedBlocksGhoul();
	this.updateGhoulBlocks();
}

gameState.addToBlocks = function(row, col, blocks){
	blocks[row][col] = 1;
}

gameState.removeFromGroundBlocks = function(blastedBlockPosition){
	this.groundBlocks[blastedBlockPosition[0]][blastedBlockPosition[1]] = 0;
}

gameState.removeFromGroundBlocksGhoul = function(gridPosition){
	this.originalGroundBlocks[gridPosition[0]][gridPosition[1]] = 0;
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

gameState.updateTopGroundBlocksGhoul = function(){
	for (var i = 0; i<this.GRID_ROWS-1; i++){
		var thisRow = this.originalGroundBlocks[i];
		var nextRow = this.originalGroundBlocks[i+1];
		for(var j = 0; j<this.GRID_COLS; j++){
			if(thisRow[j] == 0 && nextRow[j]==1){
				this.originalTopGroundBlocks[i][j] = 1;
			}else{
				this.originalTopGroundBlocks[i][j] = 0;
			}
		}
	}	
}

gameState.updateBlockedBlocks = function(){
	this.getBlockedBlocks(this.groundBlocks,'left',this.leftBlockedBlocks);
	this.getBlockedBlocks(this.groundBlocks,'right',this.rightBlockedBlocks);
}

gameState.updateBlockedBlocksGhoul = function(){
	this.getBlockedBlocks(this.originalGroundBlocks,'leftghoul',this.originalLeftBlockedBlocks);
	this.getBlockedBlocks(this.originalGroundBlocks,'rightghoul',this.originalRightBlockedBlocks);
}

gameState.mouseClicked = function(){
	if(this.game.states.current.name == "gameState"){
		if(this.isPaused == true){
			if(this.mouse.x > 250 && this.mouse.x < 750){
				if(this.mouse.x > 450 && this.mouse.x < 600){
					if(this.mouse.y > 620 && this.mouse.y < 680){
						this.closeMenu();
					}
				}
			}
		}else if(this.showingLevelScreen == false){
			if(this.mouse.x > 400 && this.mouse.x < 700 && this.mouse.y < 25 * this.MULTIPLIER){
				this.openMenu();
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
		if(this.game.gamepads){
			this.addGamepadSignalsTutorial();
		}
	}, this);		
	this.tutorialSignTween.to({y: 125}, 600, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
	this.pauseGame();
	if(this.game.gamepads){
		this.removeAllGamepadSignals();
	}		
}

gameState.closeTutorial = function(){
	this.tutorialSignTween.onComplete(function(){
		this.showingTutorial = false;
		if(this.game.gamepads){
			this.addGamepadSignalsGame();
		}
		this.resumeGame();
	}, this);	
	this.tutorialSignTween.to({y: this.GRID_ROWS * this.bps}, 600, Kiwi.Animations.Tweens.Easing.Linear.Out, true);
	if(this.game.gamepads){
		this.removeAllGamepadSignals();
	}	
}

gameState.openMenu = function(){
	if(this.isPaused == false){
		this.menuGroup.active = true;
		this.pauseGame();
		this.menuArrow.alpha = 0;
		this.menuTween.to({y: -this.STAGE_Y_OFFSET}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
		this.menuGroupTween.to({y: -this.STAGE_Y_OFFSET}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
		if(this.game.gamepads){
			this.removeAllGamepadSignals();
			this.addGamepadSignalsMenu();
		}	
	}
}

gameState.closeMenu = function(param){
	this.menuGroup.active = false;
	if(param != 'noresume'){
		this.resumeGame();
	}
	this.menuArrowTween.to({alpha: 1}, 1000, Kiwi.Animations.Tweens.Easing.Linear.Out,true);
	this.menuTween.to({y: -800}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);
	this.menuGroupTween.to({y: -800}, 1000, Kiwi.Animations.Tweens.Easing.Cubic.Out, true);	
	if(this.game.gamepads){
		this.removeAllGamepadSignals();
		this.addGamepadSignalsGame();
	}			
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
	var signGridPosition = this.signGridPositions[this.currentLevel - 1];
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

		if(this.gameIsOver){
			if(this.mouse.isDown){
				this.levelOver(false);
				this.game.input.mouse.reset();
			}						
		}

		if(this.showingLevelScreen == false){
			this.checkCollisions();
			this.isLevelOver();
			this.isGameOver();

			if(this.currentLevel <= 3){
				if(this.checkPressUp()){
					if(this.rideOutPlayed == false){
						this.showPressUp();
					}
				}else{
					if(this.showingPressUp == true){
						this.hidePressUp();
					}
				}
			}

			if(this.debugKey.isDown){
				this.switchToState('creditsState');
			}
		
			if(this.mouse.isDown){
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
}

gameState.launchFullscreen = function(){
	this.game.fullscreen.launchFullscreen()
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

gameState.logAllTimers = function(){
	for (var i = 0; i < this.game.time.clock.timers.length; i++){
		console.log(this.game.time.clock.timers[i].name);
	}		
}

gameState.removeAllGamepadSignals = function(){
	this.game.gamepads.gamepads[0].buttonOnDownOnce.removeAll();
	this.game.gamepads.gamepads[0].buttonOnUp.removeAll();
	this.game.gamepads.gamepads[0].buttonIsDown.removeAll();
	this.game.gamepads.gamepads[0].thumbstickOnDownOnce.removeAll();

	if(this.numPlayers == 2){
		this.game.gamepads.gamepads[1].buttonOnDownOnce.removeAll();
		this.game.gamepads.gamepads[1].buttonOnUp.removeAll();	
		this.game.gamepads.gamepads[1].buttonIsDown.removeAll();	
		this.game.gamepads.gamepads[1].thumbstickOnDownOnce.removeAll();		
	}
}

gameState.addGamepadSignalsGame = function(){
	this.game.gamepads.gamepads[0].buttonOnDownOnce.add(this.buttonOnDownOnce0, this);
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUp0, this);
	this.game.gamepads.gamepads[0].buttonIsDown.add(this.buttonIsDown0, this)
	if(this.numPlayers == 2){
		this.game.gamepads.gamepads[1].buttonOnDownOnce.add(this.buttonOnDownOnce1, this);
		this.game.gamepads.gamepads[1].buttonOnUp.add(this.buttonOnUp1, this);
		this.game.gamepads.gamepads[1].buttonIsDown.add(this.buttonIsDown1, this)
	}	
}

gameState.addGamepadSignalsGameOver = function(){
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUpDuringGameOver, this);
	if(this.numPlayers == 2){
		this.game.gamepads.gamepads[1].buttonOnUp.add(this.buttonOnUpDuringGameOver, this);
	}	
}

gameState.addGamepadSignalsMenu = function(){
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUpDuringMenu, this);
	this.game.gamepads.gamepads[0].thumbstickOnDownOnce.add(this.thumbstickOnDownOnceDuringMenu, this);
	if(this.numPlayers == 2){
		this.game.gamepads.gamepads[1].buttonOnUp.add(this.buttonOnUpDuringMenu, this);
		this.game.gamepads.gamepads[1].thumbstickOnDownOnce.add(this.thumbstickOnDownOnceDuringMenu, this);
	}
}

gameState.addGamepadSignalsBetweenScreen = function(){
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUpDuringBetweenScreen, this);
	this.game.gamepads.gamepads[0].thumbstickOnDownOnce.add(this.thumbstickOnDownOnceDuringBetweenScreen, this);	
	if(this.numPlayers == 2){
		this.game.gamepads.gamepads[1].buttonOnUp.add(this.buttonOnUpDuringBetweenScreen, this);
		this.game.gamepads.gamepads[1].thumbstickOnDownOnce.add(this.thumbstickOnDownOnceDuringBetweenScreen, this);
	}
}

gameState.addGamepadSignalsTutorial = function(){
	this.game.gamepads.gamepads[0].buttonOnUp.add(this.buttonOnUpDuringTutorial, this);
	this.game.gamepads.gamepads[0].thumbstickOnDownOnce.add(this.buttonOnUpDuringTutorial, this);

	if(this.numPlayers == 2){
		this.game.gamepads.gamepads[1].buttonOnUp.add(this.buttonOnUpDuringTutorial, this);
		this.game.gamepads.gamepads[1].thumbstickOnDownOnce.add(this.buttonOnUpDuringTutorial, this);		
	}	
}

gameState.buttonOnUpDuringTutorial = function(){
	this.closeTutorial();
}

gameState.buttonOnDownOnce0 = function(button){
	switch ( button.name ) {
		case "XBOX_A":
			if(!this.isPaused && !this.showingLevelScreen && this.red.isAlive){
				this.red.goFire = true;
				this.gunSound.play('start',true);
				console.log('gun' + this.red.color);
				this.red.blastBlock();
			}
			break;
		case "XBOX_B":
			this.red.goBomb = true;
			break;
		case "XBOX_X":
			this.red.goBomb = true;
			break;
		case "XBOX_Y":

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

gameState.forwardMenuIcon = function(){
	this.menuGroup.members[this.availableMenuIconsIndex].playOff();
	if(this.availableMenuIconsIndex == this.availableMenuIcons.length - 1){
		this.availableMenuIconsIndex = 0;
	}else{
		this.availableMenuIconsIndex++;
	}
	this.selectedIcon = this.menuGroup.members[this.availableMenuIconsIndex];
	this.menuGroup.members[this.availableMenuIconsIndex].playHover();
}

gameState.backwardMenuIcon = function(){
	this.menuGroup.members[this.availableMenuIconsIndex].playOff();
	if(this.availableMenuIconsIndex == 0){
		this.availableMenuIconsIndex = this.availableMenuIcons.length - 1;
	}else{
		this.availableMenuIconsIndex--;
	}
	this.selectedIcon = this.menuGroup.members[this.availableMenuIconsIndex];
	this.menuGroup.members[this.availableMenuIconsIndex].playHover();	
}

gameState.buttonOnUpDuringGameOver = function(button){
	this.levelOver(false);
}

gameState.buttonOnUpDuringMenu = function (button){
	switch(button.name){
		case "XBOX_A":
			if(this.selectedIcon){
				this.selectedIcon.mouseClicked();
			}
			break;
		case "XBOX_B":
			this.closeMenu();
			break;
		case "XBOX_X":
			break;
		case "XBOX_Y":
			break;
		case "XBOX_START":
			this.closeMenu();
			break;			
		case "XBOX_DPAD_LEFT":
			break;
		case "XBOX_DPAD_RIGHT":
			break;
		case "XBOX_DPAD_UP":
			this.backwardMenuIcon();
			break;
		case "XBOX_DPAD_DOWN":
			this.forwardMenuIcon();
			break;
		default:
			// Code
	}
}

gameState.thumbstickOnDownOnceDuringMenu = function(stick){
	switch ( stick.name ) {
		case "XBOX_LEFT_VERT":
			if(stick.value < 0){
				this.backwardMenuIcon();
			}else if (stick.value > 0){
				this.forwardMenuIcon();
			}
			break;
	}	
}

gameState.forwardBetweenScreenMenuIcon = function(){
	this.iconGroup.members[this.availableBetweenScreenMenuIconsIndex].playOff();
	if(this.availableBetweenScreenMenuIconsIndex == this.availableBetweenScreenMenuIcons.length - 1){
		this.availableBetweenScreenMenuIconsIndex = 0;
	}else{
		this.availableBetweenScreenMenuIconsIndex++;
	}
	this.selectedBetweenScreenIcon = this.iconGroup.members[this.availableBetweenScreenMenuIconsIndex];
	this.iconGroup.members[this.availableBetweenScreenMenuIconsIndex].playHover();
}

gameState.backwardBetweenScreenMenuIcon = function(){
	this.iconGroup.members[this.availableBetweenScreenMenuIconsIndex].playOff();
	if(this.availableBetweenScreenMenuIconsIndex == 0){
		this.availableBetweenScreenMenuIconsIndex = this.availableBetweenScreenMenuIcons.length - 1;
	}else{
		this.availableBetweenScreenMenuIconsIndex--;
	}
	this.selectedBetweenScreenIcon = this.iconGroup.members[this.availableBetweenScreenMenuIconsIndex];
	this.iconGroup.members[this.availableBetweenScreenMenuIconsIndex].playHover();	
}

gameState.buttonOnUpDuringBetweenScreen = function(button){
	switch(button.name){
		case "XBOX_A":
			if(this.selectedBetweenScreenIcon){
				this.selectedBetweenScreenIcon.mouseClicked();
			}
			break;
		case "XBOX_B":
			break;
		case "XBOX_X":
			break;
		case "XBOX_Y":
			break;
		case "XBOX_START":
			this.playIcon.mouseClicked();
			break;			
		case "XBOX_DPAD_LEFT":
			this.backwardBetweenScreenMenuIcon();
			break;
		case "XBOX_DPAD_RIGHT":
			this.forwardBetweenScreenMenuIcon();
			break;
		case "XBOX_DPAD_UP":
			break;
		case "XBOX_DPAD_DOWN":
			break;
		default:
			// Code		
	}
}

gameState.thumbstickOnDownOnceDuringBetweenScreen = function(stick){
	switch ( stick.name ) {
		case "XBOX_LEFT_HORZ":
			if(stick.value < 0){
				this.backwardBetweenScreenMenuIcon();
			}else if (stick.value > 0){
				this.forwardBetweenScreenMenuIcon();
			}
			break;
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
		case "XBOX_START":
			if(!this.isPaused){
				this.openMenu();
				this.availableMenuIconsIndex = 0;
				this.selectedIcon = this.menuGroup.members[this.availableMenuIconsIndex];
				this.menuGroup.members[this.availableMenuIconsIndex].playHover();
			}
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
			if(this.blue.isAlive){
				this.blue.goFire = true;
				this.gunSound.play('start',true);
				this.blue.blastBlock();
				console.log('blue gune')
			}
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
		case "XBOX_START":
			if(this.isPaused){
				this.closeMenu();
			}else{
				this.openMenu();
			}
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

gameState.shutDown = function(){
	var removingHeartTimers = true;
	while(removingHeartTimers){
		removingHeartTimers = this.game.time.clock.removeTimer(null, 'heartTimer');
	}
	this.removeAllGamepadSignals();
	this.game.input.keyboard.onKeyDown.removeAll();
}