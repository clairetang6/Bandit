var Ghouliath = function(state, x, y, facing){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['ghouliath'], x, y, false);
	this.facing = facing;
	this.state = state;
	this.shouldFall = false;
	this.moveUp = 0;
	this.movingUp = false;
	this.fallen = false;
	this.hiddenBlocksPaused = [];

	this.resumeBlocksTimer = this.state.game.time.clock.createTimer('resumeBlocksTimer',2,0,false);
	this.resumeBlocksTimerEvent = this.resumeBlocksTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.resumeHiddenBlocks, this);

	this.explodeTimer = this.state.game.time.clock.createTimer('explodeTimer',0.5,0,false);
	this.explodeTimerEvent = this.explodeTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.destroy, this);

	this.animation.add('moveright',[3,4,5,6,7,8,9,1,0,2],0.2,true);
	this.animation.add('moveleft',[3,4,5,6,7,8,9,1,0,2],0.2,true);
	this.animation.add('climbright',[10,11,12,2],0.125,false);
	this.animation.add('climbleft',[10,11,12,2],0.125,false);
	this.animation.add('die',[13,14],0.1,true);
	this.animation.add('explode',[15],0.2,false);

	this.animation.play('climbright');
}
Kiwi.extend(Ghouliath, Kiwi.GameObjects.Sprite);

Ghouliath.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	this.shouldCheckDirection = (this.x % this.state.bps == 0 && this.y % this.state.bps == 0); 	
	this.shouldCheckForHiddenBlock = (this.x % (this.state.bps/10) == 0);
	this.justTurned = false;

	if(this.fallen && !this.movingUp && this.shouldCheckDirection){
		this.checkClimbOut();
	}
	
	if(this.shouldFall){
		if(!this.movingUp){
			this.gravity();
		}
	}else{
		if(this.shouldCheckForHiddenBlock){
			this.checkForHiddenBlock();
		}

		if(this.shouldCheckDirection && !this.climbingOut){
			this.gridPosition = this.state.getGridPosition(this.x, this.y);
			switch(this.facing){
				case 'left':
					if(this.x <= 0){
						this.facing = 'right';
						this.justTurned = true;
					}else{
						var checkGroundBlock1 = [this.gridPosition[0], this.gridPosition[1]-1];
						var checkGroundBlock2 = [this.gridPosition[0] + 1, this.gridPosition[1]-1];
						if(this.state.onBlockType(this.state.originalGroundBlocks, checkGroundBlock1) || this.state.onBlockType(this.state.groundBlocks, checkGroundBlock2)){
							this.facing = 'right';
							this.justTurned = true;
						}
					}
					break;
				case 'right':
					if(this.x + 100 >= this.state.bps*this.state.GRID_COLS){
						this.facing = 'left';
						this.justTurned = true;
					}else{
						var checkGroundBlock1 = [this.gridPosition[0], this.gridPosition[1]+2];
						var checkGroundBlock2 = [this.gridPosition[0] + 1, this.gridPosition[1]+2];
						if(this.state.onBlockType(this.state.originalGroundBlocks, checkGroundBlock1) || this.state.onBlockType(this.state.groundBlocks, checkGroundBlock2)){
							this.facing = 'left';
							this.justTurned = true;
						}
					}	
					break;	
			}
		}
	}
	if(!this.justTurned){
		switch(this.facing){
			case 'left':
				if(this.movingUp){
					this.x -= 0.5;
					this.scaleX = -1;
				}else{
					if(this.animation.currentAnimation.name != 'moveleft'){
						this.animation.playAt(0,'moveleft');
					}
					this.x -= 0.5;
					this.scaleX = -1;					
				}
				break;
			case 'right':
				if(this.movingUp){
					this.x += 0.5;
					this.scaleX = 1;
				}else{
					if(this.animation.currentAnimation.name != 'moveright'){
						this.animation.playAt(0,'moveright');
					}
					this.x += 0.5;
					this.scaleX = 1;					
				}
				break;
		}
	}
	if(this.moveUp > 0){
		if(this.moveUp < this.state.bps+50.5){
			if(this.moveUp>50){
				if(this.animation.currentAnimation.name != 'climb' + this.facing){
					this.animation.playAt(0,'climb' + this.facing);
				}
			}
			if(this.moveUp>50){
				if(this.moveUp == 51 || this.moveUp == 53){
					this.y -= 5;
					if(this.facing == "right"){
						this.x += 2;
					}else if(this.facing == "left"){
						this.x -= 2;
					}
				}else if(this.moveUp > 53 && this.moveUp < 67){
					this.y -= 1;
					if(this.facing == "right"){
						this.x += 0.5;
					}else if(this.facing == "left"){
						this.x -= 0.5;
					}				
				}else{
					this.y -= 2;
				}
			}
			this.moveUp += 2; 
			this.movingUp = true;
		}else{
			this.moveUp = 0;
			this.movingUp = false;
			this.fallen = false;
			this.climbingOut = false;
			this.resumeBlocksTimer.start();
		}
	}
}

