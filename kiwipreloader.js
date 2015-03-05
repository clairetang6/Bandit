/**
* The Kiwi.JS Preloader is a custom State, that is used wanting to load in any assets for a game.  
* Using this Class is very easy. 
* All you have to do to use it is:
* 1 - Instantiate this Class instead of a State and pass a few extra parameters.
* 2 - Create a preload method on the new Object (that extends the class) BUT make sure you call the preload method on this class!!!
* 3 - Switch to it (like you would anyway) 
* 4 - And DONE!
* 
*
* @class KiwiLoadingScreen
* @constructor
* @extends Kiwi.State
* @param name {String} Name of this state.
* @param stateToSwitch {String} Name of the state to switch to AFTER all the assets have loaded. Note: The state you want to switch to should already have been added to the game.
* @param subfolder {String} The folder that the loading graphics are located at. 
* @param dimensions {Object} A Object containing the width/height that the game is to be. For example {width: 1024, height: 768}. Defaults to the stages width/height if not passed.
* @return {KiwiLoadingScreen}
*/


var KiwiLoadingScreen = function(name, stateToSwitch,subfolder, dimensions) {

	//Call the Super
	Kiwi.State.call(this, name);

	//Check the width/height
	if(dimensions !== undefined && dimensions.width !== undefined && dimensions.height != undefined) {
		this.newDimensions = dimensions;
	} else {
		this.newDimensions = null;
	}

	//Save the state to load afterwards
	this.afterState = stateToSwitch;
	
	this.kiwiAlpha = 0;

	//The Loading children we are going to make
	//this.html5Logo = null;
	this.rydaire = null;
	this.games = null;

	//Splash
	//this.kiwijsLogo = null;
	//this.kiwijsText = null;
	//this.radial = null;
	//this.madeWith = null;
	//this.loadingBar = null;
	this.banditBanner = null;
	this.loadingBar = null;
	this.loadingBarContainer = null;

	//The subfolder where everything will be saved
	this.subfolder = subfolder;

}

//Extend the State
Kiwi.extend(KiwiLoadingScreen, Kiwi.State);

KiwiLoadingScreen.prototype.init = function() {
 	
 	Kiwi.State.prototype.init.call(this);

 	if(this.newDimensions !== null) {
 		this.game.stage.resize( this.newDimensions.width, this.newDimensions.height );
 	}

}

/** 
* Preload Method. This is the method you override when you are wanting to load in your assets. 
* Note: Make sure you call this method! Otherwise the loading graphics will never load and this state won't work!!! Also best to call it at the start of the PRELOAD.
* @method preload
* @public
*/
KiwiLoadingScreen.prototype.preload = function() {

	//BackgroundColour
	this.game.stage.color = '000000';

	//New Dimensions
	var shortest = (this.game.stage.width > this.game.stage.height) ? this.game.stage.height : this.game.stage.width;

	if(shortest < 600) {
		this.scaled = shortest / 600;
	} else {
		this.scaled = 1;
	}


	//Should combine into a texture atlas...
	this.currentSplashState = 0;	// 0 = HTML 5 LOGO FADING IN         RYDAIRE GAMES SNAPPING TOGETHER
									// 1 = KIWIJS READY TO APPEAR        DONE SNAPPING TOGETHER
									// 2 = KIWIJS FADING In              BANNER FADING IN
									// 3 = LOADING WITH KIWIJS THERE     LOADING 
									// 4 = DONE. SWITCHING TO NEXT STATE

	this.addTextureAtlas('loadingGraphic', this.subfolder + 'bandit_loading.png', 'loadingJSON', this.subfolder + 'bandit_loading.json', false);

	//Information about the files we need to load
	this.loadingData = {toLoad: 0, loaded: 0};
	this.percentLoaded = 0;
}


