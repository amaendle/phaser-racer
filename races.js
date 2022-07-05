/* global Phaser */
     var canvas_width = window.innerWidth * window.devicePixelRatio;
     var canvas_height = window.innerHeight * window.devicePixelRatio;
     var aspect_ratio = canvas_width / canvas_height;
     if (aspect_ratio<(4/3)) aspect_ratio=4/3;
     if (aspect_ratio>(16/9)) aspect_ratio=16/9;
     var offset = 132-0.5*(1072-800);
     var offset2 = 132
var gwidth = (4/3)*600;//1072; //800     
var offset3=132-0.5*(1072-gwidth);


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-racer', { preload: preload, create: create, update: update, render: render  });
// auch interessant http://schteppe.github.io/p2.js//demos/car.html
//https://codepen.io/Samid737/pen/dWBjwB
//var staticFriction=400;
//https://www.anexia-it.com/blog/de/einstieg-in-das-phaser-framework/
var source, intervalId;

function preload() {
    game.load.image('cpu0', 'assets/sprites/carred2.png');
    game.load.image('cpu1', 'assets/sprites/carblu.png');
    game.load.image('isle', 'assets/islew.png');
    game.load.spritesheet('palme1', 'assets/sprites/palme1.png');
    game.load.spritesheet('palme2', 'assets/sprites/palme2.png');
    game.load.spritesheet('palme3', 'assets/sprites/palme3.png');
    game.load.physics("collision","assets/sprites/collision.json");
    game.load.json('track1', 'assets/track1.json');
    
    game.load.audio('honk', 'assets/sounds/honk.wav');
    game.load.audio('engine', 'assets/sounds/engine.wav');
    
    
    //  var canvas_width = window.innerWidth * window.devicePixelRatio;
    //  var canvas_height = window.innerHeight * window.devicePixelRatio;
    //  var aspect_ratio = canvas_width / canvas_height;
    //  var scale_ratio = canvas_height / 600;
//      game.scale.setUserScale(window.innerWidth/1072, window.innerWidth/1072, 272, 0)    
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
   // game.scale.windowConstraints.bottom = "visual";
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL ;//NO_SCALE;//SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; ///SHOW_ALL;//.RESIZE; //.EXACT_FIT;
    game.stage.disableVisibilityChange = false;
    
}

var devmode=!true;
var fullscreen=false;
var player;
var playercntr; var playercntrshape;
var playersplash=false;
var playerround=0;
var playertrckpos=0;
var cpu1;
var cpu1cntr; var cpu1cntrshape;
var cpu1splash=false;
var cpu1round=0;
var cpu1trckpos=0; 
var cursors;
var layer;
var map; var finish; var ground;
var trackdata;
var velocity = 0;
var cpu1velocity = 0;
var cpu1tg ;
var p1drift=true;
var cpu1drift=true;
var cpu1iscpu = true;
var cpu1ok = true;
var timecnt = 0; var timecntstart = -1;
var text, introtxt, cpu1laps, playerlaps;
var instructions = [
    "Control the red car using \u21e6 \u21e8 \u21e7 \u21e9",
    "Control the blue car using \u24cc \u24b6 \u24c8 \u24b9",
    "Press \u2780 for single player race",
    "Press \u2781 for two player race",
    "Press \u21e7 to honk",
    "    ",
];
var introcnt, introtxt, introtime;
var timeevt;
var wait=true;

var playerup=false;
var playerdown=false;
var playerleft=false;
var playerright=false;
var cpuup=false;
var cpudown=false;
var cpuleft=false;
var cpuright=false;

// engine
var engineini = false;
var intervalId;
     var pitch = {step: 0, min: 1.1, max: 2.2,  value: 1.1};
var honk, engine;
var honking=false;

var btnup, btndown, btnleft, btnright, btn1p, btn2p, btnbluup, btnbludown, btnbluright, btnbluleft;
var singlertxt;
var singlerace, vsrace;

var pad1, pad2;

var p1 ,p2,p3,p4,p5,p6;

var tracklen = [];
var tracklencum = [0];
var cpu1trcklenpos;
var playrmdist, cpu1mdistarr;
var playrzone1 = false;
var playrzone2 = false;
var playrzone3 = false;