Ghouliath.prototype.resumeHiddenBlocks = function(){
	var hiddenBlock = null;
	while(hiddenBlock = this.hiddenBlocksPaused.pop()){
		hiddenBlock.timer.resume();
	}
}
Ghouliath.prototype.checkForHiddenBlock = function(){
	var checkForHiddenBlockPosition1 = this.state.getGridPosition(this.x, this.y+this.state.bps*2, 'middle');
	var checkForHiddenBlockPosition2 = this.state.getGridPosition(this.x + this.state.bps, this.y + this.state.bps*2, 'middle');
	var hiddenBlock = null;
	var check1 = false;
	var check2 = false;
	var hiddenBlock1 = null;
	var hiddenBlock2 = null;
	for (var i = 0; i < this.state.hiddenBlockGroup.members.length; i++){
		hiddenBlock = this.state.hiddenBlockGroup.members[i];	
		if(hiddenBlock.row == checkForHiddenBlockPosition1[0] && hiddenBlock.col == checkForHiddenBlockPosition1[1]){
			check1 = true;
			hiddenBlock1 = hiddenBlock;
		}else if(hiddenBlock.row == checkForHiddenBlockPosition2[0] && hiddenBlock.col == checkForHiddenBlockPosition2[1]){
			check2 = true;
			hiddenBlock2 = hiddenBlock;
		}
	}
	if(hiddenBlock1){
		//if(!hiddenBlock1._isPaused){		
		//	hiddenBlock1.timer.pause();
		//	this.hiddenBlocksPaused.push(hiddenBlock1);
		//}
	}
	if(hiddenBlock2){
		//if(!hiddenBlock2._isPaused){
		//	hiddenBlock2.timer.pause();
		//	this.hiddenBlocksPaused.push(hiddenBlock2);
		//}
	}
	if(!this.state.onBlockType(this.state.originalGroundBlocks, checkForHiddenBlockPosition1)){
		check1 = true;
	}
	if(!this.state.onBlockType(this.state.originalGroundBlocks, checkForHiddenBlockPosition2)){
		check2 = true;
	}	
	if(check1 && check2){
		if(!this.climbingOut){
			this.shouldFall = true;
		}
	}
}

Ghouliath.prototype.gravity = function(){
	this.fallen = true;
	var southGridPosition1 = this.state.getGridPosition(this.x, this.y + this.state.bps, 'south');
	var southGridPosition2 = this.state.getGridPosition(this.x + this.state.bps, this.y + this.state.bps, 'south');
	if(this.state.onBlockType(this.state.topGroundBlocks, southGridPosition1) || this.state.onBlockType(this.state.topGroundBlocks, southGridPosition2)){
		var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition1, 'south');
		if(this.y + this.state.bps * 2 < pixelNum - 10){
			this.y += 10;
		}else{
			this.y = pixelNum-(2*this.state.bps)+1;
			this.shouldFall = false;
			//this.checkDeath();
		}
	}else{
		this.y+= 10;
	}
	if(this.y > this.state.bps * this.state.GRID_ROWS){
		this.isInHole = true;
		this.destroy();
	}
}

