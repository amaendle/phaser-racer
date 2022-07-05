/* global Phaser */
var gwidth = 1072; //800
var game = new Phaser.Game(1072, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render  });
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
    
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;//.RESIZE; //.EXACT_FIT;
    
}

var devmode=false;
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
var cpu1iscpu = false;
var cpu1ok = true;
var timecnt = 0; var timecntstart = 0;
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

// engine
var engineini = false;
var intervalId;
     var pitch = {step: 0, min: 1.1, max: 2.2,  value: 1.1};
var honk, engine;
var honking=false;

var btnup, btndown, btnleft, btnright;

function create() {
  var gofull = function() { game.scale.startFullScreen(false);}
  if (!game.device.desktop){ game.input.onDown.add(gofull, this); } //go fullscreen on mobile devices 
  game.scale.startFullScreen(false);
  
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
    map = game.add.sprite(0.5*gwidth+132, 300, 'isle');//map = game.add.sprite(0,0, 'isle');
   // map.anchor.setTo(0.5, 0.5);
 //   map.position.setTo(668,300);
    finish = game.add.sprite(0+132,0);//nicht (400, 300);
    ground = game.add.sprite(15+132,15);//nicht (400, 300);

    player = game.add.sprite(400, 100, 'cpu0');
    cpu1 = game.add.sprite(400, 60, 'cpu1');
  //  player.anchor.setTo(0.5, 0.5);

     game.physics.p2.enable([player,cpu1]);  // game.physics.p2.enable(player,false);
     player.body.angle = 90; cpu1.body.angle = 90;
     player.body.mass=50; cpu1.body.mass=50;//?
     
    var carCollisionGroup = game.physics.p2.createCollisionGroup();
    var buildingCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();

    var palme2 = game.add.sprite(600+132,230,'palme2');
    var palme3 = game.add.sprite(210+132,360,'palme3');
    var palme1 = game.add.sprite(590+132,310,'palme1');
    
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

    map.body.offset.x=-132;

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
            tmpsprite = game.add.sprite(trackdata.shape[j]+132, trackdata.shape[j+1]);
            game.physics.p2.enable([tmpsprite]);
            tmpsprite.body.setRectangle(30,30);
            tmpsprite.body.debug=true;
            //tmpsprite.body.mass=1000;
        }
              
    }
    
    // create car rectangle
    playercntr = game.add.sprite(player.centerX+132, player.centerY);
    game.physics.p2.enable([playercntr]);
    playercntrshape = playercntr.body.setRectangle(30,30);
    playercntrshape.sensor=true; 
    if (devmode) playercntr.body.debug=true;

    //  Lock the two bodies together. The [0, 50] sets the distance apart (y: 80)
    var constraint = game.physics.p2.createLockConstraint(player, playercntr, [0, 1], 0);
    
    // create cpu1 rectangle
    cpu1cntr = game.add.sprite(player.centerX+132, player.centerY);
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
            cpu1round=0;    
            playerlaps.alpha=1;
            cpu1laps.alpha=1;
        } else {
            if(shapeB===cpu1cntrshape) cpu1round +=   1
            if(shapeB===playercntrshape) playerround +=   1            
        }

        // if (playerround >=0 && cpu1round>=0) {
        //     playerlaps.alpha=1;
        //     cpu1laps.alpha=1;
        // } else {
        //     playerround=0;
        //     cpu1round=0;
        // }
        playerlaps.setText(playerround);
        cpu1laps.setText(cpu1round);
       }
    finish.body.onBeginContact.add(newlap, this);
    
    text = game.add.text(game.world.centerX, game.world.centerY-80, 'LOREM IPSUM', { align: "center" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
    text.alpha=0.0;//
    text.anchor.setTo(0.5, 0.5);
    
    cpu1laps = game.add.text(game.world.centerX-80, game.world.centerY-80, '0', { fill: "#0000ff", aalign: "center" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
    cpu1laps.alpha=1.0;//
    cpu1laps.anchor.setTo(0.5, 0.5);
    playerlaps = game.add.text(game.world.centerX+80, game.world.centerY-80, '0', { fill: "#ff0000", aalign: "center" });//{ font: "64px Verdana", fill: "#ffffff", align: "center" });
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

        var gfxdown = game.make.graphics(0, 0);
        gfxdown.lineStyle(3, 0xffffff, 1);
        gfxdown.visible = false;
        // draw frame 0
        gfxdown.moveTo(0.5*w, 3);
        gfxdown.lineTo(3, 3);
        gfxdown.lineTo(0.5*w, w-3);
        gfxdown.lineTo(w-3, 3);
        gfxdown.currentPath.shape.closed = true;
        // draw frame 1        
        gfxdown.beginFill(0xFF3300);
        gfxdown.moveTo(w+0.5*w, 3);
        gfxdown.lineTo(w+3, 3);
        gfxdown.lineTo(w+0.5*w, w-3);
        gfxdown.lineTo(w+w-3, 3);
        gfxdown.currentPath.shape.closed = true;
        // creating a sprite sheet with generateTexture
        game.cache.addSpriteSheet('downbtn', null, gfxdown.generateTexture().baseTexture.source, w, w, 2, 0, 0);
        
        var gfxleft = game.make.graphics(0, 0);
        gfxleft.lineStyle(3, 0xffffff, 1);
        gfxleft.visible = false;
        // draw frame 0
        gfxleft.moveTo(w-3, 0.5*w);
        gfxleft.lineTo(w-3, 3);
        gfxleft.lineTo(3, 0.5*w);
        gfxleft.lineTo(w-3, w-3);
        gfxleft.currentPath.shape.closed = true;
        // draw frame 1        
        gfxleft.beginFill(0xFF3300);
        gfxleft.moveTo(w+w-3,0.5*w);
        gfxleft.lineTo(w+w-3, 3);
        gfxleft.lineTo(w+3, 0.5*w);
        gfxleft.lineTo(w+w-3, w-3);
        gfxleft.currentPath.shape.closed = true;
        // creating a sprite sheet with generateTexture
        game.cache.addSpriteSheet('leftbtn', null, gfxleft.generateTexture().baseTexture.source, w, w, 2, 0, 0);

        var gfxright = game.make.graphics(0, 0);
        gfxright.lineStyle(3, 0xffffff, 1);
        gfxright.visible = false;
        // draw frame 0
        gfxright.moveTo(3, 0.5*w);
        gfxright.lineTo(3, 3);
        gfxright.lineTo(w-3, 0.5*w);
        gfxright.lineTo(3, w-3);
        gfxright.currentPath.shape.closed = true;
        // draw frame 1        
        gfxright.beginFill(0xFF3300);
        gfxright.moveTo(w+3,0.5*w);
        gfxright.lineTo(w+3, 3);
        gfxright.lineTo(w+w-3, 0.5*w);
        gfxright.lineTo(w+3, w-3);
        gfxright.currentPath.shape.closed = true;
        // creating a sprite sheet with generateTexture
        game.cache.addSpriteSheet('rightbtn', null, gfxright.generateTexture().baseTexture.source, w, w, 2, 0, 0);

        
    // create game controller buttons 
    btnup = game.add.button(gwidth-100, 600-200, 'upbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnup.fixedToCamera = true;  //our buttons should stay on the same place  
    btnup.inputEnabled = true;
    btnup.events.onInputOver.add(function(){playerup=true;playerdown=false;});
    btnup.events.onInputOut.add(function(){playerup=false;});
    btnup.events.onInputDown.add(function(){playerup=true;playerdown=false;});
    btnup.events.onInputUp.add(function(){playerup=false;});
    btndown = game.add.button(gwidth-100, 600-100, 'downbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btndown.fixedToCamera = true;  //our buttons should stay on the same place  
    btndown.inputEnabled = true;
    btndown.events.onInputOver.add(function(){playerdown=true;playerup=false;});
    btndown.events.onInputOut.add(function(){playerdown=false;});
    btndown.events.onInputDown.add(function(){playerdown=true;playerup=false;});
    btndown.events.onInputUp.add(function(){playerdown=false;});
    btnleft = game.add.button(5, 600-100-0.5*w, 'leftbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnleft.fixedToCamera = true;  //our buttons should stay on the same place  
//    btnleft.inputEnabled = true;
    btnleft.events.onInputOver.add(function(){playerleft=true;playerright=false});
    btnleft.events.onInputOut.add(function(){playerleft=false;});
    btnleft.events.onInputDown.add(function(){playerleft=true;playerright=false});
    btnleft.events.onInputUp.add(function(){playerleft=false;});
      btnright = game.add.button(105, 600-100-0.5*w, 'rightbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnright.fixedToCamera = true;  //our buttons should stay on the same place  
    btnright.inputEnabled = true;
    btnright.events.onInputOver.add(function(){playerright=true;playerleft=false;});
    btnright.events.onInputOut.add(function(){playerright=false;});
    btnright.events.onInputDown.add(function(){playerright=true;playerleft=false;});
    btnright.events.onInputUp.add(function(){playerright=false;});
        
}

function updateCounter() {
    
    timecnt = (timeevt.timer.ms - timecntstart)/1000;

    if (timecnt<3) {
        text.setText((Phaser.Math.floorTo(timecnt)-3)+"...");
        wait=true;
    }
    else if (timecnt<4) {
        text.setText("GO!");
        wait=false;
    }
    else
        text.setText(  parseFloat(timecnt-4).toFixed(3) );

}

function update() {

//    player.body.velocity.x = 0;
 //   player.body.velocity.y = 0;
 //   player.body.angularVelocity = 0;
 
//   if (btnup.input.pointerOver())
//     {
//         playerup=true;
//     }
//     else
//     {
//         playerup=false;
//     }
//   if (btndown.input.pointerOver())
//     {
//         playerdown=true;
//     }
//     else
//     {
//         playerdown=false;
//     }
//     if (btnleft.input.pointerOver())
//     {
//         playerleft=true;
//     }
//     else
//     {
//         playerleft=false;
//     }
//       if (btnright.input.pointerOver())
//     {
//         playerright=true;
//     }
//     else
//     {
//         playerright=false;
//     }
    
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
        player.body.x=400;
        player.body.y=100;
        player.body.angle=90;
        playersplash=false;
        playerround=0;
        playertrckpos=0;
        cpu1.body.x=400;
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
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)){
        cpu1.body.angularVelocity = 10*(cpu1velocity/1000);
        //if (cpu1.body.angularVelocity<5)
        //    cpu1.body.angularVelocity += 2*(cpu1velocity/1000);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.A)){
        cpu1.body.angularVelocity = -10*(cpu1velocity/1000);
        //if (cpu1.body.angularVelocity>-5)
          //  cpu1.body.angularVelocity -= 2*(cpu1velocity/1000);
    } else
        cpu1.body.angularVelocity = 0;
        
    if (game.input.keyboard.isDown(Phaser.Keyboard.S)){
        if (-200 <= cpu1velocity)
            cpu1velocity -= 4;//7;
        //cpu1velocity-=4;
        if (engineini==false) iniengine();
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.W)){
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

    // find closest waypoint
    var mdist=Infinity;
    var mdisti=0;
    var currdist;
    var k;
    for (k = 0; k < trackdata.shape.length-1; k=k+2) { //trackdata.shape.length-1
        currdist = Math.sqrt(Math.pow(trackdata.shape[k]-cpu1.centerX,2)+Math.pow(trackdata.shape[k+1]-cpu1.centerY,2));
        if (currdist<mdist) {
            mdist = currdist;
            mdisti = k;
        }
    }
    cpu1trckpos = mdisti/(trackdata.shape.length);  
    var newi;
    if(mdisti >= trackdata.shape.length-2) { 
        // wenn groesser war und nun 0, dann neue runde
        //if newi
        newi = 0;
    } else  newi = mdisti+2;
    cpu1tg.setTo(cpu1.centerX,cpu1.centerY,trackdata.shape[newi],trackdata.shape[newi+1]);
    
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
            player.body.x = 400;
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
            cpu1.body.x = 400;
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
        game.debug.text("A-D steering, W-S throttle",32,32);
        game.debug.text("cpu1.angle "+(Phaser.Math.degToRad(cpu1.angle)-1.5758),32,64);
        
        game.debug.text("cpu1tg.angle "+cpu1tg.angle ,32,96);
      
          game.debug.text("diffangle "+(Phaser.Math.normalizeAngle(Phaser.Math.degToRad(cpu1.angle) - 1.5758 - cpu1tg.angle)),32,128);
          game.debug.text("Player "+playerround+", "+playertrckpos,32,160);
          game.debug.text("CPU "+cpu1round+"-"+cpu1trckpos,32,192); //game.debug.text("CPU "+(cpu1round+cpu1trckpos),32,192);
          game.debug.text("cpu1ok "+cpu1ok,32,224);
      //  game.debug.text("cpu1.body.rotation "+cpu1.body.rotation,32,96);
    //    game.debug.text("trackdata "+trackdata.shape,32,128);
        
        game.debug.geom(cpu1tg);
                
    }


  //  game.debug.spriteInfo(player, 32, 32);
//    game.debug.text('angularVelocity: ' + player.body.angularVelocity, 32, 200);
 //   game.debug.text('angularAcceleration: ' + player.body.angularAcceleration, 32, 232);
  //  game.debug.text('angularDrag: ' + player.body.angularDrag, 32, 264);
//    game.debug.text('deltaZ: ' + player.body.deltaZ(), 32, 296);

}
