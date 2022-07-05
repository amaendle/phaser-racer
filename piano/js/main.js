var game = new Phaser.Game("100%","99%", Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update, render: render })
//var game = new Phaser.Game(1350, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update, render: render })

//shift octaves left / right
var lower_offset = 24, upper_offset = 36, click_flag = false
// piano bg co-ordinates
var pX = 50, pY = 150;//250
var keys_down = {}
var notes1_playing = false 
var notes2_playing = false
var notes3_playing = false
var notes4_playing = false
//key map
var lower_octave = [65, 90, 83, 88, 67, 70, 86, 71, 66, 78, 74, 77, 75, 188, 76, 190, 191, 222]
var upper_octave = [49, 81, 50, 87, 69, 52, 82, 53, 84, 89, 55, 85, 56, 73, 57, 79, 80, 189, 219, 187, 221]
//note markers
var cursor_low =  [1, 3, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20, 21, 23, 25, 27, 28, 30, 32, 33, 35, 37, 39, 40, 42, 44, 45, 47, 49, 51, 52, 54, 56, 57, 59, 61 , 63, 64, 66, 68, 69, 71, 73, 75, 76, 78, 80, 81, 83, 85, 87, 88]
var cursor_low_left =  [1, 4, 9, 16, 21, 28, 33, 40, 45, 52, 57, 64, 69, 76, 81]
var cursor_low_whole =  [88]
var cursor_low_right =  [3, 8, 15, 20, 27, 32, 39, 44, 51, 56, 63, 68, 75, 80, 87]
var cursor_low_middle =  [6, 11, 13, 18, 23, 25, 30, 35, 37, 42, 47, 49, 54, 59, 61, 66, 71, 73, 78, 83, 85]
var cursor_high = {2: 16, 5: 64, 7: 88, 10: 136, 12: 160, 14: 184, 17: 232, 19: 256, 22: 304, 24: 328,  26: 352, 29: 400, 31: 424, 34: 472,  36: 496,  38: 520, 41: 568,  43: 592, 46: 640,  48: 664,  50: 688, 53: 736,  55: 760, 58: 808,  60: 832,  62: 856, 65: 904,  67: 928, 70: 976,  72: 1000,  74:1024, 77: 1072, 79: 1096, 82: 1144, 84: 1168, 86: 1192 } 
var topBox ;
var kbwidth = 3*1248;
var kbheight =210*2;
var ptactive=[];
var ptnote=[];
ptactive[1]=false; //mouse pointer
ptactive[2]=false; //mouse pointer
ptactive[3]=false; //touch pointer
ptactive[4]=false; //touch pointer
ptactive[5]=false; //touch pointer
ptnote[1]=-1; //mouse pointer
ptnote[2]=-1; //touch pointer
ptnote[3]=-1;
ptnote[4]=-1;
ptnote[5]=-1;