Ghouliath.prototype.checkClimbOut = function(){
	switch(this.animation.currentAnimation.name){
		case 'moveright':
			var checkGroundBlock1 = this.state.getGridPosition(this.x+2*this.state.bps, this.y+this.state.bps);
			var checkEmptyBlock1 = this.state.getGridPosition(this.x+2*this.state.bps, this.y);	
			var checkEmptyBlock2 = this.state.getGridPosition(this.x+2*this.state.bps, this.y-this.state.bps);
			break;
		case 'moveleft':
			var checkGroundBlock1 = this.state.getGridPosition(this.x-1, this.y+this.state.bps);
			var checkEmptyBlock1 = this.state.getGridPosition(this.x-1, this.y);
			var checkEmptyBlock2 = this.state.getGridPosition(this.x-1, this.y-this.state.bps);
			break;
	}
	if(this.facing!='die'){
		if(this.state.onBlockType(this.state.groundBlocks, checkGroundBlock1)){
			if(!this.state.onBlockType(this.state.groundBlocks, checkEmptyBlock1)){
				if(!this.state.onBlockType(this.state.groundBlocks, checkEmptyBlock2)){
					this.justTurned = false;
					this.moveUp++; 
					this.climbingOut = true;
				}
			}else{
				if(this.fallen){
					this.animation.play('die');
					this.facing = 'die';
					this.addToOccupiedBy();
					this.resumeBlocksTimer.start();
				}
			}
		}
	}
}

Ghouliath.prototype.addToOccupiedBy = function(){
	var gridPosition = this.state.getGridPosition(this.x, this.y);
	for(var i = 0; i < this.state.hiddenBlockGroup.members.length; i++){
		var hiddenBlock = this.state.hiddenBlockGroup.members[i];
		if(hiddenBlock.row == gridPosition[0] || hiddenBlock.row == gridPosition[0]+1){
			if(hiddenBlock.col == gridPosition[1] || hiddenBlock.col == gridPosition[1]+1){
				hiddenBlock.occupiedBy.push(this);
			}
		}
	}
}

Ghouliath.prototype.destroy = function(immediate){
	this.resumeHiddenBlocks();
	if(this.state.soundsOn){
		this.state.bombSound.play();	
	}	
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this, immediate);
}

Ghouliath.prototype.objType = function(){
	return 'Ghouliath';
}

