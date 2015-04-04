var Bandit = function(state, x, y, color){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state; 
	this.color = color; 
	this.bombsCollected = 0;
	this.bombs = [];
	this.bombClock = this.state.game.time.addClock(color+'BombClock', 250);
	this.bombClock.start();
	this.bombIconGroup = this.state.bombIconGroup;
	this.isAlive = true;
	this.isDeadAndOnGround = false;
	this.facing = 'left';
	this.canShoot = true; 
	this.numberOfHearts = 3;
	this.deathCounter = 0;
	this.startingPixelLocations = null;
	this.coinsCollected = 0;
	this.totalCoinsCollected = 0;
	this.bps = this.state.bps;
	this.grayGhoulsKilled = 0;
	this.redGhoulsKilled = 0;
	this.blueGhoulsKilled = 0;
	this.blackGhoulsKilled = 0;
	this.ghouliathsKilled = 0;
	this.goUp = false;
	this.goDown = false;
	this.goLeft = false;
	this.goRight = false;
	this.goFire = false;
	this.goBomb = false;

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
			this.leftKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
			this.rightKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
			this.upKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);
			this.downKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
			this.fireKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SHIFT);
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
			this.leftKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);
			this.rightKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);
			this.upKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.UP);
			this.downKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);
			this.fireKey = this.state.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

			break;
	}
}
Kiwi.extend(Bandit, Kiwi.GameObjects.Sprite);

Bandit.prototype.totalGhoulKills = function(){
	return this.grayGhoulsKilled + this.blueGhoulsKilled + this.redGhoulsKilled + this.blackGhoulsKilled + this.ghouliathsKilled;
}

Bandit.prototype.deathCount = function(){
	if(this.deathCounter < 100){
		if(this.deathCounter == 1){
			switch(this.color){
				case 'red':
					var heartGroup = this.state.redHeartsGroup;
					break;
				case 'blue':
					var heartGroup = this.state.blueHeartsGroup;
					break;
			}
			var hearts = heartGroup.members;
			for(var i = 0; i<hearts.length; i++){
				hearts[i].disappear();
			}
		}
		this.deathCounter++;
		this.animation.play('die');
	}else{
		this.numberOfHearts--;
		if(this.numberOfHearts>0){
			this.x = this.startingPixelLocations[0];
			this.y = this.startingPixelLocations[1];
			this.isAlive = true;
			this.isDeadAndOnGround = false;
			this.animation.play('idleleft');
			this.state.showHearts(this.color);
			this.deathCounter = 0;
		}else{
			this.numberOfHearts = 0;
		}
	}
}

Bandit.prototype.moveUp = function(){
	var gridPosition = this.state.getGridPosition(this.x, this.y, 'north');
	var ladderPixelNum = this.state.getPixelNumberForGridPosition(gridPosition,'west') + this.bps/2;
	if(this.x+this.bps/2>ladderPixelNum-35 && this.x+this.bps/2<ladderPixelNum+35){	
		if(this.state.onBlockType(this.state.topLadderBlocks, gridPosition)){
			if(this.x + this.bps/2 < ladderPixelNum -15){
				this.x = ladderPixelNum - 15 - this.bps/2;
			}else if (this.x + this.bps/2 > ladderPixelNum + 15){
				this.x = ladderPixelNum + 15 - this.bps/2;
			}			
			var pixelNum = this.state.getPixelNumberForGridPosition(gridPosition,'north');
			if(this.y>6+pixelNum){
				this.y -= 3;
				if(this.animation.currentAnimation.name!='climb'){
					this.animation.play('climb');
				}				
			}else{
				this.y=pixelNum;
				this.animation.play('idle'+this.facing);			
			}
		}else if(this.state.onBlockType(this.state.ladderBlocks, gridPosition)){
			if(this.x + this.bps/2 < ladderPixelNum -10){
				this.x = ladderPixelNum - 10 - this.bps/2;
			}else if (this.x + this.bps/2 > ladderPixelNum + 10){
				this.x = ladderPixelNum + 10 - this.bps/2;
			}				
			if(this.y>3){
				this.y -= Math.round(3 * this.state.game.time.rate);
			}
			if(this.animation.currentAnimation.name != 'climb'){
				this.animation.play('climb');
			}
		}
	}	
}

Bandit.prototype.moveDown = function(southGridPosition){
	//return true if should then check downKey for bomb placement
	var ladderPixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'west') + this.bps/2;
	var belowFeetPosition = this.state.getGridPosition(this.x, this.y+this.bps,'south');				
	if(this.x+this.bps/2>ladderPixelNum-35 && this.x+this.bps/2<ladderPixelNum+35){	
		if(this.state.onBlockType(this.state.firstLadderBlocks, southGridPosition)){
			var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'south');
			if(!this.state.onBlockType(this.state.groundBlocks, belowFeetPosition)){
				//this if block for falling off edge of ladder. 
				if(this.x + this.bps/2 < ladderPixelNum -10){
					this.x = ladderPixelNum - 10 - this.bps/2;
				}else if (this.x + this.bps/2 > ladderPixelNum + 10){
					this.x = ladderPixelNum + 10 - this.bps/2;
				}				
				this.y += Math.round(3 * this.state.game.time.rate);
			}else{
				if(this.y+this.bps<pixelNum-5){
					if(this.x + this.bps/2 < ladderPixelNum -10){
						this.x = ladderPixelNum - 10 - this.bps/2;
					}else if (this.x + this.bps/2 > ladderPixelNum + 10){
						this.x = ladderPixelNum + 10 - this.bps/2;
					}	
					this.y += Math.round(3 * this.state.game.time.rate);
					if(this.animation.currentAnimation.name!='climb'){
						this.animation.play('climb');
					}				
				}else{
					this.y=pixelNum-this.bps+1; 
					this.animation.play('idle'+this.facing);
				}
			}
			return false;
		}else if(this.state.onBlockType(this.state.ladderBlocks, belowFeetPosition)){
			if(this.y<this.bps*this.state.GRID_ROWS){
				if(this.x + this.bps/2 < ladderPixelNum -10){
					this.x = ladderPixelNum - 10 - this.bps/2;
				}else if (this.x + this.bps/2 > ladderPixelNum + 10){
					this.x = ladderPixelNum + 10 - this.bps/2;
				}				
				this.y += Math.round(5 * this.state.game.time.rate);
			}else{
				this.y = this.bps*this.state.GRID_ROWS;
			}
			if(this.animation.currentAnimation.name != 'climb')
				this.animation.play('climb');
			return false;
		}else{
			return true;
		}
	}
	return false;
}

