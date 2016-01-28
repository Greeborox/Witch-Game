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
    this.welcomeScreen;
    this.gameWonScreen;
    this.gameOverScreen;
    this.pressedKeys = {};
    this.score = 0;
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
      centerY: function() {
        return this.y + this.height/2
      },
      centerX: function() {
        return this.x + this.width/2
      },
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
        self.welcomeScreen = new Image();
        self.welcomeScreen.src = "GFX/welcome.png";
        self.welcomeScreen.addEventListener("load",function(){self.loadedAssets++},false)
        self.assets.push(self.welcomeScreen);
        self.gameOverScreen = new Image();
        self.gameOverScreen.src = "GFX/gameOver.png";
        self.gameOverScreen.addEventListener("load",function(){self.loadedAssets++},false)
        self.assets.push(self.gameOverScreen);
        self.gameWonScreen = new Image();
        self.gameWonScreen.src = "GFX/gameWon.png";
        self.gameWonScreen.addEventListener("load",function(){self.loadedAssets++},false)
        self.assets.push(self.gameWonScreen);
      }
    };
      // menu state obj
    this.menuState = {
      initialised: false,
      toLeave: false,
      nextState: "",
      showMsg: true,
      msgTimer: 0,
      msgTime: 20,
      init: function(){
        this.initialised = true;
        console.log("initialised menu state");
      },
      update: function(){
        if(self.pressedKeys[32]){
          this.toLeave = true;
          this.nextState = "storyState";
        }
        if(this.msgTimer > this.msgTime){
          if(this.showMsg){
            this.showMsg = false;
          } else {
            this.showMsg = true;
          }
          this.msgTimer = 0;
        } else {
          this.msgTimer++;
        }
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height)
        self.ctx.drawImage(self.welcomeScreen,0,0,self.canvas.width,self.canvas.height);
        self.ctx.font="30px Arial";
  			self.ctx.fillStyle = '#FFF';
  			self.ctx.textAlign = "left";
        self.ctx.fillText("Welcome to the game!",20,self.canvas.height-80);
        if(this.showMsg) {
          self.ctx.fillText("Press Space!",20,self.canvas.height-40);
        }
      }
    };
      //story State object
    this.storyState = {
      initialised: false,
      toLeave: false,
      nextState: "",
      showMsg: true,
      msgTimer: 0,
      msgTime: 20,
      stateTime: 50,
      stateTimer: 0,
      canStateChange: false,
      init: function(){
        this.initialised = true;
        console.log("initialised story state");
      },
      update: function(){
        if(self.pressedKeys[32] && this.canStateChange){
          this.toLeave = true;
          this.canStateChange = false;
          this.nextState = "gameState";
        }
        if(this.msgTimer > this.msgTime){
          if(this.showMsg){
            this.showMsg = false;
          } else {
            this.showMsg = true;
          }
          this.msgTimer = 0;
        } else {
          this.msgTimer++;
        }
        if(!this.canStateChange && this.stateTimer > this.stateTime){
          this.canStateChange = true;
          this.stateTimer = 0;
        } else if(!this.canStateChange){
          this.stateTimer++;
        }
      },
      draw: function(){
        self.ctx.fillStyle = '#000';
        self.ctx.fillRect(0,0,self.canvas.width,self.canvas.height);
        self.ctx.drawImage(self.gameWonScreen,100,0,self.canvas.width,self.canvas.height);
        self.ctx.font="20px Arial";
  			self.ctx.fillStyle = '#FFF';
  			self.ctx.textAlign = "left";
        self.ctx.fillText("Oh No!",20,100);
        self.ctx.fillText("It looks like a spell has gone wrong!",20,125);
        self.ctx.fillText("Now evil creatures roam the forest around your hut!",20,150);
        self.ctx.fillText("You need to cast an anti-curse to fix this mess",20,175);
        self.ctx.fillText("But you are all out of spell ingredients...",20,200);
        self.ctx.fillText("You will need to find four magical herbs in the forest",20,225);
        self.ctx.fillText("The herbs are:",20,250);
        self.ctx.fillText("Dandelion, Skullcap, Fern and Catnip.",20,275);
        self.ctx.fillText("Be careful. The monsters are not too friendly...",20,300);
        self.ctx.font="30px Arial";
        if(this.showMsg && this.canStateChange) {
          self.ctx.fillText("Press Space!",20,self.canvas.height-40);
        }
      }
    };
      // main game play Object
    this.gameState = {
      initialised: false,
      toLeave: false,
      nextState: "",
      creepSpawnRate: 80,
      lastCreep: 25,
      mainEntities: [],
      messages: [],
      herbs: [],
      magicMissiles: [],
      evilMissiles: [],
      creeps: [],
      obstacles: [],
      obstacleXs: [370, 800, 1180, 1350, 1520, 1896, 2160, 2800, 2970, 3240, 3510, 4050, 4320, 4590, 4860, 5130, 5400, 5670, 6200, 6680, 6750, 7020, 7830, 8150, 8470, 8910, 9180, 9720, 9990, 10260,  10800, 11140,],
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
         return this.x + (this.width * 0.65);
        },
        leftScrollZone: function(){
          return this.x + (this.width * 0.35);
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
        this.mainEntities = [];
        this.messages = [];
        this.herbs = [];
        this.magicMissiles = [];
        this.evilMissiles = [];
        this.creeps = [];
        this.obstacles = [];
        this.score = 0;
        this.creepSpawnRate = 120;
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

        this.screen.speedX = 0;
        this.screen.prevX = 0;
        this.screen.x = 0;

        this.mainEntities.push(this.background);
        this.mainEntities.push(this.moonStars);
        //setting the obstacles

        this.obstacle = Object.create(self.spriteObject);

        this.oak = Object.create(this.obstacle);
        this.oak.sourceY = 1700;
        this.oak.sourceWidth = 162;
        this.oak.sourceHeight = 212;
        this.oak.width = 70;
        this.oak.height = 212;

        this.fir = Object.create(this.obstacle);
        this.fir.sourceX = 162;
        this.fir.sourceY = 1700;
        this.fir.sourceWidth = 162;
        this.fir.sourceHeight = 212;
        this.fir.width = 70;
        this.fir.height = 212;

        this.stone = Object.create(this.obstacle);
        this.stone.sourceY = 1912;
        this.stone.sourceWidth = 71;
        this.stone.sourceHeight = 51;
        this.stone.width = 71;
        this.stone.height = 51;

        this.populateObstacles();

        //witch obj
        this.witch = Object.create(self.spriteObject);
        this.witch.sourceY = 600,
        this.witch.x = 30;
        this.witch.y = self.canvas.height/2 - this.witch.height/2;
        this.witch.baseY = self.canvas.height/2 - this.witch.height/2;
        this.witch.speed = 3;
        this.witch.velocity = {x:0,y:0};
        this.witch.facing = 0;
        this.witch.angle = 0;
        this.witch.waveRange = 10;
        this.witch.inHouse = false;
        this.witch.herbsCollected = 0;
        this.witch.missileFired = false;
        this.witch.lifePoints = 100;
        this.witch.lifePointsDisp = 100;
        this.witch.recovering = false;
        this.witch.recoverTime = 90;
        this.witch.recoveredFor = 0;
        this.witch.hasDandelion = false;
        this.witch.hasSkullcap = false;
        this.witch.hasFern = false;
        this.witch.hasCatnip = false;

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

        //monsters
        this.creep = Object.create(self.spriteObject);
        this.creep.sourceY = 1636;
        this.creep.spawning = true;
        this.creep.spawnTime = 40;
        this.creep.spawningFor = 0;
        this.creep.type = undefined;
        this.creep.shooter = false;
        this.creep.frames = 11;
        this.creep.currFrame = 0;
        this.creep.dispTime = 2;
        this.creep.dispFor = 0;
        this.creep.speed = 6;
        this.creep.shotDown = false;
        this.creep.shootRate = 135;
        this.creep.lastShoot = 0;

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

        this.evilMissile = Object.create(this.magicMissile);
        this.evilMissile.sourceX = 60;
        this.evilMissile.angle = 0;
        this.evilMissile.speed = 6;
      },
      populateObstacles: function(){
        for(var i = 0;i<this.obstacleXs.length;i++){
          var randomObstacle = Math.floor(Math.random()*3);
          var randomObstacleYmod = Math.floor(Math.random()*11-(-10)+(-10));
          var obstacle;
          switch(randomObstacle){
            case 0:
              obstacle = Object.create(this.oak);
              obstacle.x = Math.floor(this.obstacleXs[i]+((obstacle.sourceWidth-obstacle.width)/2));
              obstacle.drawX = this.obstacleXs[i];
              obstacle.y = 320 + randomObstacleYmod;
              break;
            case 1:
              obstacle = Object.create(this.fir);
              obstacle.x = Math.floor(this.obstacleXs[i]+((obstacle.sourceWidth-obstacle.width)/2));
              obstacle.drawX = this.obstacleXs[i];
              obstacle.y = 320 + randomObstacleYmod;
              break;
            case 2:
              obstacle = Object.create(this.stone);
              obstacle.x = this.obstacleXs[i];
              obstacle.drawX = this.obstacleXs[i];
              obstacle.y = 460 + randomObstacleYmod;
              break;
          }
          this.obstacles.push(obstacle);
        }
      },
      spawnCreep: function(){
        var creep = Object.create(this.creep);
        creep.x = Math.floor(Math.random()*((this.screen.x+this.screen.width)-this.screen.x)+this.screen.x);
        creep.y = Math.floor(Math.random()*(self.canvas.height-200));
        this.creeps.push(creep);
      },
      chooseCreep: function(creep,screen){
        var randomCreepNum = Math.floor(Math.random()*4);
        switch(randomCreepNum){
          case 0:
            creep.type = "demonSkull";
            creep.frames = 10;
            creep.sourceY = 1380;
            creep.shooter = true;
            creep.dispTime = 4;
            creep.update = function() {
              this.x += this.speed;
              if(this.x+this.width >= screen.x+screen.width){
                this.speed = -this.speed;
              }
              if(this.speed < 0 && this.x <= screen.x) {
                this.speed = -this.speed;
              }
            };
            break;
          case 1:
            creep.type = "ghost";
            creep.frames = 4;
            creep.sourceY = 1444;
            creep.dispTime = 4;
            creep.update = function() {
              this.y += this.speed;
              if(this.y+this.height >= screen.height-100){
                this.speed = -this.speed;
              }
              if(this.speed < 0 && this.y <= 0) {
                this.speed = -this.speed;
              }
            };
            break;
          case 2:
            creep.type = "hellBat";
            creep.frames = 4;
            creep.sourceY = 1508;
            creep.baseY = creep.y;
            creep.angle = 0;
            creep.waveRange = 150;
            creep.dispTime = 4;
            creep.update = function() {
              this.x += this.speed;
              if(this.x+this.width >= screen.x+screen.width){
                this.speed = -this.speed;
              }
              if(this.speed < 0 && this.x <= screen.x) {
                this.speed = -this.speed;
              }
              this.y = this.baseY + Math.sin(this.angle) * this.waveRange;
              this.angle += 0.01;
              if(this.angle > Math.PI*2){
                this.angle = 0;
              };
              if(this.y<=0){
                this.y = 0;
              }
              if(this.y+this.height>=screen.height-150){
                this.y=screen.height-150-this.height;
              }
            };
            break;
          case 3:
            creep.type = "evilEye";
            creep.frames = 4;
            creep.dispTime = 8;
            creep.sourceY = 1572;
            creep.shooter = true;
            creep.update = function() {
            };
            break;
        }
      },
      checkCollision: function(obj1,obj2) {
        return !(obj1.x + obj1.width < obj2.x ||
                 obj2.x + obj2.width < obj1.x ||
                 obj1.y + obj1.height < obj2.y ||
                 obj2.y + obj2.height < obj1.y);
      },
      blockRectangle: function(r1, r2) {
        var vx = r1.centerX() - r2.centerX();
        var vy = r1.centerY() - r2.centerY();
        var combinedHalfWidths = r1.width/2 + r2.width/2;
        var combinedHalfHeights = r1.height/2 + r2.height/2;
        if(Math.abs(vx) < combinedHalfWidths){
          if(Math.abs(vy) < combinedHalfHeights){
            var overlapX = combinedHalfWidths - Math.abs(vx);
            var overlapY = combinedHalfHeights - Math.abs(vy);
            if(overlapX >= overlapY) {
              if(vy > 0) {
                r1.y = r1.y + overlapY;
              } else {
                r1.y = r1.y - overlapY;
              }
            } else {
              if(vx > 0) {
                r1.x = r1.x + overlapX;
              } else {
                r1.x = r1.x - overlapX;
              }
            }
          }
        }
      },
      checkWitchAtHouse: function(){
        if(this.witch.herbsCollected < 4) {
          var newMsg = Object.create(this.message);
          newMsg.text = "Go find the herbs! You need "+ String(4-this.witch.herbsCollected) +" more...";
          this.messages.push(newMsg);
        } else {
          this.toLeave = true;
          this.score = this.score+(this.witch.lifePoints*10);
          self.score = this.score;
          this.nextState = "gameWon";
        }
      },
      collectHerb: function(herb){
        this.witch.herbsCollected++;
        var witchHasHerb = herb.name[0].toUpperCase();
        var witchHasHerb2 = herb.name;
        witchHasHerb2 = witchHasHerb2.slice(1);
        witchHasHerb = "has"+witchHasHerb+witchHasHerb2;
        this.witch[witchHasHerb] = true;
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
      castEvilMissile: function(creep,witch){
        var missile = Object.create(this.evilMissile);
        missile.x = creep.x+(creep.width/2);
        missile.y = creep.y+(creep.height/2);
        missile.angle = Math.atan2(witch.y-creep.y,witch.x-creep.x);
        this.evilMissiles.push(missile);
        //console.log(missile.angle);
      },
      update: function(){
        //update witch position
        this.witch.x += this.witch.velocity.x;
        this.witch.y = this.witch.baseY + Math.sin(this.witch.angle) * this.witch.waveRange;
        this.witch.angle += 0.1;
        if(this.witch.angle > Math.PI*2){
          this.witch.angle = 0;
        };
        //update witch recovery
        if(this.witch.recovering){
          if(this.witch.recoveredFor >= this.witch.recoverTime){
            this.witch.recovering = false;
            this.witch.sourceY = 600;
            this.witch.recoveredFor = 0;
          } else {
            if(this.witch.recoveredFor%10 === 0 && this.witch.sourceY === 600){
              this.witch.sourceY = 9000000;
            } else if(this.witch.recoveredFor%10 === 0 && this.witch.sourceY !== 600){
              this.witch.sourceY = 600;
            }
            this.witch.recoveredFor++;
          }
        }
        if(this.witch.lifePointsDisp > this.witch.lifePoints){
          this.witch.lifePointsDisp--;
        }
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
        this.witch.baseY = Math.max(this.witch.waveRange, Math.min(this.witch.baseY + this.witch.velocity.y, this.gameWorld.height - this.witch.height-this.witch.waveRange-100));
        //move the screen if witch is in the scroll zones
        if(this.witch.x < this.screen.leftScrollZone()){
          this.screen.x = Math.floor(this.witch.x - (this.screen.width * 0.35));
        }
        if(this.witch.x + this.witch.width > this.screen.rightScrollZone()){
          this.screen.x = Math.floor(this.witch.x + this.witch.width - (this.screen.width * 0.65));
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
        //check if its creep spawn time
        if(this.creeps.length < 15) {
          if(this.lastCreep >= this.creepSpawnRate){
            this.spawnCreep();
            this.lastCreep = 0;
          } else {
            this.lastCreep++;
          }
        }
        //updateCreeps
        for(var i = 0; i<this.creeps.length;i++){
          var creep = this.creeps[i];
          if(creep.dispFor > creep.dispTime){
            creep.currFrame++;
            if(creep.currFrame >= creep.frames){
              creep.currFrame = 0;
            }
            creep.dispFor = 0;
          } else {
            creep.dispFor++;
          }
          if(creep.x<this.screen.x-100 || creep.x>this.screen.x+this.screen.width+100){
            this.creeps.splice(i,1);
          }
          if(creep.spawning && creep.spawningFor >= creep.spawnTime){
            creep.spawning = false;
            this.chooseCreep(creep,this.screen);
          } else {
            creep.spawningFor++;
          }
          if(!creep.spawning){
            creep.update();
          }
          if(creep.shooter && creep.lastShoot >= creep.shootRate){
            this.castEvilMissile(creep,this.witch);
            creep.lastShoot = 0;
          } else {
            creep.lastShoot++;
          }
          if(creep.shotDown && creep.type !== "dead"){
            creep.type = "dead";
            creep.speed = 0;
            creep.sourceY = 1636;
            creep.sourceX = 384;
            creep.currFrame = 6;
            creep.frames = 12;
          }
          if(creep.type === "dead" && creep.currFrame === 10){
            this.creeps.splice(i,1)
          }
        };
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
        //update evil missiles
        for(var i = 0; i < this.evilMissiles.length; i++){
          var missile = this.evilMissiles[i];
          if(missile.dispFor > missile.dispTime){
            missile.currFrame++;
            if(missile.currFrame === missile.frames){
              missile.currFrame = 0;
            }
            missile.dispFor = 0;
          } else {
            missile.dispFor++;
          }
          missile.x += Math.cos(missile.angle) * missile.speed;
          missile.y += Math.sin(missile.angle) * missile.speed;
          if(missile.x < this.screen.x-500 || missile.x > this.screen.x+this.screen.width+500){
            this.evilMissiles.splice(i,1);
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

        for(var i = 0; i<this.obstacles.length; i++){
          this.blockRectangle(this.witch,this.obstacles[i]);
        }

        for(var i = 0;i<this.creeps.length;i++){
          var creep = this.creeps[i];
          if(!creep.spawning && !creep.shotDown && this.checkCollision(this.witch,creep)){
            creep.shotDown = true;
            if(!this.witch.recovering){
              this.witch.lifePoints -= 10;
              this.witch.recovering = true;
            }
          }
        }

        for(var i = 0;i<this.evilMissiles.length;i++){
          var missile = this.evilMissiles[i];
          if(this.checkCollision(this.witch,missile)){
            this.evilMissiles.splice(i,1);
            if(!this.witch.recovering){
              this.witch.lifePoints -= 10;
              this.witch.recovering = true;
            }
          }
        }

        for(var i = 0; i < this.herbs.length; i++){
          var herb = this.herbs[i];
          if(this.checkCollision(this.witch,herb)){
            if(herb.active){
              this.collectHerb(herb);
              herb.active = false;
              this.creepSpawnRate -= 15;
            }
          }
        };
        for(var i = 0; i < this.magicMissiles.length; i++){
          var missile = this.magicMissiles[i];
          for(var j = 0; j < this.creeps.length; j++){
            var creep = this.creeps[j];
            if(!creep.spawning && this.checkCollision(missile,creep)){
              this.magicMissiles.splice(i,1);
              creep.shotDown = true;
              this.score += 10;
            }
          }
        }
        //check if witch is still alive
        if(this.witch.lifePoints <= 0) {
          this.toLeave = true;
          this.nextState = "gameLost";
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
          //draw obstacles
          for (var i = 0; i < this.obstacles.length; i++) {
            var obstacle = this.obstacles[i];
            self.ctx.drawImage(self.masterSprite,obstacle.sourceX,obstacle.sourceY,obstacle.sourceWidth,obstacle.sourceHeight,Math.floor(obstacle.drawX),Math.floor(obstacle.y),obstacle.sourceWidth,obstacle.sourceHeight);
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
          for(var i = 0; i < this.evilMissiles.length; i++){
            var missile = this.evilMissiles[i]
            self.ctx.drawImage(self.masterSprite,(missile.sourceX+(missile.currFrame*missile.sourceWidth)),missile.sourceY,missile.sourceWidth,missile.sourceHeight,Math.floor(missile.x),Math.floor(missile.y),missile.width,missile.height);
          }
          //draw creeps
          for(var i = 0; i < this.creeps.length; i++){
            var creep = this.creeps[i]
              self.ctx.drawImage(self.masterSprite,(creep.currFrame*creep.sourceWidth),creep.sourceY,creep.sourceWidth,creep.sourceHeight,Math.floor(creep.x),Math.floor(creep.y),creep.width,creep.height);
          }
          //draw meassages
          self.ctx.font="20px Arial";
    			self.ctx.fillStyle = '#FFF';
    			self.ctx.textAlign = "center";
          for(var i = 0; i < this.messages.length; i++) {
            self.ctx.fillText(this.messages[i].text,this.screen.x+this.messages[i].x,this.screen.y+this.messages[i].y+(25*i));
          }
          //draw score
          self.ctx.textAlign = "left";
          self.ctx.fillText("score: "+this.score,this.screen.x+10,30);
          self.ctx.restore();
          self.ctx.restore();
          //draw GUI
          self.ctx.fillStyle = "black";
          self.ctx.drawImage(self.masterSprite,0,1989,400,40,10,self.canvas.height-50,400,40);
          self.ctx.fillStyle = "red";
          self.ctx.drawImage(self.masterSprite,0,1963,46,26,12,canvas.height-43,46,26);
          self.ctx.fillRect(60,canvas.height-40, this.witch.lifePointsDisp*2, 15);
          if(this.witch.hasSkullcap){
            self.ctx.drawImage(self.masterSprite,this.skullcap.sourceX,this.skullcap.sourceY,this.skullcap.sourceWidth,this.skullcap.sourceHeight,270,self.canvas.height-45,this.skullcap.width,this.skullcap.height);
          } else {
            self.ctx.drawImage(self.masterSprite,this.skullcap.sourceX+(4*this.skullcap.width),this.skullcap.sourceY,this.skullcap.sourceWidth,this.skullcap.sourceHeight,270,self.canvas.height-45,this.skullcap.width,this.skullcap.height);
          }
          if(this.witch.hasDandelion){
            self.ctx.drawImage(self.masterSprite,this.dandelion.sourceX,this.dandelion.sourceY,this.dandelion.sourceWidth,this.dandelion.sourceHeight,305,self.canvas.height-45,this.dandelion.width,this.dandelion.height);
          } else {
            self.ctx.drawImage(self.masterSprite,this.dandelion.sourceX+(4*this.dandelion.width),this.dandelion.sourceY,this.dandelion.sourceWidth,this.dandelion.sourceHeight,305,self.canvas.height-45,this.dandelion.width,this.dandelion.height)
          }
          if(this.witch.hasFern){
            self.ctx.drawImage(self.masterSprite,this.fern.sourceX,this.fern.sourceY,this.fern.sourceWidth,this.fern.sourceHeight,340,self.canvas.height-45,this.fern.width,this.fern.height);
          } else {
            self.ctx.drawImage(self.masterSprite,this.fern.sourceX+(4*this.fern.width),this.fern.sourceY,this.fern.sourceWidth,this.fern.sourceHeight,340,self.canvas.height-45,this.fern.width,this.fern.height)
          }
          if(this.witch.hasCatnip){
            self.ctx.drawImage(self.masterSprite,this.catnip.sourceX,this.catnip.sourceY,this.catnip.sourceWidth,this.catnip.sourceHeight,375,self.canvas.height-45,this.catnip.width,this.catnip.height);
          } else {
            self.ctx.drawImage(self.masterSprite,this.catnip.sourceX+(4*this.catnip.width),this.catnip.sourceY,this.catnip.sourceWidth,this.catnip.sourceHeight,375,self.canvas.height-45,this.catnip.width,this.catnip.height)
          }
        }
      }
    };
    this.gameWon = {
      initialised: false,
      toLeave: false,
      nextState: "",
      stateTime: 50,
      stateTimer: 0,
      canStateChange: false,
      init: function(){
        this.initialised = true;
        console.log("initialised gameWon");
      },
      update: function(){
        if(self.pressedKeys[32] && this.canStateChange){
          this.toLeave = true;
          this.canStateChange = false;
          this.nextState = "menuState";
        };
        if(!this.canStateChange && this.stateTimer > this.stateTime){
          this.canStateChange = true;
          this.stateTimer = 0;
        } else if(!this.canStateChange){
          this.stateTimer++;
        }
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height)
        self.ctx.drawImage(self.gameWonScreen,0,0,self.canvas.width,self.canvas.height);
        self.ctx.font="20px Arial";
  			self.ctx.fillStyle = '#FFF';
  			self.ctx.textAlign = "left";
        self.ctx.fillText("Congratularions! You have won the game!",20,100);
        self.ctx.fillText("Your score:",20,130);
        self.ctx.font="80px Arial";
        self.ctx.fillText(self.score,20,230);
      }
    };
    this.gameLost = {
      initialised: false,
      toLeave: false,
      nextState: "",
      showMsg: true,
      msgTimer: 0,
      msgTime: 20,
      stateTime: 50,
      stateTimer: 0,
      canStateChange: false,
      init: function(){
        this.initialised = true;
        console.log("initialised gameLost");
      },
      update: function(){
        if(self.pressedKeys[32] && this.canStateChange){
          this.toLeave = true;
          this.canStateChange = false;
          this.nextState = "menuState";
        }
        if(this.msgTimer > this.msgTime){
          if(this.showMsg){
            this.showMsg = false;
          } else {
            this.showMsg = true;
          }
          this.msgTimer = 0;
        } else {
          this.msgTimer++;
        }
        if(!this.canStateChange && this.stateTimer > this.stateTime){
          this.canStateChange = true;
          this.stateTimer = 0;
        } else if(!this.canStateChange){
          this.stateTimer++;
        }
      },
      draw: function(){
        self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height)
        self.ctx.drawImage(self.gameOverScreen,0,0,self.canvas.width,self.canvas.height);
        self.ctx.font="30px Arial";
  			self.ctx.fillStyle = '#FFF';
  			self.ctx.textAlign = "left";
        self.ctx.fillText("Oh no... You have lost!",20,self.canvas.height-80);
        if(this.showMsg && this.canStateChange) {
          self.ctx.fillText("Press Space!",20,self.canvas.height-40);
        }
      }
    };
  }
