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

/*
BlueGhoul.prototype.destroy = function(){
	this.teleportTimer.stop();
	this.orbTimer.stop();
	this.orbTimer2.stop();
	this.reappearTimer.stop();
	console.log('destroying Blue Ghoul');
	console.log(this);
	this.active = false;
	Kiwi.GameObjects.Sprite.prototype.destroy.call(this);
}
*/

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