Bandit.prototype.blastBlock = function(){
	var blastedBlockPosition = this.state.getBlastedBlockPosition(this.state.getGridPosition(this.x, this.y, 'middle'), this.facing);
	this.state.blastBlock(blastedBlockPosition, this.color);
}

Bandit.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.state.showingLevelScreen == false){
		this.state.checkController(this);
		if(!this.isDeadAndOnGround){
			var southGridPosition = this.state.getGridPosition(this.x, this.y, 'south');
		 	if(this.isAlive){
			 	if(!(this.state.onBlockType(this.state.ladderBlocks,southGridPosition) || this.state.onBlockType(this.state.groundBlocks, southGridPosition))){
			 		this.gravity(southGridPosition);
			 		southGridPosition = this.state.getGridPosition(this.x, this.y, 'south');
			 	}
			}else{
				if(this.state.onBlockType(this.state.ladderBlocks,southGridPosition) || !this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
					this.gravity(southGridPosition);
				}
			}
		}
		if(this.isAlive){
		 	if(this.fireKey.isDown || this.goFire){
		 		console.log('goFiring ' + this.color + ' ' + this.fireKey.isDown);
				this.animation.play('fire' + this.facing);
			}
			else if(this.upKey.isDown || this.goUp){
				this.moveUp();
				if(this.state.currentLevel <= 3){
					if(this.state.checkIfOnSign(southGridPosition) && this.state.showingTutorial == false){
						this.state.openTutorial();
					}
				}
			}
			else if(this.rightKey.isDown || this.goRight){
				this.facing = 'right';
				if(this.state.onBlockType(this.state.rightBlockedBlocks, southGridPosition)){
					var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'east');
					if(this.x+this.bps<pixelNum-6){
						this.x += Math.round(5 * this.state.game.time.rate);
					}else{
						this.x = pixelNum-this.bps+1;
						this.animation.play('idle'+this.facing);
					}
				}
				else{
					if(!this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
						this.x += Math.round(5 * this.state.game.time.rate);
						if(this.animation.currentAnimation.name != 'moveright')
							this.animation.play('moveright');
					}
				}
			}
			else if(this.leftKey.isDown || this.goLeft){
				this.facing = 'left';
				if(this.state.onBlockType(this.state.leftBlockedBlocks, southGridPosition)){
					var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'west');
					if(this.x>pixelNum+6){
						this.x -= Math.round(5 * this.state.game.time.rate);
					}else{
						this.x = pixelNum;
						this.animation.play('idle'+this.facing);
					}
				}else{
					if(!this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
						this.x -= Math.round(5 * this.state.game.time.rate);
						if(this.animation.currentAnimation.name != 'moveleft')
							this.animation.play('moveleft');
					}
				}
			}
			else if(this.downKey.isDown || this.goDown){
				if(this.moveDown(southGridPosition)){
					if(this.downKey.justPressed(30)){
						this.tryPlacingBomb(southGridPosition);
					}
				}
			}
			else {
		 		var belowFeetPosition = this.state.getGridPosition(this.x, this.y+1,'south');
				if(this.state.onBlockType(this.state.ladderBlocks, belowFeetPosition) && !this.state.onBlockType(this.state.topLadderBlocks,southGridPosition)){
					if(this.animation.currentAnimation.name != 'idleclimb')
						this.animation.play('idleclimb');
				}		
				else if(this.animation.currentAnimation.name != 'idle' + this.facing)
					this.animation.play('idle' + this.facing);	
				if(this.goBomb){
					this.tryPlacingBomb(southGridPosition);
				}
			}
		}
		else{
			this.deathCount();
		}
	}
}

Bandit.prototype.tryPlacingBomb = function(southGridPosition){
	if(this.state.onBlockType(this.state.topGroundBlocks, southGridPosition)){
		console.log(this.bombClock.elapsed());
		if(this.bombClock.elapsed() > 5){
			this.placeBomb();
		}
	}	
}

Bandit.prototype.gravity = function(southGridPosition){
	if(this.state.onBlockType(this.state.topGroundBlocks,southGridPosition)){
		var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'south');
		if(this.y+this.bps<pixelNum-26){
			this.y+=13;
		}else{
			this.y=pixelNum-this.bps+1;
			if(!this.isAlive){
				this.isDeadAndOnGround = true;
			}
		}
	}else{
		if(this.y+this.bps<this.bps*this.state.GRID_ROWS-26){
			this.y+=13;
		}else{
			this.y=this.bps*this.state.GRID_ROWS-this.bps;
			if(!this.isAlive){
				this.isDeadAndOnGround = true;
			}
		}
	}		
}

Bandit.prototype.placeBomb = function(){
	if(this.bombsCollected > 0){
		this.bombClock.start();
		console.log('start' + this.bombClock.elapsed());
		bomb = this.bombs.pop();
		bomb.x = this.state.getPixelNumberForGridPosition(this.state.getGridPosition(this.x, this.y,'middle'),'west');
		bomb.y = this.state.getPixelNumberForGridPosition(this.state.getGridPosition(this.x, this.y,'middle'),'north');	
		var bombGridPosition = this.state.getGridPosition(bomb.x,bomb.y);
		bomb.rowPlaced = bombGridPosition[0];
		bomb.colPlaced = bombGridPosition[1]; 
		bomb.animation.play('idleground');
		bomb.startTimer();
		bomb.placedBy = this.color;
		bomb.placedByBandit = this;
		if(this.state.soundOptions.soundsOn){
			if(this.state.random.integerInRange(0,2)==0){
				this.state.voicesSound.play('bombPlace',true);
			}else{
				this.state.voicesSound.play('bombPlace2',true);
			}
		}
		this.bombsCollected--;
		this.state.updateBombCounter(this);			
	}
}