var Ghoul = function(state, x, y, facing, ghoulType){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sprites'], x, y, false);
	this.facing = facing; 
	this.shouldFall = false;
	this.isInHole = false;
	this.isInHiddenBlock = false;
	this.testvar = 0;
	this.state = state;
	this.shouldCheckDirection = true;
	this.ghoulType = ghoulType;

	var ghoulHitboxX = Math.round(this.state.bps*this.state.BANDIT_HITBOX_X_PERCENTAGE);
	var ghoulHitboxY = Math.round(this.state.bps*this.state.BANDIT_HITBOX_Y_PERCENTAGE);	
 
	this.box.hitbox = new Kiwi.Geom.Rectangle(ghoulHitboxX,ghoulHitboxY,this.state.bps-2*ghoulHitboxX,this.state.bps-2*ghoulHitboxY);

	switch(ghoulType){
		case 'gray':
			this.animation.add('idleleft',[70],0.1,false);
			this.animation.add('idleright',[73],0.1,false);
			this.animation.add('upright',[75],0.1,false);
			this.animation.add('upleft',[72],0.1,false);
			this.animation.add('dieright',[74,75],0.1,true);
			this.animation.add('dieleft',[71,72],0.1,true);
			this.animation.add('diestaticright',[74],0.1,false);
			this.animation.add('diestaticleft',[71],0.1,false);			
			break;
		case 'red':
			this.animation.add('idleleft',[90],0.1,false);
			this.animation.add('idleright',[106],0.1,false);
			this.animation.add('upright',[99],0.1,false);
			this.animation.add('upleft',[102],0.1,false);
			this.animation.add('dieright',[95,106],0.1,true);
			this.animation.add('dieleft',[98,102],0.1,true);
			this.animation.add('diestaticright',[95],0.1,false);
			this.animation.add('diestaticleft',[98],0.1,false);				
			this.animation.add('climb',[91,94],0.1,true);	
			break;
		case 'blue':
			this.animation.add('idleleft',[103],0.1,false);
			this.animation.add('idleright',[96],0.1,false);
			this.animation.add('upright',[104],0.1,false);
			this.animation.add('upleft',[92],0.1,false);
			this.animation.add('dieright',[100,104],0.1,true);
			this.animation.add('dieleft',[107,92],0.1,true);
			this.animation.add('diestaticright',[100],0.1,false);
			this.animation.add('diestaticleft',[107],0.1,false);
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
			this.animation.add('diestaticright',[144],0.1,false);
			this.animation.add('diestaticleft',[134],0.1,false);			
			this.animation.add('climb',[127,138],0.1,true);
			this.animation.add('disappear',[129,130,131,132,133],0.1,false);
			this.animation.add('orb',[133],0.1,false);
			this.animation.add('reappear',[133,132,131,130,129],0.1,false);
			break;	
		case 'king':
			this.animation.add('idleleft',[166],0.1,false);
			this.animation.add('dieleft',[162,163],0.1,true);
			this.animation.add('laugh',[164,165],0.1,true);
			this.animation.add('shoot',[166,167,166,168,165,166],0.1,false);
			this.animation.add('explode',[169],0.1,false);
			break;
	}

	this.animation.play('idleleft');	

}
Kiwi.extend(Ghoul, Kiwi.GameObjects.Sprite);

Ghoul.prototype.objType = function(){
	return 'Ghoul';
}

