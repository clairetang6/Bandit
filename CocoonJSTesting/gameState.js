var gameState = new Kiwi.State('gameState');

gameState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
	this.addSpriteSheet('sprites','all_spritesheet.png',108,108);

	this.currentLevel = 1;
	this.numberOfLevels = 1;	

	for (var i = 1; i<=this.numberOfLevels; i++){

		this.addImage('background'+i,'canvas_'+i+'.png',true);
		this.addSpriteSheet('backgroundSpriteSheet'+i,'canvas_'+i+'.png',108,108);
		this.addJSON('level_tilemap'+i,'level'+i+'.json');
		
	}

	this.addSpriteSheet('tiles','block_ladder.png',108,108);	
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


gameState.create = function(){
	Kiwi.State.prototype.create.call(this);

	this.STAGE_WIDTH = 1080;
	this.STAGE_HEIGHT = 810;
	this.gridRows = 15;
	this.gridCols = 20;

	myGame.stage.color = 'AAAABB';
	myGame.stage.resize(2*this.STAGE_WIDTH, 2*this.STAGE_HEIGHT);

	this.winScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['win'],0,0);
	this.loseScreen = new Kiwi.GameObjects.StaticImage(this, this.textures['lose'],0,0);

	
	this.game.input.onUp.add(this.onUpCallback, this);
	this.game.input.onDown.add(this.onDownCallback, this);
	console.log(this.game.input.onUp);
	this.finger = this.game.input.touch.finger1;

	this.banditGroup = new Kiwi.Group(this);
	
	this.blue = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],-108,-108);
	this.blue.box.hitbox = new Kiwi.Geom.Rectangle(18,18,108-36,108-36);


	this.blue.animation.add('climb',[48,49],0.1,true);
	this.blue.animation.add('idleleft',[47],0.1,false);
	this.blue.animation.add('idleright',[32],0.1,false);
	this.blue.animation.add('moveright',[33,34,35,36,37,38],0.1,true);
	this.blue.animation.add('moveleft',[46,45,44,43,42,41],0.1,true);
	this.blue.animation.add('fireleft',[40],0.1,false);
	this.blue.animation.add('fireright',[39],0.1,false);
	this.blue.animation.add('idleclimb',[49],0.1,false);
	this.blue.animation.add('die',[13],0.1,false);

	this.blueFacing = 'left';
	this.blue.animation.play('idleleft');
	


	this.red = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],-108,-108);
	this.red.box.hitbox = new Kiwi.Geom.Rectangle(40,40,108-80,108-80);

	this.red.animation.add('climb',[0,1],0.1,true);
	this.red.animation.add('idleleft',[31],0.1,false);
	this.red.animation.add('idleright',[16],0.1,false);
	this.red.animation.add('moveright',[17,18,19,20,21,22],0.1,true);
	this.red.animation.add('moveleft',[30,29,28,27,26,25],0.1,true);
	this.red.animation.add('fireright',[23],0.1,false);
	this.red.animation.add('fireleft',[24],0.1,false);
	this.red.animation.add('idleclimb',[0],0.1,false);
	this.red.animation.add('die',[12],0.1,false);

	this.redFacing = 'left';
	this.red.animation.play('idleleft');


	this.red_canShoot = true;
	this.blue_canShoot = true;

	this.blueMovingDirection = 'none';
	this.redMovingDirection = 'none';


	this.banditGroup.addChild(this.red);
	this.banditGroup.addChild(this.blue);

	this.coinGroup = new Kiwi.Group(this);
	this.ghoulGroup = new Kiwi.Group(this);
	this.blueHeartsGroup = new Kiwi.Group(this);
	this.redHeartsGroup = new Kiwi.Group(this);

	this.hiddenBlockGroup = new Kiwi.Group(this);

	this.createLevel();
	
}