Bandit.prototype.resetPropertiesAtBeginningOfLevel = function(){
	this.coinsCollected = 0; 
	this.totalCoinsCollected = 0; //this is really total level points;
	this.bombsCollected = 0;
	this.numberOfHearts = 3;
	this.isAlive = true;
	this.isDeadAndOnGround = false;
	this.x = this.startingPixelLocations[0];
	this.y = this.startingPixelLocations[1];
	this.grayGhoulsKilled = 0;
	this.redGhoulsKilled = 0;
	this.blueGhoulsKilled = 0;
	this.blackGhoulsKilled = 0;
	this.ghouliathsKilled = 0;
}

var HiddenBlock = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['backgroundSpriteSheet'+state.currentLevel], x, y, false);
	this.occupiedBy = []; //array of Ghouls 
	this.gridPosition = state.getGridPosition(x,y);
	this.row = this.gridPosition[0];
	this.col = this.gridPosition[1];
	this.state = state;
	this.isBreaking = false;

	if(this.state.currentLevel >=20){
		this.hiddenBlockTime = 8;
	}else{
		this.hiddenBlockTime = 5;
	}

	this.timer = state.game.time.clock.createTimer('hiddenBlockTimer',this.hiddenBlockTime,0,false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.hiddenBlockTimer, this);
	
	if(this.state.permBlocks[this.row][this.col] != 1){
		this.timer.start();
	}
}
Kiwi.extend(HiddenBlock, Kiwi.GameObjects.Sprite);

HiddenBlock.prototype.hiddenBlockTimer = function(){
	switch(this.blastedBy){
		case 'red':
			var banditToAddGhoulKillTo = this.state.banditGroup.members[0];
			break;
		case 'blue':
			var banditToAddGhoulKillTo = this.state.banditGroup.members[1];
			break;
	}
	var numberOfGhouls = this.occupiedBy.length;
	for(var i =0; i < numberOfGhouls; i++){
		var ghoul = this.occupiedBy.pop();
		if(ghoul.objType() == 'BlackGhoul'){
			if(ghoul.lives < 2){
				ghoul.destroy(false);
				banditToAddGhoulKillTo.blackGhoulsKilled++;
				this.state.addGhoulKill(banditToAddGhoulKillTo.color);
			}
		}else if(ghoul.objType() == 'Ghouliath'){
			if(ghoul.exists == true){
				ghoul.animation.play('explode');
				ghoul.explodeTimer.start();
				banditToAddGhoulKillTo.ghouliathsKilled++;
				this.state.addGhoulKill(banditToAddGhoulKillTo.color);
			}
		}else{
			if(ghoul.objType() == 'Ghoul'){
				banditToAddGhoulKillTo.grayGhoulsKilled++;
			}else if(ghoul.objType() == 'BlueGhoul'){
				banditToAddGhoulKillTo.blueGhoulsKilled++;
			}else if(ghoul.objType() == 'RedGhoul'){
				banditToAddGhoulKillTo.redGhoulsKilled++;
			}
			this.state.addGhoulKill(banditToAddGhoulKillTo.color);
			ghoul.destroy(false);
		}
	}
	if(this.state.soundOptions.soundsOn){
		if(numberOfGhouls>1){
			if(numberOfGhouls>3){
				this.state.voicesSound.play('hotDamnSon',true);
			}else{
				this.state.voicesSound.play('ghoulKiller',true);
			}
		}else if(numberOfGhouls>0){
			if(this.state.random.frac() <= 0.05){
				this.state.voicesSound.play('restInPieces',true);
			}
		}
	}
	this.destroy();
	if(this.state.soundOptions.soundsOn){
		this.state.blockReappearSound.play('start',true);
	}

	this.state.addToBlocks(this.row, this.col, this.state.groundBlocks);
	this.state.updateTopGroundBlocks();
	this.state.updateBlockedBlocks();

	var bandits = this.state.banditGroup.members;

	for(var i = 0; i<bandits.length; i++){
		gridPosition = this.state.getGridPosition(bandits[i].x, bandits[i].y, 'middle');
		if(gridPosition[0] == this.row && gridPosition[1] == this.col){	
			bandits[i].isAlive = false;
		}		
	}
}

HiddenBlock.prototype.destroy = function(immediate){
	this.timer.removeTimerEvent(this.timerEvent);
	if(this.tileTypeAboveFront){
		var index = this.state.getArrayIndexForTilemapFromRowCol(this.row - 1, this.col);
		this.state.tilemap.layers[5].setTileByIndex(index, this.tileTypeAboveFront);
		this.state.tilemap.layers[5].dirty = true;
	}
	if(this.tileTypeAboveBack){
		var index = this.state.getArrayIndexForTilemapFromRowCol(this.row - 1, this.col);
		this.state.tilemap.layers[2].setTileByIndex(index, this.tileTypeAboveBack);
		this.state.tilemap.layers[2].dirty = true;
	}	
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this, immediate);
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
							this.timer.start();
						}
						this.timerStarted = true;
					}
					break;
				case 'blue':
					if(this.state.blue.x != this.banditX || this.state.blue.y != this.banditY){
						if(this.timerStarted == false){
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

var Cracks = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state;
	this.animation.add('cracks',[114],0.1,false);
	this.animation.play('cracks');
}
Kiwi.extend(Cracks, Kiwi.GameObjects.Sprite);

var BreakingBlock = function(state, x, y){
	Cracks.call(this, state, x, y);
	this.animation.add('moreCracks',[233],0.1,false);
	this.gridPosition = state.getGridPosition(x,y);
	this.row = this.gridPosition[0];
	this.col = this.gridPosition[1];

	this.breakingTimer = this.state.game.time.clock.createTimer('breakingBlockTimer', 0.5, 0, false);
	this.breakingTimerEvent = this.breakingTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.breakingBlockTimer, this);
}
Kiwi.extend(BreakingBlock, Cracks);

BreakingBlock.prototype.update = function(){
	var redGridPosition = this.state.getGridPosition(this.state.red.x, this.state.red.y, 'middle');
	if(redGridPosition[0] + 1 == this.row && redGridPosition[1] == this.col){
		this.animation.play('moreCracks');
		this.breakingTimer.start();
	}
}

