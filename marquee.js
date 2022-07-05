
var game = new Phaser.Game(640, 480, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, render: render });

var counter=0;
var content = [
    "A recent finding by statisticians shows that the average human has one breast and one testicle.",
    "State Population To Double By 2040: Babies To Blame",
    "New Study of Obesity Looks for Larger Test Group.",
    "Total lunar eclipse - broadcast live on radio.",
];
var text;


var btnup, btndown;

function preload() {


}

function create() {
    game.stage.backgroundColor = '#6688ee';

    var bar = game.add.graphics();
    bar.beginFill(0xb0f0f0, 0.6);
    bar.drawRect(0, 100, 640, 100);

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    text = game.add.text(640, 100+50, content[counter], style);
    text.anchor.setTo(0.0, 0.5);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    game.time.events.loop(Phaser.Timer.SECOND*0.01, updateTicker, this);
    
        // create button graphics
        var gfxup = game.make.graphics(0, 0);
        gfxup.lineStyle(3, 0xffffff, 1);
        gfxup.visible = false;
        // draw frame 0
        gfxup.moveTo(16, 29);
        gfxup.lineTo(3, 29);
        gfxup.lineTo(16, 3);
        gfxup.lineTo(29, 29);
        gfxup.currentPath.shape.closed = true;
        // draw frame 1        
        gfxup.beginFill(0xFF3300);
        gfxup.moveTo(48, 29);
        gfxup.lineTo(35, 29);
        gfxup.lineTo(48, 3);
        gfxup.lineTo(61, 29);
        gfxup.currentPath.shape.closed = true;
        // creating a sprite sheet with generateTexture
        game.cache.addSpriteSheet('upbtn', null, gfxup.generateTexture().baseTexture.source, 32, 32, 2, 0, 0);

        var gfxdown = game.make.graphics(0, 0);
        gfxdown.lineStyle(3, 0xffffff, 1);
        gfxdown.visible = false;
        // draw frame 0
        gfxdown.moveTo(16, 3);
        gfxdown.lineTo(3, 3);
        gfxdown.lineTo(16, 29);
        gfxdown.lineTo(29, 3);
        gfxdown.currentPath.shape.closed = true;
        // draw frame 1        
        gfxdown.beginFill(0xFF3300);
        gfxdown.moveTo(48, 3);
        gfxdown.lineTo(35, 3);
        gfxdown.lineTo(48, 29);
        gfxdown.lineTo(61, 3);
        gfxdown.currentPath.shape.closed = true;
        // creating a sprite sheet with generateTexture
        game.cache.addSpriteSheet('downbtn', null, gfxdown.generateTexture().baseTexture.source, 32, 32, 2, 0, 0);

 
 
 
        // creating a sprite with the sheet
        var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'upbtn', 0);
        sprite.anchor.set(0.5, 0.5);
        sprite.width = 50;
        sprite.height = 50;
        // step frame index every second
        game.time.events.loop(1000, function () {
            sprite.frame += 1;
            sprite.frame = sprite.frame %= 2;
        });
        
    // create game controller buttons 
    btnup = game.add.button(640-100, 480-100, 'upbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btnup.fixedToCamera = true;  //our buttons should stay on the same place  
    btnup.events.onInputOver.add(function(){sprite.height+=1;});
    btnup.events.onInputOut.add(function(){sprite.height=30;});
    btnup.events.onInputDown.add(function(){sprite.height+=1;});
  //  btnup.events.onInputUp.add(function(){sprite.height=30;});
    btndown = game.add.button(640-100, 480-100+50, 'downbtn', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    btndown.fixedToCamera = true;  //our buttons should stay on the same place  
    btndown.events.onInputOver.add(function(){sprite.height+=1;});
    btndown.events.onInputOut.add(function(){sprite.height=30;});
    btndown.events.onInputDown.add(function(){sprite.height+=1;});
  //  btndown.events.onInputUp.add(function(){sprite.height=30;});

}

function updateTicker() {
    
    text.x -=3;
    if (text.x+text.width<0) {
        text.x=640;
        counter += 1;
        if (content.length-1<counter) counter=0;
        text.setText(content[counter]);
    }

}

function render() {
    
}