Ghoul.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.facing == 'left'){
		var gridPosition = this.state.getGridPosition(this.x, this.y, 'east');
 	    var topGridPosition = this.state.getGridPosition(this.x, this.y+15, 'north');
	}else if(this.facing == 'right'){
		var gridPosition = this.state.getGridPosition(this.x, this.y, 'west');
  	  	var topGridPosition = this.state.getGridPosition(this.x, this.y+15, 'north');
	}

	//If the ghoul is in a hole, play the die animation, otherwise
	//do everything else. 
	if(this.isInHole){
		//Ghoul = playDieAnimation
		//BlackGhoul = teleport or playDieAnimation.
		this.inHole();
	}else{
		this.shouldCheckDirection = (this.x % this.state.bps == 0 && this.y % this.state.bps == 0); 	

		if(this.shouldFall){
			this.gravity();
			//below makes ghouls change facing as they fall. 
			//and dictates their facing after landing onto the ground
			if(!(this.y>this.state.bps*(this.state.GRID_ROWS-1))){
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

		if(!this.shouldFall){
			if(this.facing == 'left' || this.facing == 'right'){
				this.checkForHiddenBlock(gridPosition, topGridPosition);
			}
			if(this.shouldCheckDirection){
				//checkDirection sets the facing.
				this.checkDirectionAndSetFacing();	
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

Ghoul.prototype.checkForHiddenBlock = function(gridPosition, topGridPosition){
	var checkForHiddenBlockPosition = [gridPosition[0]+1, gridPosition[1]];
	var hiddenBlock = null;
	var hiddenBlockToPushTo = null;
	for (var i = 0; i < this.state.hiddenBlockGroup.members.length; i++){
		hiddenBlock = this.state.hiddenBlockGroup.members[i];
		if(hiddenBlock.row == checkForHiddenBlockPosition[0] && hiddenBlock.col == checkForHiddenBlockPosition[1]){
			this.shouldFall = true;
		}else{
			if(hiddenBlock.row == topGridPosition[0] && hiddenBlock.col == topGridPosition[1]){
				if(this.shouldFall == false){
					this.isInHole = true;
					hiddenBlock.occupiedBy.push(this);
					this.isInHiddenBlock = true;
				}
			}
		}
	}	
}

Ghoul.prototype.inHole = function(){
	this.playDieAnimation();
}

Ghoul.prototype.playDieAnimation = function(){
	if(this.animation.currentAnimation.name != 'die' + this.facing){
		this.animation.play('die' + this.facing);
		if(this.state.soundsOn){
			this.state.ghoulDeathSound.play('start', true);
		}
	}
}

Ghoul.prototype.gravity = function(){
	this.shouldCheckDirection = false;	
	var southGridPosition = this.state.getGridPosition(this.x, this.y, 'south');
	//if in stopping block
	if(this.state.onBlockType(this.state.topGroundBlocks, southGridPosition)){
		var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition, 'south');
		if(this.y + this.state.bps < pixelNum-10){
			this.y += 10;
		}else{
			this.y = pixelNum-this.state.bps+1;
			this.shouldFall = false;
			var gridPosition = this.state.getGridPosition(this.x, this.y, 'middle');
			var ghoulCode = this.state.ghoulBlocks[gridPosition[0]][gridPosition[1]];	
			if(ghoulCode % 2 != 0 && ghoulCode % 3 != 0){
				this.isInHole = true;
				Ghoul.prototype.singleBlockDeath.call(this);
			}
			if(this.objType() == 'BlackGhoul'){
				this.findPathCount = 4;
				this.path = [];
			}		
		}
	}else{
		this.y+=10;
	}
	//if fallen off bottom of the stage. 
	if(this.y > this.state.bps * this.state.GRID_ROWS){
		this.isInHole = true;		
		this.destroy();
	}
}

Ghoul.prototype.singleBlockDeath = function(speed){
	if(speed == 'fast'){
		this.timer = this.state.game.time.clock.createTimer('singleBlockDeathTimer',1,0,false);
	}else{
		this.timer = this.state.game.time.clock.createTimer('singleBlockDeathTimer',3,0,false);
	}
	this.timer_event = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.checkSingleBlockDeath, this);
	if(this.objType() == 'BlueGhoul'){
		this.teleportTimer.stop();
	}
	this.timer.start();	
}

Ghoul.prototype.checkSingleBlockDeath = function(){
	if(!this.isInHiddenBlock){
		this.destroy(false);
	}else{
		this.isInHiddenBlock = true;
	}
}

Ghoul.prototype.checkDirectionAndSetFacing = function(){
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

var RedGhoul = function(state, x, y, facing){
	Ghoul.call(this, state, x, y, facing, 'red');

	RedGhoul.prototype.update = function(){
		Ghoul.prototype.update.call(this);
	}
}
Kiwi.extend(RedGhoul, Ghoul);

RedGhoul.prototype.objType = function(){
	return 'RedGhoul';
}

RedGhoul.prototype.checkDirectionAndSetFacing = function(){
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
		if(this.state.soundsOn){
			this.state.ghoulTeleportOutSound.play('start', true);
		}
		this.box.hitbox = new Kiwi.Geom.Rectangle(0,0,0,0);		

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
		this.animation.play('orb');
		var pixels = this.state.getPixelPositionFromRowCol(this.nextRow, this.nextCol);
		this.x = pixels[0];
		this.y = pixels[1];
		if(this.state.soundsOn){
			this.state.ghoulTeleportInSound.play('start', true);
		}				
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
		if(this.state.random.integerInRange(0,2) == 0){
			this.facing = 'left';
		}else{
			this.facing = 'right';
		}
		this.isInHole = false;
		//BlackGhouls only teleport when they are supposed to die.
		if(this.objType() == 'BlackGhoul'){
			this.lives--;
		}
	}
}

BlueGhoul.prototype.destroy = function(immediate){
	this.teleportTimer.removeTimerEvent(this.teleportTimerEvent);
	this.orbTimer.removeTimerEvent(this.orbTimerEvent);
	this.orbTimer2.removeTimerEvent(this.orbTimerEvent2);
	this.reappearTimer.removeTimerEvent(this.reappearTimerEvent);
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this, immediate);
}

BlueGhoul.prototype.objType = function(){
	return 'BlueGhoul';
}

var BlackGhoul = function(state, x, y, facing){
	Ghoul.call(this, state, x, y, facing, 'black');
	this.findPathCount = 4;
	this.path = [];
	this.nextNode = undefined;
	this.lives = 3;

	this.ghoulHitboxX = Math.round(this.state.bps*this.state.BANDIT_HITBOX_X_PERCENTAGE);
	this.ghoulHitboxY = Math.round(this.state.bps*this.state.BANDIT_HITBOX_Y_PERCENTAGE);	

	this.orbTimer = this.state.game.time.clock.createTimer('orbTimer',1.4,0,false);
	this.orbTimerEvent = this.orbTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.showOrb, this);
	
	this.orbTimer2 = this.state.game.time.clock.createTimer('orbTimer2',.6,0,false);
	this.orbTimerEvent2 = this.orbTimer2.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.reappearAnimation, this);

	this.reappearTimer = this.state.game.time.clock.createTimer('reappearTimer',.6,0,false);
	this.reappearTimerEvent = this.reappearTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.reappear, this);

	this.distanceToBandit = function(bandit){
		return Math.sqrt(Math.pow(Math.abs(this.x-bandit.x),2) + Math.pow(Math.abs(this.y-bandit.y),2));
	}
}
Kiwi.extend(BlackGhoul, BlueGhoul);
Kiwi.extend(BlackGhoul, RedGhoul);