BreakingBlock.prototype.breakingBlockTimer = function(){
	var hiddenBlock = this.state.addHiddenBlock([this.row, this.col])
	this.state.updateBlocksAfterAddingHiddenBlock(hiddenBlock);
	this.animation.play('cracks');
}

var StageCoach = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['stagecoach'], x, y, false);
	this.state = state;
	this.animation.add('move',[0,1,2,3,4,5,6,7],0.07,true);
}
Kiwi.extend(StageCoach, Kiwi.GameObjects.Sprite);

StageCoach.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.x < this.state.bps * (this.state.GRID_COLS +2)){
		this.x += 6 * this.state.game.time.rate;
	}
}

var Horse = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['horses'], x, y, false);
	this.state = state;
	this.animation.add('bluerun',[0,1,2,3,4,5,6,7],0.07,true);
	this.animation.add('redrun',[8,9,10,11,12,13,14,15],0.07,true);
}
Kiwi.extend(Horse, Kiwi.GameObjects.Sprite);

Horse.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.state.name == 'gameState'){
		if(this.x < this.state.bps * (this.state.GRID_COLS +2)){
			this.x += 6 * this.state.game.time.rate;
		}
	}
}

var Bomb = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state;

	this.rowPlaced = -1;
	this.colPlaced = -1;

	this.timerStarted = false; 

	this.animation.add('idle',[57],0.1,false);
	this.animation.add('idleground',[60],0.1,false);
	this.animation.add('explode',[61,341,64,340,63,339,62,338,58,59],0.12,false);
	this.animation.play('idle');

	this.animation.getAnimation('explode').onComplete.add(function(){console.log(this);this.explode();}, this);

	this.timerAnimation = this.state.game.time.clock.createTimer('bombAnimation',1,0,false);
	this.timerAnimationEvent = this.timerAnimation.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.explodeAnimation, this);

}
Kiwi.extend(Bomb, Kiwi.GameObjects.Sprite);

Bomb.prototype.explode = function(){
	this.state.blastBlock([this.rowPlaced, this.colPlaced-1],this.placedBy); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced-2],this.placedBy);
	this.state.blastBlock([this.rowPlaced, this.colPlaced],this.placedBy);	
	this.state.blastBlock([this.rowPlaced, this.colPlaced+1],this.placedBy); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced+2],this.placedBy);
	var bandits = this.state.banditGroup.members;
	var ghouls = this.state.ghoulGroup.members;
	if(this.state.soundOptions.soundsOn){
		this.state.bombSound.play();	
	}
	for(var i = 0; i < bandits.length; i++){
		gridPosition = this.state.getGridPosition(bandits[i].x, bandits[i].y, 'middle');
		if(gridPosition[0] == this.rowPlaced && gridPosition[1] >= this.colPlaced-2 && gridPosition[1] <= this.colPlaced+2){
			bandits[i].isAlive = false;
		}
	}
	for(var i = 0; i < ghouls.length; i++){
		gridPosition = this.state.getGridPosition(ghouls[i].x, ghouls[i].y, 'middle');
		if(gridPosition[0] == this.rowPlaced && gridPosition[1] >= this.colPlaced-2 && gridPosition[1] <= this.colPlaced+2){
			ghouls[i].animation.play('diestatic'+ghouls[i].facing);
			ghouls[i].facing = 'none';
			ghouls[i].singleBlockDeath('fast');	
			if(ghouls[i].objType() == 'Ghoul'){
				this.placedByBandit.grayGhoulsKilled++;
			}else if(ghouls[i].objType() == 'BlueGhoul'){
				this.placedByBandit.blueGhoulsKilled++;
			}else if(ghouls[i].objType() == 'RedGhoul'){
				this.placedByBandit.redGhoulsKilled++;
			}else if(ghouls[i].objType() == 'BlackGhoul'){
				this.placedByBandit.blackGhoulsKilled++;
			}
			this.state.addGhoulKill(this.placedByBandit.color);						
		}
	}	
	this.destroy();
}

Bomb.prototype.explodeAnimation = function(){
	this.animation.play('explode');
}

Bomb.prototype.startTimer = function(){
	this.timerStarted = true;
	this.timerAnimation.start();
}

Bomb.prototype.destroy = function(immediate){
	this.timerAnimation.removeTimerEvent(this.timerAnimationEvent);
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this, immediate);
}

Bomb.prototype.hide = function(){
	this.x = -3*this.state.bps;
	this.y = -3*this.state.bps;
}

var Potion = function(state, x, y, type){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.state = state;
	this.type = type; 

	this.animation.add('whiskey',[116],0.1,false);
	this.animation.play('whiskey');
}
Kiwi.extend(Potion, Kiwi.GameObjects.Sprite);

Potion.prototype.objType = function(){
	return 'Potion';
}

var Digit = function(state, x, y, color, index){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['digits'], x, y, false);
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
		case 'ghoul':
			this.animation.add('skull',[21],0.1,false);
			this.animation.add('dot',[22],0.1,false);
			break;
	}

	Digit.prototype.resetCounter = function(){
		this.animation.play('0');
	}
}
Kiwi.extend(Digit, Kiwi.GameObjects.Sprite);

Digit.prototype.increaseByOne = function(){
	if(this.animation.currentAnimation.name == '5' && this.index == 3){
		this.animation.play('0');
		return 1;
	}else{
		if(this.animation.currentAnimation.name == '9'){
			this.animation.play('0');
			return 1; 
		}else{
			this.animation.play((parseInt(this.animation.currentAnimation.name)+1).toString());
			return 0;
		}
	}
}

