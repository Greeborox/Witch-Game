function initAll(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d')
  var game = new Game(canvas,ctx);
  game.start();
}

  var Game = function(canvas, ctx){
    // main variables
    var self = this;
    this.canvas = canvas;
    this.ctx = ctx;
    this.assets = [];
    this.loadedAssets = 0;
    this.state = 'loadingState';
    this.masterSprite
    this.pressedKeys = {};
    // the sprite object template
    this.spriteObject = {
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 64,
      sourceHeight: 64,
      x: 0,
      y: 0,
      width: 64,
      height: 64,
      left: function(){return this.x;},
      right: function(){return this.x + this.width;},
      top: function(){return this.y;},
      bottom: function(){return this.y + this.height;}
    };
    //methods
      //start
    this.start = function(){
      this.activateKeys();
      this.mainLoop();
    };
      //activate keys
    this.activateKeys = function(){
      window.addEventListener("keydown", function keydown(e) {
        self.pressedKeys[e.keyCode] = true;
      },false)
      window.addEventListener("keyup", function keydown(e) {
        delete self.pressedKeys[e.keyCode];
      },false)
    }
      //main loop
    this.mainLoop = function(){
      window.requestAnimationFrame(self.mainLoop,self.canvas);
      if(self[self.state].init){
        if(!self[self.state].initialised){
          self[self.state].init();
        }
      }
      if(self[self.state].update){
        self[self.state].update();
      }
      if(self[self.state].draw){
        self[self.state].draw();
      }
      if(self[self.state].toLeave){
        var nextState = self[self.state].nextState;
        self.pressedKeys = {};
        self[self.state].initialised = false;
        self[self.state].toLeave = false;
        self[self.state].nextState = "";
        self.state = nextState;
      }
    };
    //STATE OBJECTS
    //Loading State
    this.loadingState = {
      interval: 10,
      timer: 0,
      dotCount: 0,
      text: "Loading",
      initialised: false,
      toLeave: false,
      nextState: "",
      init: function(){
        this.initialised = true;
        console.log("initialised loading state");
        this.loadAssets();
      },
      update: function(){
        if(this.timer >= this.interval){
          this.text += '.';
          this.dotCount++;
          this.timer = 0;
          if(this.dotCount>3){
            this.text = "Loading";
            this.dotCount = 0;
          }
        } else {
          this.timer++
        }
        if(self.loadedAssets === self.assets.length && self.assets.length > 0){
          this.toLeave = true;
          this.nextState = "menuState";
        }
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height)
        self.ctx.font="20px Arial";
  			self.ctx.fillStyle = '#000';
  			self.ctx.textAlign = "left";
        self.ctx.fillText(this.text,20,self.canvas.height/2-20);
      },
      loadAssets: function() {
        self.masterSprite = new Image();
        self.masterSprite.src = "GFX/sprite.png";
        self.masterSprite.addEventListener("load",function(){self.loadedAssets++},false)
        self.assets.push(self.masterSprite);
      }
    };
      // menu state obj
    this.menuState = {
      initialised: false,
      toLeave: false,
      nextState: "",
      init: function(){
        this.initialised = true;
        console.log("initialised menu state");
      },
      update: function(){
        if(self.pressedKeys[32]){
          this.toLeave = true;
          this.nextState = "storyState";
        }
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height)
        self.ctx.font="20px Arial";
  			self.ctx.fillStyle = '#000';
  			self.ctx.textAlign = "left";
        self.ctx.fillText("Welcome to the game",20,self.canvas.height/2-20);
      }
    };
      //story State object
    this.storyState = {
      initialised: false,
      toLeave: false,
      nextState: "",
      init: function(){
        this.initialised = true;
        console.log("initialised story state");
      },
      update: function(){
        if(self.pressedKeys[32]){
          this.toLeave = true;
          this.nextState = "gameState";
        }
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height)
        self.ctx.font="20px Arial";
  			self.ctx.fillStyle = '#000';
  			self.ctx.textAlign = "left";
        self.ctx.fillText("Story will appear here!",20,self.canvas.height/2-20);
      }
    };
      // main game play Object
    this.gameState = {
      initialised: false,
      toLeave: false,
      nextState: "",
      mainEntities: [],
      background: undefined,
      moonStars: undefined,
      witch: undefined,
      gameWorld: {
        width:12000,
        height:600
      },
      screen: {
        x:0,
        y:0,
        width: self.canvas.width,
        height: self.canvas.height,
        speedX: 0,
        prevX: 0,
        rightScrollZone: function(){
         return this.x + (this.width * 0.75);
        },
        leftScrollZone: function(){
          return this.x + (this.width * 0.25);
        }
      },
      init: function(){
        this.initialised = true;
        console.log("initialised main game state");
        //background obj
        this.background = Object.create(self.spriteObject);
        this.background.sourceWidth = 12000;
        this.background.sourceHeight = 600;
        this.background.width = 12000;
        this.background.height = 600;
        //moonStars obj
        this.moonStars = Object.create(self.spriteObject);
        this.moonStars.sourceY = 670,
        this.moonStars.sourceWidth = 12000;
        this.moonStars.sourceHeight = 600;
        this.moonStars.width = 12000;
        this.moonStars.height = 600;
        //witch obj
        this.witch = Object.create(self.spriteObject);
        this.witch.sourceY = 600,
        this.witch.x = 30;
        this.witch.y = self.canvas.height/2 - this.witch.height/2;
        this.witch.baseY = self.canvas.height/2 - this.witch.height/2;
        this.witch.speed = 5;
        this.witch.velocity = {x:0,y:0};
        this.witch.goingUp = false;
        this.witch.goingDown = false;
        this.witch.goingLeft = false;
        this.witch.goingRight = false;
        this.witch.facing = 0;
        this.witch.angle = 0;
        this.witch.waveRange = 10;

        this.mainEntities.push(this.background);
        this.mainEntities.push(this.moonStars);
      },
      update: function(){
        this.witch.x += this.witch.velocity.x;
        this.witch.y = this.witch.baseY + Math.sin(this.witch.angle) * this.witch.waveRange;
        this.witch.angle += 0.1;
        if(this.witch.angle > Math.PI*2){
          this.witch.angle = 0;
        };

        if(self.pressedKeys['37'] && !self.pressedKeys['39']) {
          this.witch.facing = 1;
          this.witch.velocity.x = -this.witch.speed;
        }

        if(self.pressedKeys['39'] && !self.pressedKeys['37']) {
          this.witch.facing = 0;
          this.witch.velocity.x = this.witch.speed;
        }

        if(self.pressedKeys['38'] && !self.pressedKeys['40']) {
          this.witch.baseY -= this.witch.speed;
        }

        if(self.pressedKeys['40'] && !self.pressedKeys['38']) {
          this.witch.baseY += this.witch.speed;
        }

        this.witch.x = Math.max(0, Math.min(this.witch.x + this.witch.velocity.x, this.gameWorld.width - this.witch.width));
        this.witch.baseY = Math.max(this.witch.waveRange, Math.min(this.witch.baseY + this.witch.velocity.y, this.gameWorld.height - this.witch.height-this.witch.waveRange));

        if(this.witch.x < this.screen.leftScrollZone()){
          this.screen.x = Math.floor(this.witch.x - (this.screen.width * 0.25));
        }
        if(this.witch.x + this.witch.width > this.screen.rightScrollZone()){
          this.screen.x = Math.floor(this.witch.x + this.witch.width - (this.screen.width * 0.75));
        }

        if(this.screen.x < 0)  {
          this.screen.x = 0;
        }
        if(this.screen.x + this.screen.width > this.gameWorld.width){
          this.screen.x = this.gameWorld.width - this.screen.width;
        }

        this.screen.speedX = this.screen.x - this.screen.prevX;
        this.moonStars.x += this.screen.speedX / 1.5;
        this.screen.prevX = this.screen.x;
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
        if(this.mainEntities.length !== 0){
          self.ctx.save();
          self.ctx.translate(-this.screen.x, -this.screen.y);
          for (var i = 0; i < this.mainEntities.length; i++) {
            var entity = this.mainEntities[i];
            self.ctx.drawImage(self.masterSprite,entity.sourceX,entity.sourceY,entity.sourceWidth,entity.sourceHeight,Math.floor(entity.x),Math.floor(entity.y),entity.width,entity.height);
          }
          self.ctx.drawImage(self.masterSprite,
            this.witch.width*this.witch.facing,this.witch.sourceY,this.witch.sourceWidth,this.witch.sourceHeight,
            Math.floor(this.witch.x),Math.floor(this.witch.y),this.witch.width,this.witch.height);
          self.ctx.restore();

        }
      }
    }
  }