gameState.createLevel = function(){
	console.log('creating level '+ this.currentLevel);

	var blockArrays = this.parseBlocks('level_tilemap'+this.currentLevel);

	var coinsLayerArray = blockArrays[2];
	var width = blockArrays[4];
	var tileWidth = blockArrays[3];
	for(var i = 0; i<coinsLayerArray.length;i++){
		if(coinsLayerArray[i]!=0){
			var coinPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var coin = new Kiwi.GameObjects.Sprite(this, this.textures['sprites'],coinPixels[0],coinPixels[1]);
			coin.animation.add('spin',[8,9,10,11],0.1,true);
			coin.animation.play('spin');
			coin.box.hitbox = new Kiwi.Geom.Rectangle(50,50,108-100,108-100);			
			this.coinGroup.addChild(coin);
		}
	}

	this.blueCoinsCollected = 0;
	this.redCoinsCollected = 0;

	var ghoulsLayerArray = blockArrays[5];
	for(var i = 0; i<ghoulsLayerArray.length;i++){
		if(ghoulsLayerArray[i]==11){
			var ghoulPixels = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
			var ghoul = new Ghoul(this,ghoulPixels[0],ghoulPixels[1],'left');
		 	ghoul.animation.add('idleleft',[7],0.1,false);
			ghoul.animation.add('idleright',[4],0.1,false);
			ghoul.animation.add('upright',[2],0.1,false);
			ghoul.animation.add('upleft',[5],0.1,false);
			ghoul.animation.add('dieright',[2,3],0.1,true);
			ghoul.animation.add('dieleft',[5,6],0.1,true);
			ghoul.animation.play('idleleft');
			ghoul.box.hitbox = new Kiwi.Geom.Rectangle(40,40,108-80,108-80);
			this.ghoulGroup.addChild(ghoul);
		}
	}

	this.blueStartingPixelLocations = [0,0];
	this.redStartingPixelLocations = [0,0];
	for(var i = 0; i<ghoulsLayerArray.length; i++){
		if(ghoulsLayerArray[i] == 39 || ghoulsLayerArray[i] == 54){
			this.blueStartingPixelLocations = this.getPixelPositionFromArrayIndex(i, tileWidth, width);
		}
		if(ghoulsLayerArray[i] == 38 || ghoulsLayerArray[i] == 23){
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

		redHeart.animation.add('blink',[14,55],.2,true);
		blueHeart.animation.add('blink',[15,55],.2,true);
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



	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'+this.currentLevel],0,0);

	this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this,'level_tilemap'+this.currentLevel, this.textures.tiles);
	
	
	this.groundBlocks = this.getGroundBlocks(blockArrays[0],blockArrays[4]);
	this.originalGroundBlocks = this.getGroundBlocks(blockArrays[0],blockArrays[4]);
	this.ladderBlocks = this.getLadderBlocks(blockArrays[1],blockArrays[4]);
	this.firstLadderBlocks = this.getFirstLadderBlocks(this.ladderBlocks);

	this.topLadderBlocks = this.getTopBlocks(this.ladderBlocks);

	this.originalLeftBlockedBlocks = this.make2DArray(this.gridRows, this.gridCols);
	this.getBlockedBlocks(this.originalGroundBlocks,'left',this.originalLeftBlockedBlocks);
	this.originalRightBlockedBlocks = this.make2DArray(this.gridRows, this.gridCols);
	this.getBlockedBlocks(this.originalGroundBlocks,'right', this.originalRightBlockedBlocks);
	
	this.leftBlockedBlocks = this.make2DArray(this.gridRows, this.gridCols);
	this.rightBlockedBlocks = this.make2DArray(this.gridRows, this.gridCols);
	this.topGroundBlocks = this.getTopBlocks(this.groundBlocks);

	this.updateTopGroundBlocks();
	this.updateBlockedBlocks();

	
	this.addChild(this.background);
	this.addChild(this.tilemap.layers[0]);
	this.addChild(this.hiddenBlockGroup);	
	this.addChild(this.tilemap.layers[1]);
	
	this.addChild(this.coinGroup);
	this.addChild(this.ghoulGroup);
	this.addChild(this.banditGroup);
	this.addChild(this.redHeartsGroup);
	this.addChild(this.blueHeartsGroup);	
	
	
	this.timer = this.game.time.clock.createTimer('levelOver',10,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP,this.levelOver,this);

}

gameState.updateBlockedBlocks = function(){
	this.getBlockedBlocks(this.groundBlocks,'left',this.leftBlockedBlocks);
	this.getBlockedBlocks(this.groundBlocks,'right',this.rightBlockedBlocks);
}

gameState.checkCoinCollision = function(){
	var coins = this.coinGroup.members;
	var bandits = this.banditGroup.members;

	for (var i = 0; i <coins.length; i++){
		for (var j = 0; j<bandits.length; j++){
			var coinBox = coins[i].box.hitbox;
			if(bandits[j].box.bounds.intersects(coinBox)){
				if(j == 0){
					this.redCoinsCollected ++;
				}else{
					this.blueCoinsCollected ++;
				}
				console.log('red coins: ' + this.redCoinsCollected);
				console.log('blue coins: ' + this.blueCoinsCollected);

				coins[i].destroy();
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


var HiddenBlock = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['backgroundSpriteSheet'+state.currentLevel], x, y, false);
	this.occupiedBy = []; //array of Ghouls 
	this.gridPosition = state.getGridPosition(x,y);
	this.row = this.gridPosition[0];
	this.col = this.gridPosition[1]; 
	this.state = state;

	this.timer = state.game.time.clock.createTimer('hiddenBlockTimer',5,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.hiddenBlockTimer, this);
	this.timer.start();

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

var Ghoul = function(state, x, y, facing){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.facing = facing; 
	this.shouldFall = false;
	this.isInHole = false;
	this.testvar = 0;
	this.state = state;

	this.gravity = function(){
		var southGridPosition = state.getGridPosition(this.x, this.y, 'south');
		var inStoppingBlock = false;
		for(var i = 0; i <state.topGroundBlocks.length; i++){
			if(state.onBlockType(state.topGroundBlocks, southGridPosition)){
				inStoppingBlock = true;
			}
		}
		if(inStoppingBlock){
			var pixelNum = state.getPixelNumberForGridPosition(southGridPosition, 'south');
			if(this.y +108 <pixelNum-28){
				this.y += 20;
			}
			else{
				this.y = pixelNum-108;
				this.shouldFall = false;
			}
		}else{
			this.y+=20;
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
		var topGridPosition = state.getGridPosition(this.x, this.y+30, 'north');
		var shouldTurnRight = false;
		var shouldTurnLeft = false;	


		if(this.isInHole){
			this.inHole();
		}else{

			if(this.shouldFall){
				this.gravity();
			}

			
			var checkForRightBlockedBlockPosition = [rightGridPosition[0]+1, rightGridPosition[1]-1];
			var checkForLeftBlockedBlockPosition = [leftGridPosition[0]+1, leftGridPosition[1]+1];
			var checkForGroundBlockPositionFacingLeft = [rightGridPosition[0], rightGridPosition[1]-1];
			var checkForGroundBlockPositionFacingRight = [leftGridPosition[0], leftGridPosition[1]+1];
			
			switch(this.facing){
				case 'left':
					
					if(this.x < 0){
						shouldTurnRight = true;
						break;
					}

					if(state.onBlockType(state.originalGroundBlocks,checkForGroundBlockPositionFacingLeft)){
						shouldTurnRight = true;
						break;
					}
					if(state.onBlockType(state.originalRightBlockedBlocks, checkForRightBlockedBlockPosition)){
						shouldTurnRight = true;
						break;
					}
					break;
				case 'right':

					if(this.x > 19*108-1){
						shouldTurnLeft = true;
						break;
					}

					if(state.onBlockType(state.originalGroundBlocks,checkForGroundBlockPositionFacingRight)){
						shouldTurnLeft = true;
						break;
					}
					if(state.onBlockType(state.originalLeftBlockedBlocks, checkForLeftBlockedBlockPosition)){
						shouldTurnLeft = true;
						break;
					}
					break;
			}

			var shouldTurn = shouldTurnRight || shouldTurnLeft;

			if (shouldTurn){
				switch(this.facing){
					case 'left':
						this.facing = 'right';
						this.animation.play('idleright');
						break;
					case 'right':
						this.facing = 'left';
						this.animation.play('idleleft');
						break;
				}
			}
			
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
					break;
				case 'right':
					this.x += 1;
					break;
			}

			if(!this.shouldFall){
				var shouldTurnAgain = false;
				switch(this.facing){
					case 'left':

						if(state.onBlockType(state.originalGroundBlocks,checkForGroundBlockPositionFacingLeft)){
							shouldTurnAgain = true;
							break;
						}
						if(state.onBlockType(state.originalRightBlockedBlocks, checkForRightBlockedBlockPosition)){
							shouldTurnAgain = true;
							break;
						}
						break;
					case 'right':
			

						if(state.onBlockType(state.originalGroundBlocks,checkForGroundBlockPositionFacingRight)){
							shouldTurnAgain = true;
							break;
						}
						if(state.onBlockType(state.originalLeftBlockedBlocks, checkForLeftBlockedBlockPosition)){
							shouldTurnAgain = true;
							break;
						}
						break;
				}
				if(shouldTurnAgain){
					this.isInHole = true;
					this.singleBlockDeath();
				}
			}

		}

	}
}
Kiwi.extend(Ghoul, Kiwi.GameObjects.Sprite);

Ghoul.prototype.singleBlockDeath = function(){
	this.timer = this.state.game.time.clock.createTimer('singleBlockDeathTimer',3,0,false);
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.destroy, this);
	this.timer.start();	
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
/**
* getGroundBlocks returns a 2d array containing a 1 where there is a ground block and 0 otherwise. 
*/


gameState.getGroundBlocks = function(groundLayerArray, width){
	var groundBlocks = this.make2DArray(this.gridRows, this.gridCols);
	for (var i = 0; i<groundLayerArray.length; i++){
		if(groundLayerArray[i] != 0){
			groundBlocks[this.getRow(i,width)][this.getCol(i,width)] = 1;
		}
	}
	return groundBlocks;	
}

gameState.getLadderBlocks = function(ladderLayerArray, width){
	var ladderBlocks = this.make2DArray(this.gridRows, this.gridCols);
	for (var i = 0; i <ladderLayerArray.length; i++){
		if(ladderLayerArray[i] == 4){
			ladderBlocks[this.getRow(i,width)][this.getCol(i,width)] = 1;
		}
	}
	return ladderBlocks;
}


gameState.getTopBlocks = function(blocks){
	var topBlocks = this.make2DArray(this.gridRows, this.gridCols);
	for (var i = 0; i<this.gridRows-1; i++){
		var thisRow = blocks[i];
		var nextRow = blocks[i+1];
		for(var j = 0; j<this.gridCols; j++){
			if(thisRow[j] == 0 && nextRow[j]==1){
				topBlocks[i][j] = 1; 
			}
		}
	}	

	return topBlocks;
}

gameState.updateTopGroundBlocks = function(){
	
	for (var i = 0; i<this.gridRows-1; i++){
		var thisRow = this.groundBlocks[i];
		var nextRow = this.groundBlocks[i+1];
		for(var j = 0; j<this.gridCols; j++){
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
			for(var i =0;i<this.gridRows; i++){
				for(var j=0; j<this.gridCols; j++){
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
			for(var i =0; i<this.gridRows; i++){
				for(var j=0; j<this.gridCols; j++){
					if(j==this.gridCols-1){
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
	}

}


gameState.getFirstLadderBlocks = function(ladderBlocks){
	var firstLadderBlocks = this.make2DArray(this.gridRows, this.gridCols);

	for(var i = 0; i<this.gridRows-1; i++){
		for(var j= 0; j<this.gridCols; j++){
			if(ladderBlocks[i][j] == 1 && ladderBlocks[i+1][j] == 0){
				firstLadderBlocks[i][j] = 1;
			}
		}
	}
	for (var j=0; j<this.gridCols; j++){
		if(ladderBlocks[this.gridRows-1][j] == 1){
			firstLadderBlocks[this.gridRows-1][j] = 1;
		}
	}

	return firstLadderBlocks;
}


gameState.parseBlocks = function(level_tilemap){
	var json = JSON.parse(this.game.fileStore.getFile(level_tilemap).data);
	var groundLayerArray = json.layers[0].data;
	var ladderLayerArray = json.layers[1].data;
	var ghoulsLayerArray = json.layers[2].data;
	var coinsLayerArray = json.layers[3].data;
	var width = json.width;
	var tileWidth = json.tilewidth;

	return [groundLayerArray, ladderLayerArray, coinsLayerArray, tileWidth, width, ghoulsLayerArray];
}

gameState.getPixelPositionFromArrayIndex = function(index, tileWidth, width){
	var row = this.getRow(index,width);
	var col = this.getCol(index,width);
	return [(col)*tileWidth, (row)*tileWidth];
}

gameState.getPixelPositionFromRowCol = function(row, col){
	return [(col)*54, (row)*54];
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
			return [Math.floor((y-12)/108), Math.floor((x+50)/108)];
		case 'south':
			return [Math.floor((y+108)/108), Math.floor((x+50)/108)];
		case 'east':
			return [Math.floor((y+102)/108), Math.floor((x+106)/108)];
		case 'west':
			return [Math.floor((y+102)/108), Math.floor((x+2)/108)];
		case 'middle':
			return [Math.floor((y+50)/108), Math.floor((x+25)/108)];
		default: 
			return [Math.floor(y/108), Math.floor(x/108)];
	}
	return 0;
}

gameState.onBlockType = function(blocks, gridPosition){
	if(gridPosition[0]<this.gridRows && gridPosition[0]>=0 && gridPosition[1]<this.gridCols && gridPosition[1]>=0){
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
			return gridPosition[0]*108; 
		case 'south':
			return (gridPosition[0]+1)*108 - 1;
		case 'west':
			return gridPosition[1]*108;
		case 'east':
			return (gridPosition[1]+1)*108 - 1;
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

gameState.getArrayIndexFromRowCol = function(row, col){
	return (row)*20 + col;
}

gameState.blastBlock = function(blastedBlockPosition){
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

gameState.update = function(){
	Kiwi.State.prototype.update.call(this);



	if(this.blueIsAlive){
		var blue_southGridPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y,'south');
		var blue_belowFeetPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y+1*2/**/,'south');
		var blue_feetPosition = this.getGridPosition(this.blue.transform.x, this.blue.transform.y-3*2/**/,'south');	

		 	if(!(this.onBlockType(this.ladderBlocks,blue_southGridPosition) || this.onBlockType(this.groundBlocks, blue_southGridPosition))){
		 		if(this.onBlockType(this.topGroundBlocks,blue_southGridPosition)){
		 			var pixelNum = this.getPixelNumberForGridPosition(blue_southGridPosition,'south');
		 			if(this.blue.transform.y+54*2/**/<pixelNum-26*2/**/)
		 				this.blue.transform.y+=13*2/**/;
		 			else
		 				this.blue.transform.y=pixelNum-53*2/**/+2*2/**/;
		 		}else{
		 			if(this.blue.transform.y+54*2/**/<54*2/**/*15-14*2/**/)
		 				this.blue.transform.y+=13*2/**/;
		 			else
		 				this.blue.transform.y=54*2/**/*15-54*2/**/;
		 		}
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