var BigDigit = function(state, x, y, color, index, type){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.color = color;
	this.state = state;
	this.index = index;
	this.type = type; 
	this.originalx = x;
	this.originaly = y;

	switch(color){
		case 'blue':
			this.animation.add('0',[152],0.1,false);
			this.animation.add('1',[153],0.1,false); 
			this.animation.add('2',[154],0.1,false);
			this.animation.add('3',[155],0.1,false); 
			this.animation.add('4',[156],0.1,false);
			this.animation.add('5',[157],0.1,false); 
			this.animation.add('6',[158],0.1,false);
			this.animation.add('7',[159],0.1,false); 
			this.animation.add('8',[160],0.1,false);
			this.animation.add('9',[161],0.1,false); 	
			this.animation.add('cycle',[152,153,154,155,156,157,158,159,160,161],0.06,true);
			this.animation.add('bomb',[10],0.1,false);											
			break;
		case 'red':
			this.animation.add('0',[170],0.1,false);
			this.animation.add('1',[171],0.1,false); 
			this.animation.add('2',[172],0.1,false);
			this.animation.add('3',[173],0.1,false); 
			this.animation.add('4',[174],0.1,false);
			this.animation.add('5',[175],0.1,false); 
			this.animation.add('6',[176],0.1,false);
			this.animation.add('7',[177],0.1,false); 
			this.animation.add('8',[178],0.1,false);
			this.animation.add('9',[179],0.1,false); 
			this.animation.add('cycle',[170,171,172,173,174,175,176,177,178,179],0.06,true);	
			this.animation.add('bomb',[10],0.1,false);																									
			break;
		case 'black':
			this.animation.add('0',[188],0.1,false);
			this.animation.add('1',[189],0.1,false); 
			this.animation.add('2',[190],0.1,false);
			this.animation.add('3',[191],0.1,false); 
			this.animation.add('4',[192],0.1,false);
			this.animation.add('5',[193],0.1,false); 
			this.animation.add('6',[194],0.1,false);
			this.animation.add('7',[195],0.1,false); 
			this.animation.add('8',[196],0.1,false);
			this.animation.add('9',[197],0.1,false); 
			this.animation.add('cycle',[188,189,190,191,192,193,194,195,196,197],0.06,true);	
			break;
	}

	BigDigit.prototype.resetCounter = function(){
		this.animation.play('0');
	}
}
Kiwi.extend(BigDigit, Kiwi.GameObjects.Sprite);

var BetweenScreenIcon = function(state, type, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['betweenScreen'], x, y, false);

	this.state = state;
	this.type = type;

	this.animation.add('money',[3],0.1,false);
	this.animation.add('death',[2],0.1,false);
	this.animation.add('time',[4],0.1,false);
	this.animation.add('bonus2',[0],0.1,false);
	this.animation.add('bonus3',[1],0.1, false);
	this.animation.add('star',[5],0.1,false);

	if(this.type == 'bonus'){
		this.animation.play('bonus2');		
	}else{
		this.animation.play(type);
	}
}
Kiwi.extend(BetweenScreenIcon, Kiwi.GameObjects.Sprite);

var BetweenScreenStar = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['icons'], x, y, false);

	this.state = state; 

	this.animation.add('star', [10], 0.1, false);
	this.animation.play('star');
}
Kiwi.extend(BetweenScreenStar, Kiwi.GameObjects.Sprite);


var Icon = function(state, x, y, type){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['icons'], x, y, true);

	this.state = state;
	this.type = type;
	this.isDown = false;

	switch(type){
		case 'play':
			this.animation.add('on', [2], 0.1, false);
			this.animation.add('hover', [3], 0.1, false);
		 	break;
		case 'restart':
			this.animation.add('on', [4], 0.1, false);
			this.animation.add('hover', [5], 0.1, false);
			break;
		case 'home':
			this.animation.add('on', [0], 0.1, false);
			this.animation.add('hover', [1], 0.1, false);
			break;
	}

	this.animation.play('on');
	this.alpha = 0.3;

	this.input.onEntered.add(Icon.prototype.playHover, this);
	this.input.onLeft.add(Icon.prototype.playOff, this);
	this.input.onUp.add(Icon.prototype.mouseClicked, this);
	this.input.onDown.add(MenuIcon.prototype.playDown, this);	
}
Kiwi.extend(Icon, Kiwi.GameObjects.Sprite);

Icon.prototype.mouseClicked = function(){
	if(this.isDown == true){
		this.y -= 2;
		this.isDown = false;
		if(this.state.game.soundOptions.soundsOn){
			this.state.game.playClickOffSound(this.state.random.integerInRange(0,3));
		}		
	}
	switch(this.type){
		case 'play':
			this.state.stopCutScene();
			this.state.tweenOutCurtains(this.state.showLevelScreen);
			break;
		case 'restart':
			this.state.stopCutScene();
			this.state.currentLevel-=2;
			if(this.state.soundOptions.musicOn){
				this.state.musicSound.stop();
			}
			this.state.tweenOutCurtains(this.state.restartLevel);
			break;
		case 'home':
			this.state.stopCutScene();
			if(this.state.soundOptions.musicOn){
				this.state.musicSound.stop();
			}
			this.state.tweenOutCurtains(this.state.switchToTitleStateFromBetweenScreen);
			break;			
	}
}

Icon.prototype.playHover = function(){
	MenuIcon.prototype.playHover.call(this);
	this.alpha = 1;
	if(this.type != 'play'){
		this.state.playIcon.playOff();
	}
}

Icon.prototype.playOff = function(){
	MenuIcon.prototype.playOff.call(this);
	this.alpha = 0.3;
}

var MenuIcon = function(state, x, y, type){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['menu'], x, y, true);

	this.state = state;
	this.type = type; 
	this.isDown = false;

	switch(type){
		case 'sound':
			this.animation.add('off',[0],0.1,false);
			this.animation.add('on',[4],0.1,false);
			this.animation.add('hoveroff',[2],0.1,false);
			this.animation.add('hoveron',[8],0.1,false);
			break;
		case 'music':
			this.animation.add('off',[1],0.1,false);
			this.animation.add('on',[5],0.1,false);
			this.animation.add('hoveroff',[3],0.1,false);
			this.animation.add('hoveron',[9],0.1,false);
			break;
		case 'restart':
			this.animation.add('on',[6],0.1,false);
			this.animation.add('hover',[10],0.1,false);	
			break;
		case 'home':
			this.animation.add('on',[7],0.1,false);
			this.animation.add('hover',[11],0.1,false);		
			break;	
		case '1player':
			this.animation.add('on',[12],0.1,false);
			this.animation.add('hover',[13],0.1,false);
			break;
		case '2player':
			this.animation.add('on',[14],0.1,false);
			this.animation.add('hover',[15],0.1,false);
			break;
		case 'controls':
			this.animation.add('on',[16],0.1,false);
			this.animation.add('hover',[17],0.1,false);
			break;
		case 'backControls':
			this.animation.add('on',[18],0.1,false);
			this.animation.add('hover',[19],0.1,false);
			break;
		case 'backLevelSelection':
			this.animation.add('on',[18],0.1,false);
			this.animation.add('hover',[19],0.1,false);
			break;						
	}
	this.animation.play('on');

	this.input.onEntered.add(MenuIcon.prototype.playHover, this);
	this.input.onLeft.add(MenuIcon.prototype.playOff, this);
	this.input.onUp.add(MenuIcon.prototype.mouseClicked, this);
	this.input.onDown.add(MenuIcon.prototype.playDown, this);
}
Kiwi.extend(MenuIcon, Kiwi.GameObjects.Sprite);

