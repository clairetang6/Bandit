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
	return this.grayGhoulsKilled + this.blueGhoulsKilled + this.redGhoulsKilled + this.blackGhoulsKilled;
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

Bandit.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.state.showingLevelScreen == false){
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
		 	if(this.fireKey.isDown){
				this.animation.play('fire' + this.facing);
				if(this.canShoot){
					var blastedBlockPosition = this.state.getBlastedBlockPosition(southGridPosition, this.facing, this.state.groundBlocks);
					this.state.blastBlock(blastedBlockPosition, this.color);
				}
			}
			else if(this.upKey.isDown){
				var gridPosition = this.state.getGridPosition(this.x, this.y, 'north');
				var ladderPixelNum = this.state.getPixelNumberForGridPosition(gridPosition,'west') + this.bps/2;
				if(this.x+this.bps/2>ladderPixelNum-15 && this.x+this.bps/2<ladderPixelNum+15){	
					if(this.state.onBlockType(this.state.topLadderBlocks, gridPosition)){
						var pixelNum = this.state.getPixelNumberForGridPosition(gridPosition,'north');
						if(this.y>6+pixelNum){
							this.y-=3;
							if(this.animation.currentAnimation.name!='climb'){
								this.animation.play('climb');
							}				
						}else{
							this.y=pixelNum;
							this.animation.play('idle'+this.facing);			
						}
					}else if(this.state.onBlockType(this.state.ladderBlocks, gridPosition)){
						if(this.y>3)
							this.y-=3;
						if(this.animation.currentAnimation.name != 'climb')
							this.animation.play('climb');
					}
				}
			}
			else if(this.rightKey.isDown){
				this.facing = 'right';
				if(this.state.onBlockType(this.state.rightBlockedBlocks, southGridPosition)){
					var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'east');
					if(this.x+this.bps<pixelNum-6){
						this.x +=5;
					}else{
						this.x = pixelNum-this.bps+1;
						this.animation.play('idle'+this.facing);
					}
				}
				else{
					if(!this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
						this.x+=5;
						if(this.animation.currentAnimation.name != 'moveright')
							this.animation.play('moveright');
					}
				}
			}
			else if(this.leftKey.isDown){
				this.facing = 'left';
				if(this.state.onBlockType(this.state.leftBlockedBlocks, southGridPosition)){
					var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'west');
					if(this.x>pixelNum+6){
						this.x-=5;
					}else{
						this.x = pixelNum;
						this.animation.play('idle'+this.facing);
					}
				}else{
					if(!this.state.onBlockType(this.state.groundBlocks, southGridPosition)){
						this.x-=5;
						if(this.animation.currentAnimation.name != 'moveleft')
							this.animation.play('moveleft');
					}
				}
			}
			else if(this.downKey.isDown){
				var ladderPixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'west') + this.bps/2;
				var belowFeetPosition = this.state.getGridPosition(this.x, this.y+1,'south');				
				if(this.x+this.bps/2>ladderPixelNum-15 && this.x+this.bps/2<ladderPixelNum+15){	
					if(this.state.onBlockType(this.state.firstLadderBlocks, southGridPosition)){
						if(!this.state.onBlockType(this.state.groundBlocks, belowFeetPosition)){
							this.y+=3;
						}else{
							var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition,'south');
							if(this.y+this.bps<pixelNum-6){
								this.y+=3;
								if(this.animation.currentAnimation.name!='climb'){
									this.animation.play('climb');
								}				
							}else{
								this.transform.y=pixelNum-this.bps+1; 
								this.animation.play('idle'+this.facing);
							}
						}
					}else if(this.state.onBlockType(this.state.ladderBlocks, belowFeetPosition)){
						if(this.y<this.bps*this.state.GRID_ROWS)
							this.y+=5;
						else
							this.y = this.bps*this.state.GRID_ROWS;
						if(this.animation.currentAnimation.name != 'climb')
							this.animation.play('climb');
					}else{
						if(this.state.onBlockType(this.state.topGroundBlocks, southGridPosition)){
							if(this.downKey.justPressed(30)){
								if(this.bombClock.elapsed() > 5){
									this.placeBomb();
								}
							}
						}
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
			}
		}
		else{
			this.deathCount();
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
		bomb = this.bombs.pop();
		bomb.x = this.state.getPixelNumberForGridPosition(this.state.getGridPosition(this.x, this.y,'middle'),'west');
		bomb.y = this.state.getPixelNumberForGridPosition(this.state.getGridPosition(this.x, this.y,'middle'),'north');	
		var bombGridPosition = this.state.getGridPosition(bomb.x,bomb.y);
		bomb.rowPlaced = bombGridPosition[0];
		bomb.colPlaced = bombGridPosition[1]; 
		bomb.startTimer();
		bomb.placedBy = this.color;
		if(this.state.soundsOn){
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
	if(this.state.currentLevel >=16){
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
			if(ghoul!='undefined'){
				ghoul.animation.play('explode');
				if(this.state.soundsOn){
					this.state.bombSound.play();	
				}	
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
	if(this.state.soundsOn){
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
	if(this.state.soundsOn){
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
	this.animation.add('cracks',[150],.1,false);
	this.animation.play('cracks');
}
Kiwi.extend(Cracks, Kiwi.GameObjects.Sprite);

var StageCoach = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['stagecoach'], x, y, false);
	this.state = state;
	this.animation.add('move',[0,1,2,3,4,5,6,7],0.1,true);
}
Kiwi.extend(StageCoach, Kiwi.GameObjects.Sprite);

StageCoach.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.x < this.state.bps * (this.state.GRID_COLS +2)){
		this.x += 4;
	}
}

var Horse = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['horses'], x, y, false);
	this.state = state;
	this.animation.add('bluerun',[0,1,2,3,4,5,6,7],0.1,true);
	this.animation.add('redrun',[8,9,10,11,12,13,14,15],0.1,true);
}
Kiwi.extend(Horse, Kiwi.GameObjects.Sprite);

