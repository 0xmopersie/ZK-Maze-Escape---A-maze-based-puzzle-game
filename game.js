// ZK Runner - Chrome Dinosaur Style Game
// Endless runner game similar to Google Chrome offline dinosaur game

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
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
let score = 0;
let scoreText;
let gameOverText;
let restartButton;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://cdn-icons-png.flaticon.com/512/4144/4144600.png');
    this.load.image('ground', 'https://cdn-icons-png.flaticon.com/512/190/190008.png');
    this.load.image('obstacle', 'https://cdn-icons-png.flaticon.com/512/564/564619.png');
    this.load.image('restart', 'https://cdn-icons-png.flaticon.com/512/3031/3031293.png');
    this.load.audio('jump', 'https://assets.mixkit.co/active_storage/sfx/1555/1555-preview.mp3');
}

function create() {
    this.add.rectangle(400, 200, 800, 400, 0x000000);
    
    let ground = this.physics.add.staticGroup();
    ground.create(400, 390, 'ground').setScale(4, 0.5).refreshBody();
    
    player = this.physics.add.sprite(100, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(0.15);
    this.physics.add.collider(player, ground);
    
    obstacles = this.physics.add.group();
    
    this.time.addEvent({
        delay: 1500,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });
    
    cursors = this.input.keyboard.createCursorKeys();
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    
    this.physics.add.collider(player, obstacles, gameOver, null, this);
    
    gameOverText = this.add.text(400, 150, '', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
    restartButton = this.add.image(400, 250, 'restart').setScale(0.1).setInteractive().setVisible(false);
    restartButton.on('pointerdown', () => restartGame(), this);
}

function update() {
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
        this.sound.play('jump');
    }
}

function spawnObstacle() {
    let obstacle = obstacles.create(800, 360, 'obstacle');
    obstacle.setScale(0.1);
    obstacle.setVelocityX(-300);
}

function gameOver() {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOverText.setText('Game Over!');
    restartButton.setVisible(true);
}

function restartGame() {
    this.scene.restart();
    score = 0;
}