MenuIcon.prototype.playDown = function(){
	if(this.isDown == false){
		this.y += 2; 
		this.isDown = true;
		if(this.state.game.soundOptions.soundsOn){
			console.log('playing sound');
			this.state.game.playClickOnSound(this.state.random.integerInRange(0,3));
		}
	}
}

MenuIcon.prototype.mouseClicked = function(){
	if(this.isDown == true){
		this.y -= 2;
		this.isDown = false;
		if(this.state.game.soundOptions.soundsOn){
			this.state.game.playClickOffSound(this.state.random.integerInRange(0,3));	
		}	
	}
	switch(this.type){
		case 'sound':
			if(this.state.soundOptions.soundsOn == true){
				this.state.soundOptions.soundsOn = false;
				this.animation.play('hoveroff');
			}else{
				this.state.soundOptions.soundsOn = true;
				this.animation.play('hoveron');
			}
			break;
		case 'music':
			if(this.state.soundOptions.musicOn == true){
				this.state.soundOptions.musicOn = false;
				this.state.musicSound.pause();
				this.animation.play('hoveroff');
			}else{
				this.state.soundOptions.musicOn = true;
				this.state.musicSound.resume();
				this.animation.play('hoveron');
			}
			break;
		case 'restart':
			this.state.currentLevel--;
			this.state.closeMenu('noresume');
			if(this.state.soundOptions.musicOn){
				this.state.musicSound.stop();
			}
			this.timer = this.state.game.time.clock.createTimer('restartLevelTimer',0.9,0,false);
			this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.restartLevel, this);
			this.timer.start();
			break;
		case 'home':
			if(this.state.game.gamepads){
				this.state.removeAllGamepadSignals();
			}
			this.state.destroyEverything(true);
			this.state.gameTimer.removeTimerEvent(this.state.gameTimerEvent);
			if(this.state.soundOptions.musicOn){
				this.state.musicSound.stop();
			}
			this.state.game.states.switchState('titleState');
			break;
		case '1player':
			this.state.game.numPlayers = 1;
			this.timer = this.state.game.time.clock.createTimer('1playerTimer', 0.2, 0, false);
			this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.state.startGame, this.state);
			this.timer.start();
			break;
		case '2player':
			this.state.game.numPlayers = 2;
			this.timer = this.state.game.time.clock.createTimer('2playerTimer', 0.2, 0, false);
			this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.state.startGame, this.state);
			this.timer.start();
			break;
		case 'controls':
			this.timer = this.state.game.time.clock.createTimer('controlsTimer', 0.2, 0, false);
			this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.state.showControls, this.state);
			this.timer.start();
			break;
		case 'backControls':
			this.timer = this.state.game.time.clock.createTimer('backControlsTimer', 0.2, 0, false);
			this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.state.hideControls, this.state);
			this.timer.start();
			break;
		case 'backLevelSelection':
			this.timer = this.state.game.time.clock.createTimer('backLevelSelectionTimer', 0.2, 0, false);
			this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.switchToTitleState, this);
			this.timer.start();		
			break;
	}
}

MenuIcon.prototype.switchToTitleState = function(){
	this.game.states.switchState('titleState');
}

MenuIcon.prototype.restartLevel = function(){
	this.state.destroyEverything(false);
	this.state.moveBanditsOffscreen();
	this.state.levelOver(false);
	this.state.resumeGame();
}

MenuIcon.prototype.playHover = function(){
	if(this.type == 'sound'){
		if(this.state.soundOptions.soundsOn){
			this.animation.play('hoveron');
		}else{
			this.animation.play('hoveroff');
		}
	}else if (this.type == 'music'){
		if(this.state.soundOptions.musicOn){
			this.animation.play('hoveron');
		}else{
			this.animation.play('hoveroff');
		}
	}else if (this.type == 'backLevelSelection'){
		LevelSelectionIcon.prototype.removeAllHovers.call(this);
		this.state.changeSelectedIconByLevel(this.state.availableIcons.length + 1); //so that selected icon is the back button
		this.animation.play('hover');
	}else{
		this.animation.play('hover');
	}
}

MenuIcon.prototype.playOff = function(){
	if(this.isDown == true){
		this.y -= 2;
		this.isDown = false;
	}	
	if(this.type == 'sound'){
		if(this.state.soundOptions.soundsOn){
			this.animation.play('on');
		}else{
			this.animation.play('off');
		}
	}else if(this.type == 'music'){
		if(this.state.soundOptions.musicOn){
			this.animation.play('on');
		}else{
			this.animation.play('off');
		}
	}else{
		this.animation.play('on');
	}
}