BlackGhoul.prototype.inHole = function(){
	if(this.lives < 2 && this.facing != 'teleport'){
		Ghoul.prototype.playDieAnimation.call(this);
	}else{	
		if(this.facing != 'teleport'){
			this.teleport();
		}
	}
}

BlackGhoul.prototype.destroy = function(immediate){
	this.orbTimer.removeTimerEvent(this.orbTimerEvent);
	this.orbTimer2.removeTimerEvent(this.orbTimerEvent2);
	this.reappearTimer.removeTimerEvent(this.reappearTimerEvent);
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this, immediate);
}

BlackGhoul.prototype.objType = function(){
	return 'BlackGhoul';
}

BlackGhoul.prototype.findPathToBandit = function(){
	var graph = new Graph(this.state.ghoulBlocks);
	var gridPosition = this.state.getGridPosition(this.x, this.y, 'middle');
	var start = graph.grid[gridPosition[0]][gridPosition[1]];
	
	if(this.state.numPlayers == 2){
		if(this.distanceToBandit(this.state.blue) < this.distanceToBandit(this.state.red)){
    		var banditPosition = this.state.getGridPosition(this.state.blue.x, this.state.blue.y, 'middle');
		}else{
    		var banditPosition = this.state.getGridPosition(this.state.red.x, this.state.red.y, 'middle');			
		}
	}else{
    	var banditPosition = this.state.getGridPosition(this.state.red.x, this.state.red.y, 'middle');
    }
    
    var end = graph.grid[banditPosition[0]][banditPosition[1]];
    var result = astar.search(graph, start, end);	
    if(result.length > 0){
    	//console.log('pathfinding success');
    }
   	return result;
}