Horse.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.x < this.state.bps * (this.state.GRID_COLS +2)){
		this.x += 4;
	}
}

var Bomb = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
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
	this.state.blastBlock([this.rowPlaced, this.colPlaced-1],this.placedBy); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced-2],this.placedBy);
	this.state.blastBlock([this.rowPlaced, this.colPlaced],this.placedBy);	
	this.state.blastBlock([this.rowPlaced, this.colPlaced+1],this.placedBy); 
	this.state.blastBlock([this.rowPlaced, this.colPlaced+2],this.placedBy);
	var bandits = this.state.banditGroup.members;
	var ghouls = this.state.ghoulGroup.members;
	if(this.state.soundsOn){
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
		}
	}	
	this.destroy();
}

Bomb.prototype.explodeAnimation = function(){
	this.animation.play('explode');
}

Bomb.prototype.startTimer = function(){
	this.timerStarted = true;
	this.timer.start();
	this.timerAnimation.start();
}

Bomb.prototype.destroy = function(immediate){
	this.timer.removeTimerEvent(this.timerEvent);
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

var BigDigit = function(state, x, y, color, index){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.color = color;
	this.state = state;
	this.index = index; 
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

var BetweenScreenIcon = function(state, type){
	switch(type){
		case 'money':
			var yPos = 100;
			break;
		case 'death':
			var yPos = 195;
			break;
		case 'time':
			var yPos = 290;
			break;
	}
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['betweenScreen'], state.BETWEEN_SCREEN_XPOS, yPos, false);

	this.state = state;
	this.type = type;

	this.animation.add('money',[1],0.1,false);
	this.animation.add('death',[0],0.1,false);
	this.animation.add('time',[2],0.1,false);

	this.animation.play(type);
}
Kiwi.extend(BetweenScreenIcon, Kiwi.GameObjects.Sprite);

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
	}
}

MenuIcon.prototype.mouseClicked = function(){
	if(this.isDown == true){
		this.y -= 2;
		this.isDown = false;
	}
	switch(this.type){
		case 'sound':
			if(this.state.soundsOn == true){
				this.state.soundsOn = false;
				this.animation.play('hoveroff');
			}else{
				this.state.soundsOn = true;
				this.animation.play('hoveron');
			}
			break;
		case 'music':
			if(this.state.musicOn == true){
				this.state.musicOn = false;
				this.state.musicSound.pause();
				this.animation.play('hoveroff');
			}else{
				this.state.musicOn = true;
				this.state.musicSound.resume();
				this.animation.play('hoveron');
			}
			break;
		case 'restart':
			this.state.currentLevel--;
			this.state.closeMenu();
			if(this.state.musicOn){
				this.state.musicSound.stop();
			}		
			this.state.levelOver(false);
			break;
		case 'home':
			this.state.destroyEverything(true);
			this.state.gameTimer.removeTimerEvent(this.state.gameTimerEvent);
			if(this.state.musicOn){
				this.state.musicSound.stop();
			}
			this.state.game.states.switchState('titleState');
			break;
		case '1player':
			this.state.game.numPlayers = 1;
			this.state.game.states.switchState('gameState');
			break;
		case '2player':
			this.state.game.numPlayers = 2;
			this.state.game.states.switchState('gameState');
			break;
		case 'controls':
			this.state.controlsScreen.y = 0;
			this.state.buttonGroup.visible = false;
			this.state.buttonGroup.active = false;
			this.state.backButton.visible = true;
			this.state.backButton.active = true;
			break;
		case 'backControls':
			this.state.controlsScreen.y = -1000;
			this.state.buttonGroup.visible = true;
			this.state.buttonGroup.active = true;
			this.state.backButton.visible = false;
			this.state.backButton.active = false;
			break;
		case 'backLevelSelection':
			this.game.states.switchState('titleState');
			break;
	}
}