var LevelSelectionIcon = function(state, x, y, number){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['level_selection'], x, y, true);

	this.state = state;
	this.number = number;
	this.isDown = false;

	switch(this.number){
		case 10:
			this.animation.add('off', [0], 0.1, false);
			this.animation.add('on0', [1], 0.1, false);
			this.animation.add('hover0', [2], 0.1, false);
			this.animation.add('on1', [3], 0.1, false);
			this.animation.add('hover1', [4], 0.1, false);
			this.animation.add('on2', [5], 0.1, false);
			this.animation.add('hover2', [6], 0.1, false);
			this.animation.add('on3', [7], 0.1, false);
			this.animation.add('hover3', [8], 0.1, false);
			break;
		case 11:
			this.animation.add('off', [9], 0.1, false);
			this.animation.add('on0', [10], 0.1, false);
			this.animation.add('hover0', [11], 0.1, false);
			this.animation.add('on1', [12], 0.1, false);
			this.animation.add('hover1', [13], 0.1, false);
			this.animation.add('on2', [14], 0.1, false);
			this.animation.add('hover2', [15], 0.1, false);
			this.animation.add('on3', [16], 0.1, false);
			this.animation.add('hover3', [17], 0.1, false);
			break;		
		case 12:
			this.animation.add('off', [18], 0.1, false);
			this.animation.add('on0', [19], 0.1, false);
			this.animation.add('hover0', [20], 0.1, false);
			this.animation.add('on1', [21], 0.1, false);
			this.animation.add('hover1', [22], 0.1, false);
			this.animation.add('on2', [23], 0.1, false);
			this.animation.add('hover2', [24], 0.1, false);
			this.animation.add('on3', [25], 0.1, false);
			this.animation.add('hover3', [26], 0.1, false);
			break;		
		case 13:
			this.animation.add('off',[27],0.1,false);
			this.animation.add('on0', [28], 0.1, false);
			this.animation.add('hover0', [29], 0.1, false);
			this.animation.add('on1',[30],0.1,false);
			this.animation.add('hover1',[31],0.1 ,false);
			this.animation.add('on2', [32], 0.1, false);
			this.animation.add('hover2', [33], 0.1, false);
			this.animation.add('on3', [34], 0.1, false);
			this.animation.add('hover3', [35], 0.1, false);
			break;		
		case 14:
			this.animation.add('off',[36],0.1,false);
			this.animation.add('on0', [37], 0.1, false);
			this.animation.add('hover0', [38], 0.1, false);
			this.animation.add('on1',[39],0.1,false);
			this.animation.add('hover1',[40],0.1 ,false);
			this.animation.add('on2', [41], 0.1, false);
			this.animation.add('hover2', [42], 0.1, false);
			this.animation.add('on3', [43], 0.1, false);
			this.animation.add('hover3', [44], 0.1, false);
			break;		
		case 15:
			this.animation.add('off',[45],0.1,false);
			this.animation.add('on0', [46], 0.1, false);
			this.animation.add('hover0', [47], 0.1, false);
			this.animation.add('on1',[48],0.1,false);
			this.animation.add('hover1',[49],0.1 ,false);
			this.animation.add('on2', [50], 0.1, false);
			this.animation.add('hover2', [51], 0.1, false);
			this.animation.add('on3', [52], 0.1, false);
			this.animation.add('hover3', [53], 0.1, false);
			break;		
		case 16:
			this.animation.add('off',[54],0.1,false);
			this.animation.add('on0', [55], 0.1, false);
			this.animation.add('hover0', [56], 0.1, false);
			this.animation.add('on1',[57],0.1,false);
			this.animation.add('hover1',[58],0.1 ,false);
			this.animation.add('on2', [59], 0.1, false);
			this.animation.add('hover2', [60], 0.1, false);
			this.animation.add('on3', [61], 0.1, false);
			this.animation.add('hover3', [62], 0.1, false);
			break;
		case 17:
			this.animation.add('off',[63],0.1,false);
			this.animation.add('on0', [64], 0.1, false);
			this.animation.add('hover0', [65], 0.1, false);
			this.animation.add('on1',[66],0.1,false);
			this.animation.add('hover1',[67],0.1 ,false);
			this.animation.add('on2', [68], 0.1, false);
			this.animation.add('hover2', [69], 0.1, false);
			this.animation.add('on3', [70], 0.1, false);
			this.animation.add('hover3', [71], 0.1, false);
			break;		
		case 18:
			this.animation.add('off',[72],0.1,false);
			this.animation.add('on0', [73], 0.1, false);
			this.animation.add('hover0', [74], 0.1, false);
			this.animation.add('on1',[75],0.1,false);
			this.animation.add('hover1',[76],0.1 ,false);
			this.animation.add('on2', [77], 0.1, false);
			this.animation.add('hover2', [78], 0.1, false);
			this.animation.add('on3', [79], 0.1, false);
			this.animation.add('hover3', [80], 0.1, false);
			break;		
		case 19:
			this.animation.add('off',[81],0.1,false);
			this.animation.add('on0', [82], 0.1, false);
			this.animation.add('hover0', [83], 0.1, false);
			this.animation.add('on1',[84],0.1,false);
			this.animation.add('hover1',[85],0.1 ,false);
			this.animation.add('on2', [86], 0.1, false);
			this.animation.add('hover2', [87], 0.1, false);
			this.animation.add('on3', [88], 0.1, false);
			this.animation.add('hover3', [89], 0.1, false);
			break;			
		case 1:
			this.animation.add('off',[90],0.1,false);
			this.animation.add('on0', [91], 0.1, false);
			this.animation.add('hover0', [92], 0.1, false);
			this.animation.add('on1',[93],0.1,false);
			this.animation.add('hover1',[94],0.1 ,false);
			this.animation.add('on2', [95], 0.1, false);
			this.animation.add('hover2', [96], 0.1, false);
			this.animation.add('on3', [97], 0.1, false);
			this.animation.add('hover3', [98], 0.1, false);
			break;
		case 20:
			this.animation.add('off',[99],0.1,false);
			this.animation.add('on0', [100], 0.1, false);
			this.animation.add('hover0', [101], 0.1, false);
			this.animation.add('on1',[102],0.1,false);
			this.animation.add('hover1',[103],0.1 ,false);
			this.animation.add('on2', [104], 0.1, false);
			this.animation.add('hover2', [105], 0.1, false);
			this.animation.add('on3', [106], 0.1, false);
			this.animation.add('hover3', [107], 0.1, false);
			break;				
		case 2:
			this.animation.add('off',[108],0.1,false);
			this.animation.add('on0', [109], 0.1, false);
			this.animation.add('hover0', [110], 0.1, false);
			this.animation.add('on1',[111],0.1,false);
			this.animation.add('hover1',[112],0.1 ,false);
			this.animation.add('on2', [113], 0.1, false);
			this.animation.add('hover2', [114], 0.1, false);
			this.animation.add('on3', [115], 0.1, false);
			this.animation.add('hover3', [116], 0.1, false);
			break;
		case 3:
			this.animation.add('off',[117],0.1,false);
			this.animation.add('on0', [118], 0.1, false);
			this.animation.add('hover0', [119], 0.1, false);
			this.animation.add('on1',[120],0.1,false);
			this.animation.add('hover1',[121],0.1 ,false);
			this.animation.add('on2', [122], 0.1, false);
			this.animation.add('hover2', [123], 0.1, false);
			this.animation.add('on3', [124], 0.1, false);
			this.animation.add('hover3', [125], 0.1, false);
			break;
		case 4:
			this.animation.add('off',[126],0.1,false);
			this.animation.add('on0', [127], 0.1, false);
			this.animation.add('hover0', [128], 0.1, false);
			this.animation.add('on1',[129],0.1,false);
			this.animation.add('hover1',[130],0.1 ,false);
			this.animation.add('on2', [131], 0.1, false);
			this.animation.add('hover2', [132], 0.1, false);
			this.animation.add('on3', [133], 0.1, false);
			this.animation.add('hover3', [134], 0.1, false);
			break;
		case 5:
			this.animation.add('off',[135],0.1,false);
			this.animation.add('on0', [136], 0.1, false);
			this.animation.add('hover0', [137], 0.1, false);
			this.animation.add('on1',[138],0.1,false);
			this.animation.add('hover1',[139],0.1 ,false);
			this.animation.add('on2', [140], 0.1, false);
			this.animation.add('hover2', [141], 0.1, false);
			this.animation.add('on3', [142], 0.1, false);
			this.animation.add('hover3', [143], 0.1, false);
			break;
		case 6:
			this.animation.add('off',[144],0.1,false);
			this.animation.add('on0', [145], 0.1, false);
			this.animation.add('hover0', [146], 0.1, false);
			this.animation.add('on1',[147],0.1,false);
			this.animation.add('hover1',[148],0.1 ,false);
			this.animation.add('on2', [149], 0.1, false);
			this.animation.add('hover2', [150], 0.1, false);
			this.animation.add('on3', [151], 0.1, false);
			this.animation.add('hover3', [152], 0.1, false);
			break;
		case 7:
			this.animation.add('off',[153],0.1,false);
			this.animation.add('on0', [154], 0.1, false);
			this.animation.add('hover0', [155], 0.1, false);
			this.animation.add('on1',[156],0.1,false);
			this.animation.add('hover1',[157],0.1 ,false);
			this.animation.add('on2', [158], 0.1, false);
			this.animation.add('hover2', [159], 0.1, false);
			this.animation.add('on3', [160], 0.1, false);
			this.animation.add('hover3', [161], 0.1, false);
			break;
		case 8:
			this.animation.add('off',[162],0.1,false);
			this.animation.add('on0', [163], 0.1, false);
			this.animation.add('hover0', [164], 0.1, false);
			this.animation.add('on1',[165],0.1,false);
			this.animation.add('hover1',[166],0.1 ,false);
			this.animation.add('on2', [167], 0.1, false);
			this.animation.add('hover2', [168], 0.1, false);
			this.animation.add('on3', [169], 0.1, false);
			this.animation.add('hover3', [170], 0.1, false);
			break;
		case 9:
			this.animation.add('off',[171],0.1,false);
			this.animation.add('on0', [172], 0.1, false);
			this.animation.add('hover0', [173], 0.1, false);
			this.animation.add('on1',[174],0.1,false);
			this.animation.add('hover1',[175],0.1 ,false);
			this.animation.add('on2', [176], 0.1, false);
			this.animation.add('hover2', [177], 0.1, false);
			this.animation.add('on3', [178], 0.1, false);
			this.animation.add('hover3', [179], 0.1, false);
			break;
	}
}
Kiwi.extend(LevelSelectionIcon, Kiwi.GameObjects.Sprite);