/**
* Start Loading everything in. 
* @method loadProgress
* @public
*/
KiwiLoadingScreen.prototype.loadProgress = function (percent, bytesLoaded, file) {

	this.percentLoaded = percent;
	console.log(this.percentLoaded);


	if(this.currentSplashState == 3) {
		this.loadingBar.scaleX =  this.percentLoaded / 100 * this.scaled;
		this.finishLoading();
	}


	if(file == null || file == undefined) return;

	if(file.key === 'loadingJSON') {
		//Add to the Library
		this.game.states.rebuildLibraries();


        //Create the StaticImage
        /*
		this.html5Logo = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingGraphic'], this.game.stage.width / 2, this.game.stage.height / 2);
		this.html5Logo.cellIndex = 0;
		this.html5Logo.scaleX = this.scaled;
		this.html5Logo.scaleY = this.scaled;
		this.html5Logo.x -= this.html5Logo.box.bounds.width / 2;
		this.html5Logo.y -= this.html5Logo.box.bounds.height / 2;
		this.html5Logo.alpha = 0;
		this.html5Logo.rotPointX = 0;
		this.html5Logo.rotPointY = 0;
		this.addChild(this.html5Logo);
		*/


		this.rydaire = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingGraphic'], -50, -100);
		this.rydaire.cellIndex = 4;
		this.games = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingGraphic'], 370, 800);
		this.games.cellIndex = 3;
		this.addChild(this.rydaire);
		this.addChild(this.games);

		//Tween
		/*
		this.loadingTween = this.game.tweens.create(this.html5Logo);
		this.loadingTween.onComplete(this.fadeInHTML5, this);
		this.loadingTween.to({ alpha: 1 }, 500, Kiwi.Animations.Tweens.Easing.Linear.None);
        this.loadingTween._onCompleteCalled = false;
	    this.loadingTween.start();
	    */

	    this.rydaireTween = this.game.tweens.create(this.rydaire);
	    this.rydaireTween.onComplete(this.fadeInHTML5, this);
	    this.rydaireTween.to({x: 160, y: 250}, 1200, Kiwi.Animations.Tweens.Easing.Cubic.Out);
	    this.rydaireTween._onCompleteCalled = false;

	    this.gamesTween = this.game.tweens.create(this.games);
	    this.gamesTween.to({x: 170, y: 380}, 1200, Kiwi.Animations.Tweens.Easing.Cubic.Out);

	    this.rydaireTween.start();
	    this.gamesTween.start();

	    //Don't need to do anything else
	    return;
	}

	if(this.currentSplashState <= 1 && this.loadingData.loaded == this.loadingData.toLoad) {
		
		//So the HTML 5 logo was waiting for the KIWI splash assets to load.
		if( this.currentSplashState == 1 ) {
			//Play the tween. No delay because there most likely already was one
       	 	this.rydaireTween._onCompleteCalled = false;
			this.rydaireTween.start();
			this.gamesTween.start();
			this.currentSplashState = 2; 

		//Still waiting for the logo to fade in? Tell it to fade out when its done.
		} else {
			this.currentSplashState = 1;
		}

	}

}


/**
* Create: rebuild html5Logo
**/
KiwiLoadingScreen.prototype.create = function(){
	Kiwi.State.prototype.create.call( this );
	
	// Reassign texture atlas to html5Logo, as it has just been rebuilt and WebGL may have lost track of it
	this.rydaire.atlas = this.textures.loadingGraphic;
	this.games.atlas = this.textures.loadingGraphic;
}


/**
* Called when the fading in of the HTML5 logo is completed. Makes the HTML5 logo fade out oafter a period of time.
* @method fadeInHTML5
* 
*/
KiwiLoadingScreen.prototype.fadeInHTML5 = function() {
	this.rydaireTween.to({ alpha: 0 }, 500, Kiwi.Animations.Tweens.Easing.Linear.None);
	this.gamesTween.to({alpha: 0}, 500, Kiwi.Animations.Tweens.Easing.Linear.None);
	this.rydaireTween.onComplete(this.fadeOutHTML5, this);

	//Have all the assets for the next splash screen loaded in the time it has taken us to fade the logo in?
	if( this.currentSplashState >= 1) { 
		//Start the fadeout tween after a delay
        this.rydaireTween._onCompleteCalled = false;
		this.rydaireTween.start();
		this.gamesTween.start();
		this.currentSplashState = 2; 

	//Otherwise say we are ready.
	} else {
		this.currentSplashState = 1;  
	}
}