BlackGhoul.prototype.checkDirectionAndSetFacing = function(){
	if(this.shouldCheckDirection){
	var gridPosition = this.state.getGridPosition(this.x, this.y, 'middle');

		if(this.findPathCount == 4){
			this.findPathCount = 0;
			this.path = this.findPathToBandit();
		}else{
			this.findPathCount ++;
		}		
		
		this.nextNode = this.path.pop();
		if(this.nextNode !== undefined){
			if(this.nextNode.x === gridPosition[0] && this.nextNode.y === gridPosition[1]){
				//console.log('bfore: ' + this.nextNode.x + ' ' + this.nextNode.y);
				this.nextNode = this.path.pop();
			}
			if(this.nextNode !== undefined){
				//console.log(gridPosition[0] + ' ' + gridPosition[1] + ' ghoul pos');
				//console.log(this.nextNode.x + ' ' + this.nextNode.y);
				if(this.nextNode.x < gridPosition[0]){
					//console.log('moving up to ' + this.nextNode.x + ' ' + this.nextNode.y);
					this.facing = 'up';
				}else if(this.nextNode.x > gridPosition[0]){
					//console.log('moving down to ' + this.nextNode.x);
					this.facing = 'down';
				}else if(this.nextNode.y < gridPosition[1]){
					//console.log('moving left to ' + this.nextNode.x + ' ' + this.nextNode.y);

					this.facing = 'left';
				}else if(this.nextNode.y > gridPosition[1]){
					this.facing = 'right';
				}
			}else{
				RedGhoul.prototype.checkDirectionAndSetFacing.call(this);
			}
		}else{
			RedGhoul.prototype.checkDirectionAndSetFacing.call(this);
		}
	}
}

var KingGhoul = function(state, x, y, facing){
	Ghoul.call(this, state, x, y, facing, 'king');
	this.setupActions();

}
Kiwi.extend(KingGhoul, Kiwi.GameObjects.Sprite);

KingGhoul.prototype.setupActions = function(){
	this.isAlive = true;

	this.laughTimer = this.state.game.time.clock.createTimer('laughTimer',0.5,0,false);
	this.laughTimerEvent = this.laughTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.laugh, this);

	this.laughOverTimer = this.state.game.time.clock.createTimer('laughOverTimer',3,0,false);
	this.laughOverTimerEvent = this.laughOverTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.laughOver, this);

	this.explodeTimer = this.state.game.time.clock.createTimer('explodeTimer',3,0,false);
	this.explodeTimerEvent = this.explodeTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.explode, this);

	this.destroyTimer = this.state.game.time.clock.createTimer('destroyTimer',0.5,0,false);
	this.destroyTimerEvent = this.destroyTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.destroy, this);

	this.gridPosition = this.state.getGridPosition(this.x, this.y, 'middle');
	this.banditInRange = [this.gridPosition[0], this.gridPosition[1]-3];

	this.bandits = this.state.banditGroup.members;
	this.banditDeathCount = 0;	
}

KingGhoul.prototype.explode = function(){
	this.isInHole = false;
	this.animation.play('explode');
	this.state.bombSound.play();		
	this.destroyTimer.start();
}

KingGhoul.prototype.destroy = function(immediate){
	this.laughTimer.removeTimerEvent(this.laughTimerEvent);
	this.laughOverTimer.removeTimerEvent(this.laughOverTimerEvent);
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this, immediate);
}