LevelSelectionIcon.prototype.playHover = function(){
	this.removeAllHovers();
	this.state.changeSelectedIconByLevel(this.number);
	var stars = this.state.game.levelsData[this.number-1][this.state.game.numPlayers-1].stars;
	this.animation.play('hover' + stars);
}

LevelSelectionIcon.prototype.playOn = function(){
	var stars = this.state.game.levelsData[this.number-1][this.state.game.numPlayers-1].stars;
	this.animation.play('on' + stars);
}

LevelSelectionIcon.prototype.playDown = function(){
	if(this.isDown == false){
		this.y += 2;
		this.isDown = true;
		if(this.state.game.soundOptions.soundsOn){
			this.state.game.playClickOnSound(this.state.random.integerInRange(0,3));
		}
	}
}

LevelSelectionIcon.prototype.removeAllHovers = function(){
	var icons = this.state.levelSelectionGroup.members;
	for(var i = 0; i < icons.length; i++){
		if(icons[i].animation.currentAnimation.name.substring(0,5) == 'hover'){
			if(icons[i].type && icons[i].type.substring(0,4) == 'back'){
				icons[i].playOff();
			}else{
				icons[i].playOn();
			}
		}
	}
}

LevelSelectionIcon.prototype.addHovering = function(){
	this.input.onEntered.add(LevelSelectionIcon.prototype.playHover, this);
	this.input.onLeft.add(LevelSelectionIcon.prototype.playOn, this);			
}

LevelSelectionIcon.prototype.addClicking = function(){
	this.input.onUp.add(LevelSelectionIcon.prototype.startStartLevelTimer, this);
	this.input.onDown.add(LevelSelectionIcon.prototype.playDown, this);
}

LevelSelectionIcon.prototype.startStartLevelTimer = function(){
	if(this.isDown == true){
		this.y -= 2;
		this.isDown = false;
		if(this.state.game.soundOptions.soundsOn){
			this.state.game.playClickOffSound(this.state.random.integerInRange(0,3));
		}		
	}			
	this.timer = this.state.game.time.clock.createTimer('iconTimer', 0.2, 0, false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.startLevel, this);
	this.timer.start();
}

LevelSelectionIcon.prototype.startLevel = function(){
	this.state.startGame(this.number);
}

LevelSelectionIcon.prototype.objType = function(){
	return "LevelSelectionIcon";
}