function preload() {
  //  game.load.image('keys', 'assets/img/p.png')
    //game.load.image('body', 'assets/img/bg.png')
    game.load.audio('notes', ['assets/aud/keys.mp3'] ) 
    game.load.audio('notesb', ['assets/aud/keys.mp3'] ) 
    game.load.audio('notes3', ['assets/aud/keys.mp3'] ) 
    game.load.audio('notes4', ['assets/aud/keys.mp3','assets/aud/keys.ogg'] ) 
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.stage.backgroundColor = '#707070'
 //   game.add.sprite(pX-12, pY-100, 'body')
 //   game.add.sprite(pX, pY, 'keys')
    notes = game.add.audio('notes')
    notes.allowMultiple = false
    notesb = game.add.audio('notes')
    notesb.allowMultiple = false
    notes3 = game.add.audio('notes')
    notes3.allowMultiple = true
    notes4 = game.add.audio('notes')
    notes4.allowMultiple = true
    secs = 0.0
    duration = 1.5
    for (i=1; i<=88; i++, secs++) notes.addMarker(i, secs++, duration)
        secs = 0.0
    duration = 1.5
    for (i=1; i<=88; i++, secs++) notesb.addMarker(i, secs++, duration)
        secs = 0.0
    duration = 1.5
    for (i=1; i<=88; i++, secs++) notes3.addMarker(i, secs++, duration)
        secs = 0.0
    duration = 1.5
    for (i=1; i<=88; i++, secs++) notes4.addMarker(i, secs++, duration)
    
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    game.input.addPointer();
    
    game.input.onDown.add(activeover, this);

    game.input.keyboard.onDownCallback = function() {
        pressed = game.input.keyboard.event.keyCode
        if (!(pressed in keys_down)){ 
            keys_down[pressed] = true
            if (pressed == 37){
                //left arrow
                if(lower_offset-12 >= 0){
                    lower_offset -= 12
                    upper_offset -= 12
                }
            }   
            if (pressed == 39){
                //right arrow
                if(lower_offset+12 <= 60){
                    lower_offset += 12
                    upper_offset += 12
                }                
            }

            audio_tag = -1
            if (upper_octave.indexOf(pressed) != -1)
                audio_tag = upper_octave.indexOf(pressed) + upper_offset
            else if (lower_octave.indexOf(pressed)!= -1)
                audio_tag = lower_octave.indexOf(pressed) + lower_offset
            play_note(audio_tag)                 
    }}

     game.input.keyboard.onUpCallback = function() {
            pressed = game.input.keyboard.event.keyCode
                        audio_tag = -1
            if (upper_octave.indexOf(pressed) != -1)
                audio_tag = upper_octave.indexOf(pressed) + upper_offset
            else if (lower_octave.indexOf(pressed)!= -1)
                audio_tag = lower_octave.indexOf(pressed) + lower_offset
            stop_note(audio_tag)   
            delete keys_down[game.input.keyboard.event.keyCode]
     }   
     // dragbox
     drawDBox();
     //create keys
    for (var i = 1; i <= 88; i++) {
      drawKey(i);
    }
}

function drawKey(audio_tag, pressed){
    if (pressed==null) pressed=false;
    //kbwidth = 1248;//1350;
    //kbheight =210;//696;
    blackkheight = kbheight*(116/210);
    whitekheight = kbheight;
    var addX = pX-1 - 38;
    var addY = 0-151;
    if(audio_tag in cursor_high){
        addX += cursor_low.indexOf(audio_tag-1)*(kbwidth/52)+(2/3)*(kbwidth/52)+2;//cursor_high[audio_tag]+2;
        addY += 437+18-205; //addY += 345+18;
        kheight = kbheight*(116/210);//345+18-addY;
        kwidth = (2/3)*kbwidth/52;
        poly = new Phaser.Polygon(addX, addY, addX+kwidth, addY, addX+kwidth, addY+kheight, addX, addY+kheight);
    }
    else if(cursor_low_left.indexOf(audio_tag) != -1){
        addX += cursor_low.indexOf(audio_tag)*(kbwidth/52)+2;
        addY += 437+18-205; //addY += 437+18;
        kheight = kbheight*1;//437+18-addY;
        kwidth = kbwidth/52;
        poly = new Phaser.Polygon(addX+0*kwidth, addY, addX+(2/3)*kwidth, addY, addX+(2/3)*kwidth, addY+blackkheight, addX+kwidth, addY+blackkheight, addX+kwidth, addY+kheight, addX, addY+kheight);
    }
    else if(cursor_low_right.indexOf(audio_tag) != -1){
        addX += cursor_low.indexOf(audio_tag)*(kbwidth/52)+2;
        addY += 437+18-205; //addY += 437+18;
        kheight = kbheight*1;//437+18-addY;
        kwidth = kbwidth/52;
        poly = new Phaser.Polygon(addX+(1/3)*kwidth, addY, addX+1*kwidth, addY, addX+kwidth, addY+kheight, addX, addY+kheight, addX, addY+blackkheight, addX+(1/3)*kwidth, addY+blackkheight);
    }
    else if(cursor_low_middle.indexOf(audio_tag) != -1){
        addX += cursor_low.indexOf(audio_tag)*(kbwidth/52)+2;
        addY += 437+18-205; //addY += 437+18;
        kheight = kbheight*1;//437+18-addY;
        kwidth = kbwidth/52;
        poly = new Phaser.Polygon(addX+(1/3)*kwidth, addY, addX+(2/3)*kwidth, addY, addX+(2/3)*kwidth, addY+blackkheight, addX+kwidth, addY+blackkheight, addX+kwidth, addY+kheight, addX, addY+kheight, addX, addY+blackkheight, addX+(1/3)*kwidth, addY+blackkheight);
    }
    else {
        addX += cursor_low.indexOf(audio_tag)*(kbwidth/52)+2;
        addY += 437+18-205; //addY += 437+18;
        kheight = kbheight*1;//437+18-addY;
        kwidth = kbwidth/52;
        poly = new Phaser.Polygon(addX+0*kwidth, addY, addX+1*kwidth, addY, addX+kwidth, addY+kheight, addX, addY+kheight);
    }
    
    var graphics = game.add.graphics(0, 0);
    if(audio_tag in cursor_high){
        if (pressed==true) {
            graphics.beginFill(0xFFff33);
        } else graphics.beginFill(0x000000);
    } else {
        if (pressed==true) {
            graphics.beginFill(0xFF33ff);
        } else graphics.beginFill(0xffffff);
    }
    graphics.lineStyle(2, 0x0000FF, 1);
   // graphics.lineWidth(1);
    graphics.drawPolygon(poly.points);
    graphics.endFill();
   topBox.addChild(graphics);
    if (pressed==true) setTimeout(function (){graphics.destroy()}, 1000)
     
}