function create() {
    var updateoffset = function() {
        var playermapx, cpu1mapx;
        canvas_width = window.innerWidth * window.devicePixelRatio;
        canvas_height = window.innerHeight * window.devicePixelRatio;
        aspect_ratio = canvas_width / canvas_height;
        if (aspect_ratio<(4/3)) aspect_ratio=4/3;
        if (aspect_ratio>(16/9)) aspect_ratio=16/9;
        offset = 132-0.5*(1072-800);
        offset2 = 132
        offset3=132-0.5*(1072-gwidth);
        
        playermapx=player.body.x-map.body.x
        cpu1mapx=cpu1.body.x-map.body.x
        map.body.x = 0.5*gwidth+offset2,
        finish.body.x = 0+offset3;//nicht (400, 300);
        ground.body.x = 15+offset3;//nicht (400, 300);  
        player.body.x= playermapx+map.body.x //offset3+4;
        cpu1.body.x= cpu1mapx+map.body.x //offset3+4;            
        
        palme2.body.x=600+offset3;
        palme3.body.x=210+offset3;
        palme1.body.x=590+offset3;
        // if (devmode) {
        //     var j;    var tmpsprite;
        //     for (j = 0; j < trackdata.shape.length-1; j=j+2) {  
        //         tmpsprite = game.add.sprite(trackdata.shape[j]+offset3, trackdata.shape[j+1]);
        //         game.physics.p2.enable([tmpsprite]);
        //         tmpsprite.body.setRectangle(30,30);
        //         tmpsprite.body.debug=true;
        //         //tmpsprite.body.mass=1000;
        //     }
        // }
        playercntr.body.x=player.centerX+offset;
        cpu1cntr.body.x=player.centerX+offset;
        btnup.fixedToCamera = false;
        btnup.x = gwidth-100;
        btnup.fixedToCamera = true;
                btndown.fixedToCamera = false;
        btndown.x = gwidth-100;
        btndown.fixedToCamera = true;
        btn1p.x=320+offset3;
        btn2p.x=320+offset3;
        cpu1laps.x = game.world.centerX-80; // MACHT FEHLER?
       playerlaps.x=game.world.centerX+80;
       introtxt.x =game.world.centerX;
       text.x =game.world.centerX;
       
       if (!game.device.desktop) {
           if (cpu1iscpu==true) {
               setbuttons(1);
           } else {
               setbuttons(2);
           }           
       }

    }
    
     gofull = function() { 
       gwidth = aspect_ratio*600;//1072; //800     
      game.width = gwidth;
      game.height= 600;      
      game.scale.setGameSize(gwidth,600)
      game.scale.startFullScreen(false);       
    //  if (!fullscreen) { // SONST PROBLEME MIT UPDATE OFFSET
      updateoffset();
      fullscreen=true;
    //  }
  }
  var togglefull = function() {
      if (!fullscreen) {
          gofull();
        } else {
        gwidth = (4/3)*600;//1072; //800     
        game.width = gwidth;
        game.height= 600;    
        game.scale.setGameSize(gwidth,600)
        game.scale.stopFullScreen();
        updateoffset();
        fullscreen=false;
        }
  }
  if (!game.device.desktop){ 
      game.input.onDown.add(gofull, this);  //go fullscreen on mobile devices 
      setbuttons(1);
  }
//       game.width = gwidth;
//       game.height= 600;
//   game.scale.startFullScreen(false);
  
  honk = game.add.audio('honk');
  engine = game.add.audio('engine');

    iniengine = function(e) {
        if (!engine.isPlaying) {
            engine.loopFull(1.0);   
        }      
        engine._sound.playbackRate.value = pitch.value;
        
       intervalId = setInterval(function(){
          if ((pitch.value > pitch.min) &&
              (pitch.value < pitch.max)) {
            engine._sound.playbackRate.value = pitch.value; // sehr witzig mit += statt =...
          }
        }, 50);
    }
    
    game.physics.startSystem(Phaser.Physics.P2JS);

    //game.stage.backgroundColor = '#0072bc';
    map = game.add.sprite(0.5*gwidth+offset2, 300, 'isle');//map = game.add.sprite(0,0, 'isle');
   // map.anchor.setTo(0.5, 0.5);
 //   map.position.setTo(668,300);
    finish = game.add.sprite(0+offset3,0);//nicht (400, 300);
    ground = game.add.sprite(15+offset3,15);//nicht (400, 300);

    player = game.add.sprite(400+offset3, 100, 'cpu0');
    cpu1 = game.add.sprite(400+offset3, 60, 'cpu1');
  //  player.anchor.setTo(0.5, 0.5);

     game.physics.p2.enable([player,cpu1]);  // game.physics.p2.enable(player,false);
     player.body.angle = 90; cpu1.body.angle = 90;
     player.body.mass=50; cpu1.body.mass=50;//?
     
    var carCollisionGroup = game.physics.p2.createCollisionGroup();
    var buildingCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();

    var palme2 = game.add.sprite(600+offset3,230,'palme2');
    var palme3 = game.add.sprite(210+offset3,360,'palme3');
    var palme1 = game.add.sprite(590+offset3,310,'palme1');
    
    if(devmode) {
        game.physics.p2.enable([palme1,palme2,palme3,map,finish,ground],true);
    } else game.physics.p2.enable([palme1,palme2,palme3,map,finish,ground]);

    palme1.body.kinematic = true;
    palme2.body.kinematic = true;
    palme3.body.kinematic = true;
    palme1.body.clearShapes();
    palme2.body.clearShapes();
    palme3.body.clearShapes();
    map.body.clearShapes();
    ground.body.clearShapes();
    finish.body.clearShapes();
    palme1.body.loadPolygon('collision','palme1');
    palme2.body.loadPolygon('collision','palme2');
    palme3.body.loadPolygon('collision','palme3');
    map.body.loadPolygon('collision','water2');
    finish.body.loadPolygon('collision','finish');
    ground.body.loadPolygon('collision','ground'); //groundS
    
    // NO COLLISION - http://www.html5gamedevs.com/topic/21448-p2-physics-onbegincontact-without-executing-collision/
    for (var i=0; i<map.body.data.shapes.length;i++) map.body.data.shapes[i].sensor=true;  // reicht das nich in collision definition? nein
    for (var i=0; i<finish.body.data.shapes.length;i++) finish.body.data.shapes[i].sensor=true; 
    for (var i=0; i<ground.body.data.shapes.length;i++) ground.body.data.shapes[i].sensor=true; 

    map.body.offset.x=-offset2;

    player.body.setCollisionGroup(carCollisionGroup);
    cpu1.body.setCollisionGroup(carCollisionGroup);
    palme1.body.setCollisionGroup(buildingCollisionGroup);
    palme2.body.setCollisionGroup(buildingCollisionGroup);
    palme3.body.setCollisionGroup(buildingCollisionGroup);

    player.body.collides([carCollisionGroup,buildingCollisionGroup]);
    cpu1.body.collides([carCollisionGroup,buildingCollisionGroup]);
    palme1.body.collides([buildingCollisionGroup,carCollisionGroup]);
    palme2.body.collides([buildingCollisionGroup,carCollisionGroup]);
    palme3.body.collides([buildingCollisionGroup,carCollisionGroup]);

    cursors = game.input.keyboard.createCursorKeys();

    trackdata = game.cache.getJSON('track1');  //http://www.html5gamedevs.com/topic/37544-how-to-load-a-json-file/
    
    //idee: verschiedene missionen: rennen. fahre unter einer zeit x trotz verrücktem raser, pushe den blauen ins wasser 
    
    if (devmode) {
        var j;    var tmpsprite;
        for (j = 0; j < trackdata.shape.length-1; j=j+2) {  
            tmpsprite = game.add.sprite(trackdata.shape[j]+offset3, trackdata.shape[j+1]);
            game.physics.p2.enable([tmpsprite]);
            tmpsprite.body.setRectangle(30,30);
            tmpsprite.body.debug=true;
            //tmpsprite.body.mass=1000;
        }
              
    }
    
    // create car rectangle
    playercntr = game.add.sprite(player.centerX+offset, player.centerY);
    game.physics.p2.enable([playercntr]);
    playercntrshape = playercntr.body.setRectangle(30,30);
    playercntrshape.sensor=true; 
    if (devmode) playercntr.body.debug=true;

    //  Lock the two bodies together. The [0, 50] sets the distance apart (y: 80)
    var constraint = game.physics.p2.createLockConstraint(player, playercntr, [0, 1], 0);
    
    // create cpu1 rectangle
    cpu1cntr = game.add.sprite(player.centerX+offset, player.centerY);
    game.physics.p2.enable([playercntr,cpu1cntr]);
    cpu1cntrshape=cpu1cntr.body.setRectangle(30,30);
    cpu1cntrshape.sensor=true; //cpu1cntrshape.body.shapes[0].sensor = true;
    if (devmode) cpu1cntr.body.debug=true;

    //  Lock the two bodies together. The [0, 50] sets the distance apart (y: 80)
    var constraint2 = game.physics.p2.createLockConstraint(cpu1, cpu1cntr, [0, 1], 0);
    //Phaser.Physics.P2.Body#staticbody.static = true
    
    var fischfutter = function(body, bodyB, shapeA, shapeB, equation) {
       //console.log("Heureka!");
       if(shapeB===cpu1cntrshape) {
           cpu1splash = true;
        } else if(shapeB===playercntrshape) {
           playersplash = true;
        }
       }
    map.body.onBeginContact.add(fischfutter, this);
    
    var unsplash = function(body, bodyB, shapeA, shapeB, equation) {
        if(shapeB===cpu1cntrshape) {
            cpu1splash = false;
            cpu1.alpha=1;
        }
        if(shapeB===playercntrshape) {
            playersplash = false;
            player.alpha=1;
        }
       }
    ground.body.onBeginContact.add(unsplash, this);

    var newlap = function(body, bodyB, shapeA, shapeB, equation) {
        if (wait) {
            playerround=0;
            playrzone1=false; playrzone2=false; playrzone3=false;
            cpu1round=0;    
            playerlaps.alpha=1;
            cpu1laps.alpha=1;
        } else {
            if(shapeB===cpu1cntrshape) cpu1round +=   1
            if(shapeB===playercntrshape && playrzone1 && playrzone2 && playrzone3) {
                playerround +=   1 ;
                playrzone1=false; playrzone2=false; playrzone3=false;
            }
        }
        playerlaps.setText(playerround);
        cpu1laps.setText(cpu1round);
       }
    finish.body.onBeginContact.add(newlap, this);
    
    text = game.add.text(game.world.centerX, game.world.centerY-80, 'LOREM IPSUM', { align: "center" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
    text.alpha=0.0;//
    text.anchor.setTo(0.5, 0.5);
    
    cpu1laps = game.add.text(game.world.centerX-80+offset3, game.world.centerY-80, '0', { fill: "#0000ff", aalign: "center" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
    cpu1laps.alpha=1.0;//
    cpu1laps.anchor.setTo(0.5, 0.5);
    playerlaps = game.add.text(game.world.centerX+80+offset3, game.world.centerY-80, '0', { fill: "#ff0000", aalign: "center" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
    playerlaps.alpha=1.0;//
    playerlaps.anchor.setTo(0.5, 0.5);
    
    introcnt = 0    
    introtxt = game.add.text(game.world.centerX, game.world.centerY+280, instructions[introcnt], { align: "center" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
    introtxt.alpha=1.0;//
    introtxt.anchor.setTo(0.5, 0.5);

    var setintro=function() {
        introcnt++;
        if (instructions.length-1<introcnt) introcnt=0;
        introtxt.setText(instructions[introcnt]);
    }
    introtime = game.time.events.loop(Phaser.Timer.SECOND*5, setintro, this);
    
    cpu1tg = new Phaser.Line(0,0,10,10);  

    timeevt = game.time.events.loop(80, updateCounter, this);
        
        
        // create button graphics
        var w = 64;
        
        var bluup = game.make.graphics(0, 0);
        bluup.lineStyle(3, 0xffffff, 1);
        bluup.visible = false;
        // draw frame 0
        bluup.moveTo(0.5*w, w-3);
        bluup.lineTo(3, w-3);
        bluup.lineTo(0.5*w, 3);
        bluup.lineTo(w-3, w-3);
        bluup.currentPath.shape.closed = true;
        // draw frame 1        
        bluup.beginFill(0x33FF);
        bluup.moveTo(w+0.5*w, w-3);
        bluup.lineTo(w+3, w-3);
        bluup.lineTo(w+0.5*w, 3);
        bluup.lineTo(w+w-3, w-3);
        bluup.currentPath.shape.closed = true;
        // creating a sprite sheet with generateTexture
        game.cache.addSpriteSheet('bluupbtn', null, bluup.generateTexture().baseTexture.source, w, w, 2, 0, 0);

        
        var gfxup = game.make.graphics(0, 0);
        gfxup.lineStyle(3, 0xffffff, 1);
        gfxup.visible = false;
        // draw frame 0
        gfxup.moveTo(0.5*w, w-3);
        gfxup.lineTo(3, w-3);
        gfxup.lineTo(0.5*w, 3);
        gfxup.lineTo(w-3, w-3);
        gfxup.currentPath.shape.closed = true;
        // draw frame 1        
        gfxup.beginFill(0xFF3300);
        gfxup.moveTo(w+0.5*w, w-3);
        gfxup.lineTo(w+3, w-3);
        gfxup.lineTo(w+0.5*w, 3);
        gfxup.lineTo(w+w-3, w-3);
        gfxup.currentPath.shape.closed = true;
        // creating a sprite sheet with generateTexture
        game.cache.addSpriteSheet('upbtn', null, gfxup.generateTexture().baseTexture.source, w, w, 2, 0, 0);

        // var gfxdown = game.make.graphics(0, 0);
        // gfxdown.lineStyle(3, 0xffffff, 1);
        // gfxdown.visible = false;
        // // draw frame 0
        // gfxdown.moveTo(0.5*w, 3);
        // gfxdown.lineTo(3, 3);
        // gfxdown.lineTo(0.5*w, w-3);
        // gfxdown.lineTo(w-3, 3);
        // gfxdown.currentPath.shape.closed = true;
        // // draw frame 1        
        // gfxdown.beginFill(0xFF3300);
        // gfxdown.moveTo(w+0.5*w, 3);
        // gfxdown.lineTo(w+3, 3);
        // gfxdown.lineTo(w+0.5*w, w-3);
        // gfxdown.lineTo(w+w-3, 3);
        // gfxdown.currentPath.shape.closed = true;
        // // creating a sprite sheet with generateTexture
        // game.cache.addSpriteSheet('downbtn', null, gfxdown.generateTexture().baseTexture.source, w, w, 2, 0, 0);
        
        // var gfxleft = game.make.graphics(0, 0);
        // gfxleft.lineStyle(3, 0xffffff, 1);
        // gfxleft.visible = false;
        // // draw frame 0
        // gfxleft.moveTo(w-3, 0.5*w);
        // gfxleft.lineTo(w-3, 3);
        // gfxleft.lineTo(3, 0.5*w);
        // gfxleft.lineTo(w-3, w-3);
        // gfxleft.currentPath.shape.closed = true;
        // // draw frame 1        
        // gfxleft.beginFill(0xFF3300);
        // gfxleft.moveTo(w+w-3,0.5*w);
        // gfxleft.lineTo(w+w-3, 3);
        // gfxleft.lineTo(w+3, 0.5*w);
        // gfxleft.lineTo(w+w-3, w-3);
        // gfxleft.currentPath.shape.closed = true;
        // // creating a sprite sheet with generateTexture
        // game.cache.addSpriteSheet('leftbtn', null, gfxleft.generateTexture().baseTexture.source, w, w, 2, 0, 0);

        // var gfxright = game.make.graphics(0, 0);
        // gfxright.lineStyle(3, 0xffffff, 1);
        // gfxright.visible = false;
        // // draw frame 0
        // gfxright.moveTo(3, 0.5*w);
        // gfxright.lineTo(3, 3);
        // gfxright.lineTo(w-3, 0.5*w);
        // gfxright.lineTo(3, w-3);
        // gfxright.currentPath.shape.closed = true;
        // // draw frame 1        
        // gfxright.beginFill(0xFF3300);
        // gfxright.moveTo(w+3,0.5*w);
        // gfxright.lineTo(w+3, 3);
        // gfxright.lineTo(w+w-3, 0.5*w);
        // gfxright.lineTo(w+3, w-3);
        // gfxright.currentPath.shape.closed = true;
        // // creating a sprite sheet with generateTexture
        // game.cache.addSpriteSheet('rightbtn', null, gfxright.generateTexture().baseTexture.source, w, w, 2, 0, 0);

        //singlextxt local var
        singlertxt = game.add.text(0, 0, '\u2780-player', { align: "center", fontSize: "38px" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
        btn1p = game.add.button(320+offset3, 160, singlertxt.generateTexture(), null, this, 0, 1, 0, 1);  
        singlertxt.setText('\u2781-player');
        btn2p = game.add.button(320+offset3, 230, singlertxt.generateTexture(), null, this, 0, 1, 0, 1);  
        singlertxt.alpha=0.0;
        btn1p.inputEnabled = true;
        btn2p.inputEnabled = true;
        btn1p.events.onInputDown.add(function(){startrace(1);});
        btn2p.events.onInputDown.add(function(){startrace(2);});

        
    // create game controller buttons 
    btnbluup = game.add.button(100+0.5*w-32, 5+32, 'bluupbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnbluup.visible=false;
    btnbluup.anchor.setTo(0.5,0.5);
    btnbluup.fixedToCamera = true;  //our buttons should stay on the same place  
    btnbluup.inputEnabled = true;
    // btnbluup.events.onInputOver.add(function(){cpuleft=true;cpuright=false;});
    // btnbluup.events.onInputOut.add(function(){cpuleft=false;});
    // btnbluup.events.onInputDown.add(function(){cpuleft=true;cpuright=false;});
    // btnbluup.events.onInputUp.add(function(){cpuleft=false;});
    
    btnbludown = game.add.button(100+0.5*w-32, 105+32, 'bluupbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnbludown.visible=false;
    btnbludown.anchor.setTo(0.5,0.5);
    btnbludown.angle = 180;
    btnbludown.fixedToCamera = true;  //our buttons should stay on the same place  
    btnbludown.inputEnabled = true;
    // btnbludown.events.onInputOver.add(function(){cpuright=true;cpuleft=false;});
    // btnbludown.events.onInputOut.add(function(){cpuright=false;});
    // btnbludown.events.onInputDown.add(function(){cpuright=true;cpuleft=false;});
    // btnbludown.events.onInputUp.add(function(){cpuright=false;});
    
    btnbluleft = game.add.button(5+32, 600-100+32, 'bluupbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnbluleft.visible=false;
    btnbluleft.anchor.setTo(0.5,0.5);
    btnbluleft.angle = 270;
    btnbluleft.fixedToCamera = true;  //our buttons should stay on the same place  
    btnbluleft.inputEnabled = true;
    // btnbluleft.events.onInputOver.add(function(){cpudown=true;cpuup=false;});
    // btnbluleft.events.onInputOut.add(function(){cpudown=false;});
    // btnbluleft.events.onInputDown.add(function(){cpudown=true;cpuup=false;});
    // btnbluleft.events.onInputUp.add(function(){cpudown=false;});
    
    btnbluright = game.add.button(100+5+32, 600-100+32, 'bluupbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnbluright.visible=false;
    btnbluright.anchor.setTo(0.5,0.5);
    btnbluright.angle = 90;
    btnbluright.fixedToCamera = true;  //our buttons should stay on the same place  
    btnbluright.inputEnabled = true;
    // btnbluright.events.onInputOver.add(function(){cpuup=true;cpudown=false;});
    // btnbluright.events.onInputOut.add(function(){cpuup=false;});
    // btnbluright.events.onInputDown.add(function(){cpuup=true;cpudown=false;});
    // btnbluright.events.onInputUp.add(function(){cpuup=false;});
    
    
    
    btnup = game.add.button(gwidth-100+32, 600-200+32, 'upbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnup.visible=false;
    btnup.anchor.setTo(0.5,0.5);
    btnup.fixedToCamera = true;  //our buttons should stay on the same place  
    btnup.inputEnabled = true;
    // btnup.events.onInputOver.add(function(){playerup=true;playerdown=false;});
    // btnup.events.onInputOut.add(function(){playerup=false;});
    // btnup.events.onInputDown.add(function(){playerup=true;playerdown=false;});
    // btnup.events.onInputUp.add(function(){playerup=false;});
    
    btndown = game.add.button(gwidth-100+32, 600-100+32, 'upbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btndown.visible=false;
    btndown.anchor.setTo(0.5,0.5);
    btndown.angle = 180;
    btndown.fixedToCamera = true;  //our buttons should stay on the same place  
    btndown.inputEnabled = true;
    // btndown.events.onInputOver.add(function(){playerdown=true;playerup=false;});
    // btndown.events.onInputOut.add(function(){playerdown=false;});
    // btndown.events.onInputDown.add(function(){playerdown=true;playerup=false;});
    // btndown.events.onInputUp.add(function(){playerdown=false;});
    btnleft = game.add.button(5+32, 600-100-0.5*w+32, 'upbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnleft.visible=false;
    btnleft.anchor.setTo(0.5,0.5);
    btnleft.angle = 270;
    btnleft.fixedToCamera = true;  //our buttons should stay on the same place  
    btnleft.inputEnabled = true; // not needed?
    // btnleft.events.onInputOver.add(function(){playerleft=true;playerright=false});
    // btnleft.events.onInputOut.add(function(){playerleft=false;});
    // btnleft.events.onInputDown.add(function(){playerleft=true;playerright=false});
    // btnleft.events.onInputUp.add(function(){playerleft=false;});
    btnright = game.add.button(105+32, 600-100-0.5*w+32, 'upbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnright.visible=false;
    btnright.anchor.setTo(0.5,0.5);
    btnright.angle = 90;
    btnright.fixedToCamera = true;  //our buttons should stay on the same place  
    btnright.inputEnabled = true;
    // btnright.events.onInputOver.add(function(){playerright=true;playerleft=false;});
    // btnright.events.onInputOut.add(function(){playerright=false;});
    // btnright.events.onInputDown.add(function(){playerright=true;playerleft=false;});
    // btnright.events.onInputUp.add(function(){playerright=false;});
    
    var keyF = game.input.keyboard.addKey(Phaser.Keyboard.F);
    keyF.onDown.add(togglefull, this);
    
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    
    p1 = game.input.pointer1;
    p2 = game.input.pointer2;
    p3 = game.input.pointer3;
    p4 = game.input.pointer4;
    p5 = game.input.pointer5;
    p6 = game.input.pointer6;
    
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    pad2 = game.input.gamepad.pad2;
        
        
    //determine tracklenghths
    tracklen = [];
    tracklencum = [0];
    for (var k = 0; k < trackdata.shape.length-3; k=k+2) { 
    	tracklen.push(Math.sqrt(Math.pow(trackdata.shape[k+2]-trackdata.shape[k], 2)+Math.pow(trackdata.shape[k+3]-trackdata.shape[k+1], 2)));
    	tracklencum.push(tracklencum[tracklencum.length - 1]+tracklen[tracklen.length - 1]);
    }
    tracklen.push(Math.sqrt(Math.pow(trackdata.shape[0]-trackdata.shape[trackdata.shape.length-2], 2)+Math.pow(trackdata.shape[1]-trackdata.shape[trackdata.shape.length-1], 2)));
    tracklencum.push(tracklencum[tracklencum.length - 1]+tracklen[tracklen.length - 1]);
}

function updateCounter() {
if (timecntstart<0) {
    
}   else { 
    timecnt = (timeevt.timer.ms - timecntstart)/1000;

    if (timecnt<3) {
        text.setText((Phaser.Math.floorTo(timecnt)-3)+"...");
        wait=true;
    }
    else if (timecnt<4) {
        text.setText("GO!");
        wait=false;
    }
    else {
        if (timecnt<63) {
            text.setText(  parseFloat(63-(timecnt-1)).toFixed(3) );    
        } else {
            if (playerround+(playrmdist[4]/tracklencum[tracklencum.length-1])<cpu1round+(cpu1mdistarr[4]/tracklencum[tracklencum.length-1])) {
                text.setText(  "Blue wins" );  //\u2780 
            } else {
                            text.setText(  "Red wins" );  
            }

            wait=true;
        }
        
        
        //text.setText(  parseFloat(timecnt-4).toFixed(3) );        
    }

}

}

function setbuttons(nplayer) {
    if (nplayer==0) {
      btnbludown.visible=false;
      btnbluleft.visible=false;
      btnbluright.visible=false;
      btnbluup.visible=false;
      btndown.visible=false;
      btnleft.visible=false;
      btnright.visible=false;
      btnup.visible=false;
    }  else if (nplayer==1) {
        var w=32;
   //     cpu1iscpu=true;
        
        // BUTTONS
        btnbluleft.visible=false;
        btnbluup.visible=false;
        btnbluright.visible=false;
        btnbludown.visible=false;
        btnright.fixedToCamera = false; 
        btnright.angle=90;
        btnright.x=105+32;
        btnright.y=600-100;
        btnright.fixedToCamera = true; 
        btnleft.fixedToCamera = false; 
        btnleft.angle=270;
        btnleft.x=5+32;
        btnleft.y=600-100;
        btnleft.fixedToCamera = true; 
        btnup.fixedToCamera = false; 
        btnup.angle=0;
        btnup.x=gwidth-100+32;
        btnup.y=600-200+32;
        btnup.fixedToCamera = true; 
        btndown.fixedToCamera = false; 
        btndown.angle=180;
        btndown.x=gwidth-100+32;
        btndown.y=600-100+32;
        btndown.fixedToCamera = true;         
    } else {
        var w=64;
       // cpu1iscpu=false;
        
        // BUTTONS
		btnbluleft.fixedToCamera = false; 
		btnbluleft.x=5+32;
		btnbluleft.y=600-100+32;
		btnbluleft.fixedToCamera = true; 
        btnbluleft.visible=true;
		btnbluup.fixedToCamera = false; 
		btnbluup.x=100+0.5*w-32;
		btnbluup.y=5+32;
		btnbluup.fixedToCamera = true; 
		btnbluup.visible=true;
		btnbluright.fixedToCamera = false; 
		btnbluright.x=100+5+32;
		btnbluright.y=600-100+32;
		btnbluright.fixedToCamera = true; 
        btnbluright.visible=true;
		btnbludown.fixedToCamera = false; 
		btnbludown.x=100+0.5*w-32;
		btnbludown.y=105+32;
		btnbludown.fixedToCamera = true; 
        btnbludown.visible=true;

        btnright.fixedToCamera = false; 
        btnright.angle=0;
        btnright.x=gwidth-100;   
        btnright.y=600-105-32;
        btnright.fixedToCamera = true; 
        btnleft.fixedToCamera = false; 
        btnleft.angle=180;
        btnleft.x=gwidth-100;  
        btnleft.y=600-5-32;
        btnleft.fixedToCamera = true; 
        btnup.fixedToCamera = false; 
        btnup.angle=270;
        btnup.x=gwidth-100-5-32; 
        btnup.y=100-32; 
        btnup.fixedToCamera = true; 
        btndown.fixedToCamera = false;
        btndown.angle=90;
        btndown.x=gwidth-5-32; 
        btndown.y=100-32;
        btndown.fixedToCamera = true; 

    }    
}

function startrace(nplayer) { // = BUTTON 3
    if (!game.device.desktop) setbuttons(nplayer) 
  //  else  setbuttons(0); 
    if (nplayer==1) {
        cpu1iscpu=true;
    } else {
        cpu1iscpu=false;
    }
    
        player.body.x=400+offset3;
        player.body.y=100;
        player.body.angle=90;
        playersplash=false;
        playerround=0;
        playrzone1=false; playrzone2=false; playrzone3=false;
        playertrckpos=0;
        cpu1.body.x=400+offset3;
        cpu1.body.y=60;
        cpu1.body.angle=90;
        cpu1splash=false;
        cpu1round=0;
        cpu1trckpos=0; 
        velocity = 0;
        cpu1velocity = 0;
        cpu1.body.angularVelocity = 0;
        player.body.angularVelocity = 0;
        //p1drift=true;
        //cpu1drift=true;
        //cpu1iscpu = false;
        cpu1ok = true;
        timecnt = -3-1;
        timecntstart=0;
        text.alpha=1;

        timecntstart = timeevt.timer.ms;
        updateCounter();
        
        game.time.events.remove(introtime);
        introtxt.setText("")
        
        if (engineini==false) iniengine();
    
}

function activeover(item) {
    if ((item.visible) && ((game.input.pointer1.active==true && p1.x<item.x+50 && item.x-50<p1.x && p1.y<item.y+50 && item.y-50<p1.y     )
        || (game.input.pointer2.active==true && p2.x<item.x+50 && item.x-50<p2.x && p2.y<item.y+50 && item.y-50<p2.y)
        || (game.input.pointer3.active==true && p3.x<item.x+50 && item.x-50<p3.x && p3.y<item.y+50 && item.y-50<p3.y)
        || (game.input.pointer4.active==true && p4.x<item.x+50 && item.x-50<p4.x && p4.y<item.y+50 && item.y-50<p4.y)
        || (game.input.pointer5.active==true && p5.x<item.x+50 && item.x-50<p5.x && p5.y<item.y+50 && item.y-50<p5.y)
        || (game.input.pointer6.active==true && p6.x<item.x+50 && item.x-50<p6.x && p6.y<item.y+50 && item.y-50<p6.y)
        || (game.input.mousePointer.active==true && item.input.pointerOver(game.input.mousePointer.id)))
    ) {
    return(true)
    } else {
        return(false);
    }
}

function closestwp(x,y) {
    // find closest waypoint
    var mdist=Infinity;
    var mdisti=0;
    var currdist;
    var k;
    for (k = 0; k < trackdata.shape.length-1; k=k+2) { //trackdata.shape.length-1
        currdist = Math.sqrt(Math.pow(trackdata.shape[k]+offset3-x,2)+Math.pow(trackdata.shape[k+1]-y,2));
        if (currdist<mdist) {
            mdist = currdist;
            mdisti = k;
        }
    }
    
    var newi;
    if(mdisti >= trackdata.shape.length-2) { 
        // wenn groesser war und nun 0, dann neue runde
        //if newi
        newi = 0;
    } else  newi = mdisti+2;
    
    // calculate distance/trackposition
    var newidist, trcklenpos;
    newidist = Math.sqrt(Math.pow(trackdata.shape[newi]+offset3-x, 2)+Math.pow(trackdata.shape[newi+1]-y, 2));
    if (0<newi) {
        trcklenpos = tracklencum[0.5*newi] - newidist
    } else {
        trcklenpos = tracklencum[tracklencum.length-1] - newidist
    }
    if (trcklenpos<0) {
        trcklenpos=tracklencum[tracklencum.length-1]+trcklenpos;
    }
    
    return([mdisti,mdist,newi,newidist,trcklenpos]);
}

function atzone(x,y,i,dist){
    if (Math.sqrt(Math.pow(trackdata.shape[i]+offset3-x, 2)+Math.pow(trackdata.shape[i+1]-y, 2))<dist) {
        return(true);
    } else {
        return(false);
    }
}

function update() {

//    player.body.velocity.x = 0;
 //   player.body.velocity.y = 0;
 //   player.body.angularVelocity = 0;
 
 playerleft=false;
 playerright=false;
 playerup=false;
 playerdown=false;
 cpuleft=false;
 cpuright=false;
 cpuup=false;
 cpudown=false;
 
    if (activeover(btnup)) {
        playerup=true;
    } else {
        playerup=false;
    } 
    if (activeover(btndown)) {
        playerdown=true;
    } else {
        playerdown=false;
    }
    if (activeover(btnleft)) {
        playerleft=true;
    } else {
        playerleft=false;
    }
    if (activeover(btnright)) {
        playerright=true;
    } else {
        playerright=false;
    }
    
    if (activeover(btnbluright)) {
        cpuup=true;
    } else {
        cpuup=false;
    } 
    if (activeover(btnbluleft)) {
        cpudown=true;
    } else {
        cpudown=false;
    }
    if (activeover(btnbluup)) {
        cpuleft=true;
    } else {
        cpuleft=false;
    }
    if (activeover(btnbludown)) {
        cpuright=true;
    } else {
        cpuright=false;
    }

    if (pad1.connected) {
        if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
        {
            playerleft=true; //playerright=false;
        } else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
        {
            playerright=true; //playerleft=false;
        } else {
            //playerright=false; //playerleft=false;
        }   
        if (pad1.isDown(Phaser.Gamepad.XBOX360_A) )
        {
            playerup=true;// playerdown=false;
        } else {
           // playerup=false;
        }
        if (pad1.isDown(Phaser.Gamepad.XBOX360_B) )
        {
            playerdown=true; playerup=false;
        }   else {
           // playerdown=false;
        }     
    }
   if (pad2.connected) {
        if (pad2.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad2.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER) || pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
        {
            cpuleft=true; //cpuright=false;
        } else if (pad2.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad2.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER) || pad2.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
        {
            cpuright=true; //cpuleft=false;
        } else {
            //cpuright=false; //cpuleft=false;
        }   
        if (pad2.isDown(Phaser.Gamepad.XBOX360_A) )
        {
            cpuup=true;// cpudown=false;
        } else {
           // cpuup=false;
        }
        if (pad2.isDown(Phaser.Gamepad.XBOX360_B) )
        {
            cpudown=true; cpuup=false;
        }   else {
           // cpudown=false;
        }     
    }

    
    if (cursors.left.isDown || playerleft) {
        player.body.angularVelocity = -10*(velocity/1000);  // player.body.rotateLeft(100);
    }
    else if (cursors.right.isDown || playerright)
    {
      player.body.angularVelocity = 10*(velocity/1000);  //  player.body.rotateRight(100);
    }
    else
    {
      player.body.angularVelocity = 0;
    }
    
    if (cursors.up.isDown || playerup) {
        if (velocity <= 400)
            velocity+=7;  //  player.body.thrust(400);
        if (engineini==false) iniengine();
    }  
    else if (cursors.down.isDown || playerdown) {
        if (-200 <= velocity)
            velocity -= 7;       // player.body.reverse(400);
        if (engineini==false) iniengine();
    } else {
            if (velocity >= 7)
                velocity -= 7;
    }

    
    if (game.input.keyboard.isDown(Phaser.Keyboard.ONE)){
        cpu1iscpu=false;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.TWO)){
        cpu1iscpu=true;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.NINE)){
        devmode=(!devmode);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.THREE)){
        player.body.x=400+offset3;
        player.body.y=100;
        player.body.angle=90;
        playersplash=false;
        playerround=0; playrzone1=false; playrzone2=false; playrzone3=false;
        playertrckpos=0;
        cpu1.body.x=400+offset3;
        cpu1.body.y=60;
        cpu1.body.angle=90;
        cpu1splash=false;
        cpu1round=0;
        cpu1trckpos=0; 
        velocity = 0;
        cpu1velocity = 0;
        cpu1.body.angularVelocity = 0;
        player.body.angularVelocity = 0;
        //p1drift=true;
        //cpu1drift=true;
        //cpu1iscpu = false;
        cpu1ok = true;
        timecnt = -3-1;
        timecntstart=0;
        text.alpha=1;

        timecntstart = timeevt.timer.ms
        updateCounter();
        
        game.time.events.remove(introtime);
        introtxt.setText("")
        
        if (engineini==false) iniengine();
    }
    
    if (!cpu1iscpu){
    if (game.input.keyboard.isDown(Phaser.Keyboard.D) || cpuright){
        cpu1.body.angularVelocity = 10*(cpu1velocity/1000);
        //if (cpu1.body.angularVelocity<5)
        //    cpu1.body.angularVelocity += 2*(cpu1velocity/1000);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.A) || cpuleft){
        cpu1.body.angularVelocity = -10*(cpu1velocity/1000);
        //if (cpu1.body.angularVelocity>-5)
          //  cpu1.body.angularVelocity -= 2*(cpu1velocity/1000);
    } else
        cpu1.body.angularVelocity = 0;
        
    if (game.input.keyboard.isDown(Phaser.Keyboard.S) || cpudown){
        if (-200 <= cpu1velocity)
            cpu1velocity -= 4;//7;
        //cpu1velocity-=4;
        if (engineini==false) iniengine();
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.W) || cpuup){
        if (cpu1velocity <= 400)
            cpu1velocity+=4;//7; 
        //cpu1velocity+=4;
        if (engineini==false) iniengine();
    } else {
            if (cpu1velocity >= 4)//7)
                cpu1velocity -= 4;//7;
                
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.H)){
        if(!honking) {
            honk.loopFull(1.0);    
            honking=true;
        }
        //honk.onLoop.add(hasLooped, this);
    } else {
        if(honking) {
            honk.stop();
            honking=false;        
        }
    }
        if (game.input.keyboard.isDown(Phaser.Keyboard.I)){
        if(honking) {
          //  honk.play();
            honk._sound.playbackRate.value += 0.02;
        }
        //honk.onLoop.add(hasLooped, this);
    } 

    }

    // find closest waypoint, ca 770 m strecke
    // var mdist=Infinity;
    // var mdisti=0;
    // var currdist;
    // var k;
    // for (k = 0; k < trackdata.shape.length-1; k=k+2) { //trackdata.shape.length-1
    //     currdist = Math.sqrt(Math.pow(trackdata.shape[k]+offset3-cpu1.centerX,2)+Math.pow(trackdata.shape[k+1]-cpu1.centerY,2));
    //     if (currdist<mdist) {
    //         mdist = currdist;
    //         mdisti = k;
    //     }
    // }
    // cpu1trckpos = mdisti/(trackdata.shape.length);  
    var newi;
    // if(mdisti >= trackdata.shape.length-2) { 
    //     // wenn groesser war und nun 0, dann neue runde
    //     //if newi
    //     newi = 0;
    // } else  newi = mdisti+2;
    
    cpu1mdistarr = closestwp(cpu1.centerX,cpu1.centerY);
    newi=cpu1mdistarr[2];
    
     cpu1tg.setTo(cpu1.centerX,cpu1.centerY,trackdata.shape[newi]+offset3,trackdata.shape[newi+1]);
    
    // // calculate distance/trackposition
    // var cpunewidist;
    // cpunewidist = Math.sqrt(Math.pow(trackdata.shape[newi]+offset3-cpu1.centerX, 2)+Math.pow(trackdata.shape[newi+1]-cpu1.centerY, 2))
    // if (0<newi) {
    //     cpu1trcklenpos = tracklencum[0.5*newi] - cpunewidist
    // } else {
    //     cpu1trcklenpos = tracklencum[tracklencum.length-1] - cpunewidist
    // }
    
    // the same for player
    playrmdist = closestwp(player.centerX,player.centerY); // returns [mdisti,mdist,newi,newidist,trcklenpos]
    if (!playrzone1) playrzone1 = atzone(player.centerX,player.centerY,3*2,100);
    if (!playrzone2) playrzone2 = atzone(player.centerX,player.centerY,13*2,100);
    if (!playrzone3) playrzone3 = atzone(player.centerX,player.centerY,15*2,100);
    
    
    //autopilot fuer cpu1
    if (cpu1iscpu && wait==false) {
        if (cpu1ok) {
            if (cpu1velocity <= 400)
            cpu1velocity = cpu1velocity+4;//7; 
        } else {
            if (cpu1velocity >= -200)
              cpu1velocity-=4;//7; 
        }
        // we need two angles
        var diffangle = Phaser.Math.normalizeAngle(Phaser.Math.degToRad(cpu1.angle) - 1.5758 - cpu1tg.angle);
        if (diffangle >= Math.PI/2-0.5 && diffangle <= 3*Math.PI/2+0.5 ) {
            cpu1ok=false;
            if (diffangle >= Math.PI)
                cpu1.body.angularVelocity = -10*(cpu1velocity/1000)*(2*(cpu1velocity<0)-1); //+= 2*(cpu1velocity/1000);            //cpu1velocity -= 4;
            else
                cpu1.body.angularVelocity = 10*(cpu1velocity/1000)*(2*(cpu1velocity<0)-1); //+= 2*(cpu1velocity/1000);
        } else if (diffangle >  + 0.3 && diffangle < Math.PI) {
            cpu1.body.angularVelocity = +10*(cpu1velocity/1000)*(2*(cpu1velocity<0)-1); cpu1ok=true;//+= 2*(cpu1velocity/1000);
        } else if (diffangle < 2*Math.PI - 0.3 && diffangle > Math.PI ) {
            cpu1.body.angularVelocity = -10*(cpu1velocity/1000)*(2*(cpu1velocity<0)-1); cpu1ok=true;// -= 2*(cpu1velocity/1000);
        } else {
            cpu1.body.angularVelocity = 0;  cpu1ok=true; //timer für wechsel nötig
            
            //  Kollisionen Zählen (Kollission = 10 BADPOINTS), Zeitlicher Verfall der BADPOINTS, wenn BADPOINTS > THRESH dann cpuok=false!
        }
        // if (diffangle > 2*1.5758 && diffangle < 3*1.5758 ) {
        //     cpu1ok=false;
        //     //cpu1velocity -= 4;
        //     cpu1.body.angularVelocity = -10*(cpu1velocity/1000); //+= 2*(cpu1velocity/1000);
        // }else if (diffangle >  + 0.3 && diffangle < 2*1.5758 ) {
        //     cpu1.body.angularVelocity = -10*(cpu1velocity/1000); cpu1ok=true;//+= 2*(cpu1velocity/1000);
        // } else if (diffangle < 4*1.5758 - 0.3 && diffangle > 2*1.5758 ) {
        //     cpu1.body.angularVelocity = 10*(cpu1velocity/1000); cpu1ok=true;// -= 2*(cpu1velocity/1000);
        // } else {
        //     cpu1.body.angularVelocity = 0;  cpu1ok=true; //timer für wechsel nötig
        // }        
    }
    if (!devmode) {
        cpu1tg.setTo(0,0,0,0);
    }
    
    if (playersplash) {
        if (player.alpha<=0) {
            player.body.x = 400+offset3;
            player.body.y=300;
            player.alpha=1;
            playersplash = false;
        } else
        player.alpha-=0.01;    
        velocity=velocity*0.85;        
        player.body.angularVelocity=0;
    }
    if (cpu1splash) {
        if (cpu1.alpha<=0) {
            cpu1.body.x = 400+offset3;
            cpu1.body.y=300;
            cpu1.alpha=1;
            cpu1splash = false;
            cpu1ok = true;
          
        }  else       
        cpu1.alpha-=0.01;
        cpu1velocity=cpu1velocity*0.85;
        cpu1.body.angularVelocity=0;
    }
    
    pitch.value = 1.1 + (velocity/400)*(2.2-1.1);
    
    // no drift or drift  vgl https://codepen.io/Samid737/pen/dWBjwB  https://www.codeseek.co/Samid737/phaser-car-top-down-model-p2-dWBjwB
    player.body.velocity.x = velocity * Math.cos((player.angle-90-p1drift*player.body.angularVelocity/4)*0.01745);
    player.body.velocity.y = velocity * Math.sin((player.angle-90-p1drift*player.body.angularVelocity/4)*0.01745);
    
    //cpu1.body.velocity.x=Math.sin(cpu1.body.rotation-cpu1.body.angularVelocity/4)*cpu1velocity;
    //cpu1.body.velocity.y=-Math.cos(cpu1.body.rotation-cpu1.body.angularVelocity/4)*cpu1velocity;  
    cpu1.body.velocity.x = cpu1velocity * Math.cos((cpu1.angle-90-cpu1drift*cpu1.body.angularVelocity/4)*0.01745);
    cpu1.body.velocity.y = cpu1velocity * Math.sin((cpu1.angle-90-cpu1drift*cpu1.body.angularVelocity/4)*0.01745);

}

function render() {
    if (devmode) {
        game.debug.text(playrzone1,32,32); //"A-D steering, W-S throttle"
        game.debug.text("cpu1.angle "+(Phaser.Math.degToRad(cpu1.angle)-1.5758),32,64);
        
        game.debug.text("cpu1tg.angle "+cpu1tg.angle ,32,96);
      
          game.debug.text("diffangle "+(Phaser.Math.normalizeAngle(Phaser.Math.degToRad(cpu1.angle) - 1.5758 - cpu1tg.angle)),32,128);
          game.debug.text("Player "+playerround+", "+Math.round(playrmdist[4])+"/"+Math.round(tracklencum[tracklencum.length-1]),32,160);
          
          playrmdist
          // cpu1trckpos
          game.debug.text("CPU "+cpu1round+"-"+"("+Math.round(cpu1mdistarr[4])+"/"+Math.round(tracklencum[tracklencum.length-1])+")",32,192); //game.debug.text("CPU "+(cpu1round+cpu1trckpos),32,192);
          game.debug.text("cpu1ok "+cpu1ok,32,224);
      //  game.debug.text("cpu1.body.rotation "+cpu1.body.rotation,32,96);
    //    game.debug.text("trackdata "+trackdata.shape,32,128);
        
        game.debug.geom(cpu1tg);
        
        
        game.debug.pointer(game.input.mousePointer);
        game.debug.pointer(game.input.pointer1);
        game.debug.pointer(game.input.pointer2);
        game.debug.pointer(game.input.pointer3);
        game.debug.pointer(game.input.pointer4);
        game.debug.pointer(game.input.pointer5);
        game.debug.pointer(game.input.pointer6);                
    }



  //  game.debug.spriteInfo(player, 32, 32);
//    game.debug.text('angularVelocity: ' + player.body.angularVelocity, 32, 200);
 //   game.debug.text('angularAcceleration: ' + player.body.angularAcceleration, 32, 232);
  //  game.debug.text('angularDrag: ' + player.body.angularDrag, 32, 264);
//    game.debug.text('deltaZ: ' + player.body.deltaZ(), 32, 296);

}
