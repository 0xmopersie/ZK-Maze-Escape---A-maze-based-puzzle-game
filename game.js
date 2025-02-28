// ZK Runner - Enhanced Version
// Improved endless runner game with better visuals and mechanics

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
let gameOverText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png');
    this.load.image('ground', 'https://cdn-icons-png.flaticon.com/512/646/646094.png');
    this.load.image('obstacle', 'https://cdn-icons-png.flaticon.com/512/564/564619.png');
    this.load.image('zkProof', 'https://cdn-icons-png.flaticon.com/512/845/845646.png');
    this.load.image('restart', 'https://cdn-icons-png.flaticon.com/512/3031/3031293.png');
}

function create() {
    this.add.rectangle(400, 200, 800, 400, 0x000000);
    let ground = this.physics.add.staticGroup();
    ground.create(400, 390, 'ground').setScale(1, 0.5).refreshBody();
    
    player = this.physics.add.sprite(100, 300, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(0.1);
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
    
    gameOverText = this.add.text(400, 200, '', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
}

function update() {
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}

function spawnObstacle() {
    let obstacle = obstacles.create(800, 360, 'obstacle');
    obstacle.setScale(0.1);
    obstacle.setVelocityX(-200);
}

function spawnZKProof() {
    let zkProof = zkProofs.create(800, Phaser.Math.Between(250, 350), 'zkProof');
    zkProof.setScale(0.1);
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
    gameOverText.setText('Game Over! Click to Restart');
    
    this.input.once('pointerdown', () => {
        this.scene.restart();
        score = 0;
    });
}