/**
* Called when the HTML5 logo has fulled faded in. Creates/fades in the KIWI.
* @method fadeOutHTML5
* 
* 
*/
KiwiLoadingScreen.prototype.fadeOutHTML5 = function() {

	this.currentSplashState = 3;

	//Remove the logo
	this.rydaire.exists = false;
	this.games.exists = false;

	//Create all the HTML 5 assets
	this.banditBanner = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingGraphic'], this.game.stage.width / 2, this.game.stage.height / 2);
	this.loadingBarContainer = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingGraphic'], this.game.stage.width / 2, this.game.stage.height /2);
	this.loadingBar = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingGraphic'], 0, 0);

	this.banditBanner.cellIndex = 0;
	this.loadingBarContainer.cellIndex = 2;
	this.loadingBar.cellIndex = 1;

	//Adjust Coordinates

	this.banditBanner.x -= this.banditBanner.box.bounds.width / 2;
	this.banditBanner.y -= this.banditBanner.box.bounds.height / 2;

	this.loadingBarContainer.x -= this.loadingBarContainer.box.bounds.width /2;
	this.loadingBarContainer.y -= this.loadingBarContainer.box.bounds.height /2 - 250;

	this.loadingBar.x = this.loadingBarContainer.x +18;
	this.loadingBar.y = this.loadingBarContainer.y;


	this.loadingBar.rotPointX = 0;
	this.loadingBar.rotPointY = 0;


	//Alpha
	this.banditBanner.alpha = 0;
	this.loadingBarContainer.alpha = 0;
	this.loadingBar.alpha = 0;


	//Add then in the right order
	this.addChild(this.banditBanner);
	this.addChild(this.loadingBarContainer);
	this.addChild(this.loadingBar);


	//Scale the LoadingBar
	this.loadingBar.scaleX = (this.percentLoaded / 100) * this.scaled;	


	//Start the Tween
	this.loadingTween = this.game.tweens.create(this);
	
	this.loadingTween.to({ kiwiAlpha : 1 }, 2500, Kiwi.Animations.Tweens.Easing.Linear.None);
	this.loadingTween.onComplete(null, null);
	this.loadingTween.onUpdate(this.updatedAlpha, this);
	this.loadingTween.onComplete(this.finishLoading, this);
    this.loadingTween._onCompleteCalled = false;
	this.loadingTween.start();

	this.finishLoading();


}


/**
* Checks to see if all the assets have loaded. Fades out the Kiwi.
* @method finishLoading
* 
*/
KiwiLoadingScreen.prototype.finishLoading = function() {
	if(this.percentLoaded == 100) {
		
		this.loadingTween.to({ kiwiAlpha : 0 }, 500, Kiwi.Animations.Tweens.Easing.Linear.None);
		this.loadingTween.onComplete(this.completed, this);
    	this.loadingTween._onCompleteCalled = false;
		this.loadingTween.start(); 
		this.loadingBar.atlas = this.textures.loadingGraphic;
	}
}

// Updates/Fade in and out the alpha
KiwiLoadingScreen.prototype.updatedAlpha = function(obj, val) {

	this.banditBanner.alpha = this.kiwiAlpha;
	this.loadingBarContainer.alpha = this.kiwiAlpha;
	this.loadingBar.alpha = this.kiwiAlpha;

}

KiwiLoadingScreen.prototype.loadUpdate = function(){
	Kiwi.State.prototype.loadUpdate.call(this);
	if(this.banditBanner){
		console.log(this.banditBanner.atlas.glTextureWrapper);
	}

}


KiwiLoadingScreen.prototype.postRender = function() {
	console.log('post')
}

KiwiLoadingScreen.prototype.preRender = function() {
	if(this.loadingBar){
		this.loadingBar.atlas = this.textures.loadingGraphic;
	}
	if(this.banditBanner){
		this.banditBanner.atlas = this.textures.loadingGraphic;		
	}
	if(this.loadingBarContainer){
		this.loadingBarContainer.atlas = this.textures.loadingGraphic;
	}
}

/**
* Called when the game is ready, so we can switch to the next state now.
* 
*/
KiwiLoadingScreen.prototype.completed = function() {

	this.currentSplashState = 4;
	this.banditBanner.atlas = this.textures.loadingGraphic;

	//Switch States
	this.game.states.switchState(this.afterState);

}	

/*
KiwiLoadingScreen.prototype.shutDown = function() {
	this.game.tweens.removeAll();
	delete this.loadingTween;
	delete this.rydaireTween;
	delete this.gamesTween;
}*/