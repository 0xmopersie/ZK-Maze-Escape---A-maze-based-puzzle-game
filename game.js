// ZK Runner - Succinct Themed Game
// Basic endless runner game in JavaScript using Phaser.js

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let obstacles;
let zkProofs;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg');
    this.load.image('ground', 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Rectangular_Shape.svg');
    this.load.image('obstacle', 'https://cdn-icons-png.flaticon.com/512/564/564619.png'); 
    this.load.image('zkProof', 'https://cdn-icons-png.flaticon.com/512/845/845646.png'); 

}

function create() {
    this.add.rectangle(400, 200, 800, 400, 0x000000);
    let ground = this.physics.add.staticGroup();
    ground.create(400, 390, 'ground');
    
    player = this.physics.add.sprite(100, 300, 'player');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, ground);
    
    obstacles = this.physics.add.group();
    zkProofs = this.physics.add.group();
    
    this.time.addEvent({
        delay: 2000,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });
    
    this.time.addEvent({
        delay: 3000,
        callback: spawnZKProof,
        callbackScope: this,
        loop: true
    });
    
    cursors = this.input.keyboard.createCursorKeys();
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    
    this.physics.add.collider(player, obstacles, gameOver, null, this);
    this.physics.add.overlap(player, zkProofs, collectZKProof, null, this);
}

function update() {
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}

function spawnObstacle() {
    let obstacle = obstacles.create(800, 360, 'obstacle');
    obstacle.setVelocityX(-200);
}

function spawnZKProof() {
    let zkProof = zkProofs.create(800, Phaser.Math.Between(250, 350), 'zkProof');
    zkProof.setVelocityX(-200);
}

function collectZKProof(player, zkProof) {
    zkProof.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

function gameOver() {
    this.physics.pause();
    player.setTint(0xff0000);
    scoreText.setText('Game Over!');
}