MenuIcon.prototype.playHover = function(){
	if(this.type == 'sound'){
		if(this.state.soundsOn){
			this.animation.play('hoveron');
		}else{
			this.animation.play('hoveroff');
		}
	}else if (this.type == 'music'){
		if(this.state.musicOn){
			this.animation.play('hoveron');
		}else{
			this.animation.play('hoveroff');
		}
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
		if(this.state.soundsOn){
			this.animation.play('on');
		}else{
			this.animation.play('off');
		}
	}else if(this.type == 'music'){
		if(this.state.musicOn){
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
			this.animation.add('off',[0],0.1,false);
			this.animation.add('on',[1],0.1,false);
			this.animation.add('hover',[2],0.1,false);
			break;
		case 11:
			this.animation.add('off',[3],0.1,false);
			this.animation.add('on',[4],0.1,false);
			this.animation.add('hover',[5],0.1,false);
			break;		
		case 12:
			this.animation.add('off',[6],0.1,false);
			this.animation.add('on',[7],0.1,false);
			this.animation.add('hover',[8],0.1,false);
			break;		
		case 13:
			this.animation.add('off',[9],0.1,false);
			this.animation.add('on',[10],0.1,false);
			this.animation.add('hover',[11],0.1,false);
			break;		
		case 14:
			this.animation.add('off',[12],0.1,false);
			this.animation.add('on',[13],0.1,false);
			this.animation.add('hover',[14],0.1,false);
			break;		
		case 15:
			this.animation.add('off',[15],0.1,false);
			this.animation.add('on',[16],0.1,false);
			this.animation.add('hover',[17],0.1,false);
			break;		
		case 16:
			this.animation.add('off',[18],0.1,false);
			this.animation.add('on',[19],0.1,false);
			this.animation.add('hover',[20],0.1,false);
			break;
		case 1:
			this.animation.add('off',[21],0.1,false);
			this.animation.add('on',[22],0.1,false);
			this.animation.add('hover',[23],0.1,false);
			break;
		case 2:
			this.animation.add('off',[24],0.1,false);
			this.animation.add('on',[25],0.1,false);
			this.animation.add('hover',[26],0.1,false);
			break;
		case 3:
			this.animation.add('off',[27],0.1,false);
			this.animation.add('on',[28],0.1,false);
			this.animation.add('hover',[29],0.1,false);
			break;
		case 4:
			this.animation.add('off',[30],0.1,false);
			this.animation.add('on',[31],0.1,false);
			this.animation.add('hover',[32],0.1,false);
			break;
		case 5:
			this.animation.add('off',[33],0.1,false);
			this.animation.add('on',[34],0.1,false);
			this.animation.add('hover',[35],0.1,false);
			break;
		case 6:
			this.animation.add('off',[36],0.1,false);
			this.animation.add('on',[37],0.1,false);
			this.animation.add('hover',[38],0.1,false);
			break;
		case 7:
			this.animation.add('off',[39],0.1,false);
			this.animation.add('on',[40],0.1,false);
			this.animation.add('hover',[41],0.1,false);
			break;
		case 8:
			this.animation.add('off',[42],0.1,false);
			this.animation.add('on',[43],0.1,false);
			this.animation.add('hover',[44],0.1,false);
			break;
		case 9:
			this.animation.add('off',[45],0.1,false);
			this.animation.add('on',[46],0.1,false);
			this.animation.add('hover',[47],0.1,false);
			break;
	}
}
Kiwi.extend(LevelSelectionIcon, Kiwi.GameObjects.Sprite);

LevelSelectionIcon.prototype.playHover = function(){
	this.animation.play('hover');
}

LevelSelectionIcon.prototype.playOn = function(){
	this.animation.play('on');
}

LevelSelectionIcon.prototype.playDown = function(){
	if(this.isDown == false){
		this.y += 2;
		this.isDown = true;
	}
}

LevelSelectionIcon.prototype.addHovering = function(){
	this.input.onEntered.add(LevelSelectionIcon.prototype.playHover, this);
	this.input.onLeft.add(LevelSelectionIcon.prototype.playOn, this);			
}

LevelSelectionIcon.prototype.addClicking = function(){
	this.input.onUp.add(LevelSelectionIcon.prototype.startLevel, this);
	this.input.onDown.add(LevelSelectionIcon.prototype.playDown, this);
}

LevelSelectionIcon.prototype.startLevel = function(){
	if(this.isDown == true){
		this.y -= 2; 
		this.isDown = false;
	}
	this.state.currentLevel = this.number;
	this.showingLevelSelectionScreen = false;
	this.state.levelSelectionGroup.active = false;
	this.state.showLevelScreen();
}