function activeover(ptr) {
    
    var mX = ptr.x;
    var mY = ptr.y;
    var audio_tag = get_audio_tag(mX, mY);
    ptactive[ptr.id]=true; //touch pointer
    ptnote[ptr.id]=audio_tag; //mouse pointer
    play_note(audio_tag);
    
    if(ptr.y<50) {
        if(ptr.x<50) {
            game.scale.startFullScreen(false);      
        } else {
        kbwidth=1248*5*(ptr.x/game.scale.width)
        }
        game.world.removeAll();
             drawDBox();
     //create keys
    for (var i = 1; i <= 88; i++) {
      drawKey(i);
    }
    }
}

function update() {
    for(var ptri in game.input.pointers){//alert(ptri.id)//for(var pid=1; i<=ptactive.length;i++){
        if (ptactive[game.input.pointers[ptri].id]==true && game.input.pointers[ptri].active==false) {
            stop_note(ptnote[game.input.pointers[ptri].id])
            ptactive[game.input.pointers[ptri].id]=false;
        }
    }
        if (ptactive[0]==true && this.game.input.mousePointer.isDown==false) {
            stop_note(ptnote[0]);
            ptactive[0]=false;
        }
        
   // if(game.input.mousePointer.y<50) {
   //     game.world.removeAll();
   //     kbwidth=1248*5*(game.input.mousePointer.x/game.scale.width)
   //          drawDBox();
     //create keys
   // for (var i = 1; i <= 88; i++) {
   //   drawKey(i);
   // }
  //  }
    
//   if(this.game.input.mousePointer.isDown && click_flag) clicked()

//    if (this.game.input.mousePointer.isUp) click_flag =  true
    
//   if(this.game.input.activePointer.isDown && click_flag) clicked()

//     if (this.game.input.activePointer.isUp) click_flag =  true
}

function play_note(audio_tag){
    if (audio_tag != -1 && 1 <= audio_tag && 88 >= audio_tag){
            if (!notes.isPlaying) {
                notes.play(audio_tag)
                notes1_playing = audio_tag
              //  return("notes1")
            } else if (!notesb.isPlaying) {
                notesb.play(audio_tag)
                notes2_playing = audio_tag
             //   return("notes2")
            } else if (!notes3.isPlaying) {
                notes3.play(audio_tag)
                notes3_playing = audio_tag
              //  return("notes3")
            } else {
                notes4.play(audio_tag)
                notes4_playing = audio_tag
              //  return("notes4")
            } 
            
            if(audio_tag in cursor_high){
                drawKey(audio_tag, true);
                //draw (cursor_high[audio_tag], 345);
            }
            else {
                drawKey(audio_tag, true);
                //draw(3 + cursor_low.indexOf(audio_tag)*24, 437);
            }
            }

}

function stop_note(audio_tag){
    if (audio_tag != -1 && 1 <= audio_tag && 88 >= audio_tag){
            if (notes1_playing==audio_tag) {
                notes.stop()
                notes1_playing = false
            } else if (notes2_playing==audio_tag) {
                notesb.stop()
                notes2_playing = false
            } else if (notes3_playing==audio_tag) {
                notes3.pause()
                notes3_playing = false
            } else if (notes4_playing==audio_tag) {
                notes4.pause()
                notes4_playing = false
            } 
            
            if(audio_tag in cursor_high){
                drawKey(audio_tag, true);
               // draw (cursor_high[audio_tag], 345);
            }
            else {
                drawKey(audio_tag, true);
               // draw(3 + cursor_low.indexOf(audio_tag)*24, 437);
            }
            }
}

