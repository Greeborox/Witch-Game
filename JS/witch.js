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
    this.masterSprite;
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
      messages: [],
      herbs: [],
      magicMissiles: [],
      background: undefined,
      moonStars: undefined,
      witch: undefined,
      witchHouse: undefined,
      dandelion: undefined,
      skullcap: undefined,
      fern: undefined,
      catnip: undefined,
      message: {
        x: self.canvas.width/2,
        y: 50,
        dispTime: 160,
        displayedFor: 0,
        text: "test message",
      },
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
      witchHouse: {
        x: 0,
        y: 350,
        width: 180,
        height: 180,
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

        this.mainEntities.push(this.background);
        this.mainEntities.push(this.moonStars);
        //witch obj
        this.witch = Object.create(self.spriteObject);
        this.witch.sourceY = 600,
        this.witch.x = 30;
        this.witch.y = self.canvas.height/2 - this.witch.height/2;
        this.witch.baseY = self.canvas.height/2 - this.witch.height/2;
        this.witch.speed = 4;
        this.witch.velocity = {x:0,y:0};
        this.witch.facing = 0;
        this.witch.angle = 0;
        this.witch.waveRange = 10;
        this.witch.inHouse = false;
        this.witch.herbsCollected = 0;
        this.witch.missileFired = false;

        //herbs
        this.herb = Object.create(self.spriteObject);
        this.herb.frames = 4;
        this.herb.dispTime = 4;
        this.herb.currFrame = 0;
        this.herb.dispFor = 0;
        this.herb.active = true;
        this.herb.sourceWidth = 25;
        this.herb.sourceHeight = 25;
        this.herb.width = 25;
        this.herb.height = 25;
        this.herb.y = 480;

        this.dandelion = Object.create(this.herb);
        this.dandelion.x = 2500;
        this.dandelion.name = "dandelion";
        this.dandelion.sourceY = 1280;

        this.skullcap = Object.create(this.herb);
        this.skullcap.x = 6000;
        this.skullcap.name = "skullcap";
        this.skullcap.sourceY = 1305;

        this.fern = Object.create(this.herb);
        this.fern.x = 8780;
        this.fern.name = "fern";
        this.fern.sourceY = 1330;

        this.catnip = Object.create(this.herb);
        this.catnip.x = 11400;
        this.catnip.name = "catnip";
        this.catnip.sourceY = 1355;

        this.herbs.push(this.dandelion);
        this.herbs.push(this.skullcap);
        this.herbs.push(this.fern);
        this.herbs.push(this.catnip);

        // magic misslies
        this.magicMissile = Object.create(self.spriteObject);
        this.magicMissile.sourceY = 1270;
        this.magicMissile.sourceWidth = 10;
        this.magicMissile.sourceHeight = 10;
        this.magicMissile.width = 10;
        this.magicMissile.height = 10;
        this.magicMissile.frames = 4;
        this.magicMissile.dispTime = 4;
        this.magicMissile.currFrame = 0;
        this.magicMissile.dispFor = 0;
        this.magicMissile.speed = 12;
        this.magicMissile.velocity = 0;

      },
      checkCollision: function(obj1,obj2) {
        return !(obj1.x + obj1.width < obj2.x ||
                 obj2.x + obj2.width < obj1.x ||
                 obj1.y + obj1.height < obj2.y ||
                 obj2.y + obj2.height < obj1.y);
      },
      checkWitchAtHouse: function(){
        if(this.witch.herbsCollected < 4) {
          var newMsg = Object.create(this.message);
          newMsg.text = "Go find the herbs! You need "+ String(4-this.witch.herbsCollected) +" more...";
          this.messages.push(newMsg);
        } else {
          var newMsg = Object.create(this.message);
          newMsg.text = "Congratulations! You have collected all the herbs!";
          this.messages.push(newMsg);
          this.toLeave = true;
          this.nextState = "gameWon";
          this.mainEntities = [];
          this.messages = [];
          this.herbs = [];
          this.magicMissiles = [];
        }
      },
      collectHerb: function(herb){
        this.witch.herbsCollected++;
        var newMsg = Object.create(this.message);
        newMsg.text = "You have found: "+herb.name;
        this.messages.push(newMsg);
        if(this.witch.herbsCollected < 3) {
          var newMsg = Object.create(this.message);
          newMsg.text = "You still need to find "+ String(4-this.witch.herbsCollected) +" more herbs";
          this.messages.push(newMsg);
        } else if(this.witch.herbsCollected === 3) {
          var newMsg = Object.create(this.message);
          newMsg.text = "Only one more herb to find!";
          this.messages.push(newMsg);
        } else {
          var newMsg = Object.create(this.message);
          newMsg.text = "You have all the herbs! Go back to your hut so you can prepare the Anti-Curse!";
          this.messages.push(newMsg);
        }
      },
      fireMissile: function(){
        var newMissile = Object.create(this.magicMissile);
        newMissile.x = this.witch.facing ? this.witch.x : this.witch.x+this.witch.width;
        newMissile.y = this.witch.y + (this.witch.height/2) - (newMissile.width/2);
        newMissile.velocity = this.witch.facing ? -1 : 1;
        this.magicMissiles.push(newMissile);
      },
      update: function(){
        //update witch position
        this.witch.x += this.witch.velocity.x;
        this.witch.y = this.witch.baseY + Math.sin(this.witch.angle) * this.witch.waveRange;
        this.witch.angle += 0.1;
        if(this.witch.angle > Math.PI*2){
          this.witch.angle = 0;
        };
        //read keays
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

        if(self.pressedKeys['32'] && !this.witch.missileFired) {
          this.witch.missileFired = true;
          this.fireMissile();
        }

        if(!self.pressedKeys['32']) {
          this.witch.missileFired = false;
        }

        //hold witch within game world
        this.witch.x = Math.max(0, Math.min(this.witch.x + this.witch.velocity.x, this.gameWorld.width - this.witch.width));
        this.witch.baseY = Math.max(this.witch.waveRange, Math.min(this.witch.baseY + this.witch.velocity.y, this.gameWorld.height - this.witch.height-this.witch.waveRange));
        //move the screen if witch is in the scroll zones
        if(this.witch.x < this.screen.leftScrollZone()){
          this.screen.x = Math.floor(this.witch.x - (this.screen.width * 0.25));
        }
        if(this.witch.x + this.witch.width > this.screen.rightScrollZone()){
          this.screen.x = Math.floor(this.witch.x + this.witch.width - (this.screen.width * 0.75));
        }
        //hold the screen within game world
        if(this.screen.x < 0)  {
          this.screen.x = 0;
        }
        if(this.screen.x + this.screen.width > this.gameWorld.width){
          this.screen.x = this.gameWorld.width - this.screen.width;
        }
        //move the parallax background
        this.screen.speedX = this.screen.x - this.screen.prevX;
        this.moonStars.x += this.screen.speedX / 1.5;
        this.screen.prevX = this.screen.x;
        //update messages
        for(var i = 0; i < this.messages.length; i++){
          var msg = this.messages[i];
          msg.displayedFor++;
          if(msg.displayedFor >= msg.dispTime){
            this.messages.splice(i,1);
          }
        };
        //updateHebs
        for(var i = 0; i<this.herbs.length;i++){
          var herb = this.herbs[i];
          if(herb.dispFor > herb.dispTime){
            herb.currFrame++;
            if(herb.currFrame === herb.frames){
              herb.currFrame = 0;
            }
            herb.dispFor = 0;
          } else {
            herb.dispFor++;
          }
        };
        //update missiles
        for(var i = 0; i < this.magicMissiles.length; i++){
          var missile = this.magicMissiles[i];
          if(missile.dispFor > missile.dispTime){
            missile.currFrame++;
            if(missile.currFrame === missile.frames){
              missile.currFrame = 0;
            }
            missile.dispFor = 0;
          } else {
            missile.dispFor++;
          }
          missile.x += (missile.speed*missile.velocity);
          if(missile.x < this.screen.x-100 || missile.x > this.screen.x+this.screen.width+100){
            this.magicMissiles.splice(i,1);
          }
        }
        //check collisions
        if(this.checkCollision(this.witch,this.witchHouse)){
          if(!this.witch.inHouse) {
            this.checkWitchAtHouse();
            this.witch.inHouse = true;
          }
        } else {
          this.witch.inHouse = false;
        };

        for(var i = 0; i < this.herbs.length; i++){
          var herb = this.herbs[i];
          if(this.checkCollision(this.witch,herb)){
            if(herb.active){
              this.collectHerb(herb);
              herb.active = false;
            }
          }
        }

      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
        if(this.mainEntities.length !== 0){
          self.ctx.save();
          self.ctx.translate(-this.screen.x, -this.screen.y);
          //draw backgrounds
          for (var i = 0; i < this.mainEntities.length; i++) {
            var entity = this.mainEntities[i];
            self.ctx.drawImage(self.masterSprite,entity.sourceX,entity.sourceY,entity.sourceWidth,entity.sourceHeight,Math.floor(entity.x),Math.floor(entity.y),entity.width,entity.height);
          }
          //draw witch
          self.ctx.drawImage(self.masterSprite,
            this.witch.width*this.witch.facing,this.witch.sourceY,this.witch.sourceWidth,this.witch.sourceHeight,
            Math.floor(this.witch.x),Math.floor(this.witch.y),this.witch.width,this.witch.height);
          //draw herbs
          for(var i = 0; i < this.herbs.length; i++){
            var herb = this.herbs[i]
            if(herb.active){
              self.ctx.drawImage(self.masterSprite,(herb.currFrame*herb.sourceWidth),herb.sourceY,herb.sourceWidth,herb.sourceHeight,Math.floor(herb.x),Math.floor(herb.y),herb.width,herb.height);
            }
          }
          //draw missiles
          for(var i = 0; i < this.magicMissiles.length; i++){
            var missile = this.magicMissiles[i]
            self.ctx.drawImage(self.masterSprite,(missile.currFrame*missile.sourceWidth),missile.sourceY,missile.sourceWidth,missile.sourceHeight,Math.floor(missile.x),Math.floor(missile.y),missile.width,missile.height);
          }
          //draw meassages
          self.ctx.font="20px Arial";
    			self.ctx.fillStyle = '#FFF';
    			self.ctx.textAlign = "center";
          for(var i = 0; i < this.messages.length; i++) {
            self.ctx.fillText(this.messages[i].text,this.screen.x+this.messages[i].x,this.screen.y+this.messages[i].y+(25*i));
          }
          self.ctx.restore();
        }
      }
    };
    this.gameWon = {
      initialised: false,
      toLeave: false,
      nextState: "",
      init: function(){
        this.initialised = true;
        console.log("initialised gameWon");
      },
      update: function(){
        if(self.pressedKeys[32]){
          this.toLeave = true;
          this.nextState = "menuState";
        }
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height)
        self.ctx.font="20px Arial";
  			self.ctx.fillStyle = '#000';
  			self.ctx.textAlign = "left";
        self.ctx.fillText("Congratularions! You have won the game!",20,self.canvas.height/2-20);
      }
    };
  }
