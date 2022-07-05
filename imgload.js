var game = new Phaser.Game(1920, 1180, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create , update : update});

var speed = 4;
var b1, b2, b3, b4;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('sky', 'assets/venice/sky.png');
  game.load.image('water', 'assets/venice/water.png');
      game.load.image('bg', 'assets/venice/bg.png');
  game.load.image('b1', 'assets/venice/1.png');
      game.load.image('b2', 'assets/venice/2.png');
  game.load.image('b3', 'assets/venice/3.png');
        game.load.image('b4', 'assets/venice/4.png');
  game.load.image('vg', 'assets/venice/vg.png');

}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    var s = game.add.sprite(0, 0, 'sky');
    var w = game.add.sprite(0, 0, 'water');
        var bg = game.add.sprite(0, 0, 'bg');
    b1 = game.add.sprite(0, 0, 'b1');
        game.physics.enable(b1, Phaser.Physics.ARCADE);

    b1.body.velocity.x=-5;
    b2 = game.add.sprite(0, 0, 'b2');
    b3 = game.add.sprite(0, 0, 'b3');
    b4 = game.add.sprite(0, 0, 'b4');
    var vg = game.add.sprite(0, 0, 'vg');
   // s.rotation = -0.1;

}

function update() {

    // Check key states every frame.
    // Move ONLY one of the left and right key is hold.

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        b4.x -= speed;
      //  b4.angle = -1;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        b4.x += speed;
      //  b4.angle = 1;
    }
    else
    {
      //  b4.rotation = 0;
    }

}