function drawDBox(){
    var bounds = new Phaser.Rectangle(0-kbwidth+game.scale.width-50, 0, kbwidth-game.scale.width+100, game.scale.height);
    topBox = game.add.graphics(pX-12, pY-98)
    topBox.lineStyle(0, 0x0000FF, 1)
    topBox.beginFill(0x000000, 1.0)
    topBox.drawRect(0, 0, kbwidth+25, 98)
    topBox.endFill(0x000000, 1.0)
    topBox.inputEnabled = true;
    topBox.input.boundsRect=bounds;
    topBox.input.useHandCursor = true;
    topBox.input.enableDrag();
    topBox.input.allowVerticalDrag = false;
    var graphics = game.add.graphics(0, 0)
    graphics.beginFill(0x000000, 1.0)
    graphics.drawRect(0, 98, kbwidth+25, kbheight+15)
    graphics.endFill(0x000000, 1.0)
    //graphics.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    //graphics.fillRect(250, 200, 400, 256);
    topBox.addChild(graphics);
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var text = game.add.text(0, 0, "multiTouchPiano", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    text.setTextBounds(0, 0, kbwidth+24, 100-2);
    topBox.addChild(text);
    
    var text = game.add.text(10, 10, "⇱ ★▪▫ ◽◾ ◻◼", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    //text.setTextBounds(0, 0, kbwidth+24, 100-2);
}

// function draw(x, y){
//     var graphics = game.add.graphics(pX+x, y)
//     graphics.lineStyle(2, 0x0000FF, 1)
//     graphics.beginFill(0x0000FF, 0.5)
//     graphics.drawRect(0, 0, 18, 18)
//     graphics.endFill(0x0000FF, 0.5)
//     setTimeout(function (){graphics.destroy()}, 100)
// }

 function clicked(){
     if (ptactive[0]==true) {alert();
            stop_note(ptnote[0]);
            ptactive[0]=false;
        }
//     click_flag = false
//     mX = this.game.input.mousePointer.x
//     mY = this.game.input.mousePointer.y
//     if (mX >= pX){
//         if (pY < mY && mY < 460){
//             if(mY < 360){
//                 x = mX - 50
//                 played = false
//                 for(audio_tag in cursor_high){
//                     if (cursor_high[audio_tag] <= x && cursor_high[audio_tag] + 16 >= x){
//                         play_note(audio_tag)
//                         played = true
//                         break
//                     }
//                 }
//                 if (!played) play_note(cursor_low[Math.floor((mX - 50)/24)])
//                 }
            
//             else{
//                 audio_tag = cursor_low[Math.floor((mX - 50)/24)]
//                 play_note(audio_tag)
//             }
//         }
//     }    
 }

function get_audio_tag(mX, mY){
    mX=mX-topBox.x+38;
    if (mX >= pX){
        if (pY < mY && mY < pY+kbheight){
            if(mY < pY+(116/210)*kbheight){
                var x = mX - 50
                var played = false
                for(var audio_tag in cursor_high){
                    var tagX=cursor_low.indexOf(audio_tag-1)*(kbwidth/52)+(2/3)*(kbwidth/52);
                    if (tagX <= x && tagX + (2/3)*(kbwidth/52) >= x){ //cursor_low.indexOf(audio_tag-1)*(kbwidth/52)+(2/3)*(kbwidth/52)+2;//cursor_high[audio_tag]+2;
                        return(audio_tag)
                        //played = true
                        //break
                    }
                }
                if (!played) return(cursor_low[Math.floor((mX - 50)/(kbwidth/52))])
                }
            
            else{
                audio_tag = cursor_low[Math.floor((mX - 50)/(kbwidth/52))]
                return(audio_tag)
            }
        }
    }    
}

function render() {

    //  Just renders out the pointer data when you touch the canvas
   // game.debug.pointer(game.input.mousePointer);
    // game.debug.pointer(game.input.pointer1);
    // game.debug.pointer(game.input.pointer2);
    // game.debug.pointer(game.input.pointer3);
    // game.debug.pointer(game.input.pointer4);
    // game.debug.pointer(game.input.pointer5);
    // game.debug.pointer(game.input.pointer6);

}