KingGhoul.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

 	if(this.isAlive){
	 	if(this.isInHole){
			Ghoul.prototype.playDieAnimation.call(this);
			this.isAlive = false;
			this.explodeTimer.start();
		}else if(this.shouldFall){
			Ghoul.prototype.gravity.call(this);
		}else{
	  		var topGridPosition = this.state.getGridPosition(this.x, this.y+15, 'north');
	  		Ghoul.prototype.checkForHiddenBlock.call(this, this.gridPosition, topGridPosition);
	  	}

		for(var i = 0; i<this.bandits.length; i++){
			var banditGridPosition = this.state.getGridPosition(this.bandits[i].x, this.bandits[i].y, 'middle');
			if(banditGridPosition[0] == this.banditInRange[0] && banditGridPosition[1] == this.banditInRange[1]){
				if(this.bandits[i].isAlive){
					if(this.animation.currentAnimation.name != 'shoot' && this.animation.currentAnimation.name != 'laugh'){
						this.animation.play('shoot');
						this.state.shotgunSound.play('start');
					}
					if(this.banditDeathCount > 7){
						this.bandits[i].isAlive = false;
						this.banditDeathCount = 0;
					}else{
						if(this.banditDeathCount == 0){
							this.laughTimer.start();
						}
						this.banditDeathCount ++;
					}
				}
			}
		}
	}
}

KingGhoul.prototype.laughOver = function(){
	this.animation.play('idleleft');
}

KingGhoul.prototype.laugh = function(){
	if(this.animation.currentAnimation.name!='laugh'){
		this.animation.play('laugh');
		//this.state.kingGhoulLaughSound.play('start',false);
		this.laughOverTimer.start();
	}	
}

var TurboKingGhoul = function(state, x, y, facing){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['ghouliath'], x, y, false);
	KingGhoul.prototype.setupActions.call(this);
	this.banditInRange = [this.gridPosition[0]+1, this.gridPosition[1]-3];
	this.facing = facing;
	this.state = state;
	this.climbingOut = false;
	console.log(this.banditInRange);

	this.animation.add('idleleft',[16],0.2,false);
	this.animation.add('dieleft',[16,17],0.1,true);
	this.animation.add('laugh',[16,19],0.1,true);
	this.animation.add('shoot',[16,18,18,16],0.1,false);
	this.animation.add('explode',[15],0.1,false);
	this.animation.play('idleleft');
}
Kiwi.extend(TurboKingGhoul, KingGhoul);

TurboKingGhoul.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	if(this.isAlive){
		if(this.isInHole){
			Ghoul.prototype.playDieAnimation.call(this);
			this.isAlive = false;
			this.explodeTimer.start();
		}else if(this.shouldFall){
			this.gravity();
		}else{
			Ghouliath.prototype.checkForHiddenBlock.call(this);
		}

		for(var i = 0; i<this.bandits.length; i++){
			var banditGridPosition = this.state.getGridPosition(this.bandits[i].x, this.bandits[i].y, 'middle');
			if(banditGridPosition[0] == this.banditInRange[0] && banditGridPosition[1] == this.banditInRange[1]){
				if(this.bandits[i].isAlive){
					if(this.animation.currentAnimation.name != 'shoot' && this.animation.currentAnimation.name != 'laugh'){
						this.animation.play('shoot');
						this.state.shotgunSound.play('start');
					}
					if(this.banditDeathCount > 7){
						this.bandits[i].isAlive = false;
						this.banditDeathCount = 0;
					}else{
						if(this.banditDeathCount == 0){
							this.laughTimer.start();
						}
						this.banditDeathCount ++;
					}
				}
			}			
		}
	}

}

TurboKingGhoul.prototype.gravity = function(){
	this.fallen = true;
	var southGridPosition1 = this.state.getGridPosition(this.x, this.y + this.state.bps, 'south');
	var southGridPosition2 = this.state.getGridPosition(this.x + this.state.bps, this.y + this.state.bps, 'south');
	if(this.state.onBlockType(this.state.topGroundBlocks, southGridPosition1) || this.state.onBlockType(this.state.topGroundBlocks, southGridPosition2)){
		var pixelNum = this.state.getPixelNumberForGridPosition(southGridPosition1, 'south');
		if(this.y + this.state.bps * 2 < pixelNum - 10){
			this.y += 10;
		}else{
			this.y = pixelNum-(2*this.state.bps)+1;
			this.shouldFall = false;
			this.isInHole = true;
		}
	}else{
		this.y+= 10;
	}
}
