// ZK Block Escape - A puzzle-platformer game
// The player must collect ZK proofs and avoid obstacles to reach the exit

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
let zkProofs;
let score = 0;
let scoreText;
let exit;
let gameOverText;
let restartButton;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://cdn-icons-png.flaticon.com/512/4144/4144600.png');
    this.load.image('ground', 'https://cdn-icons-png.flaticon.com/512/190/190008.png');
    this.load.image('obstacle', 'https://cdn-icons-png.flaticon.com/512/564/564619.png');
    this.load.image('zkProof', 'https://cdn-icons-png.flaticon.com/512/845/845646.png');
    this.load.image('exit', 'https://cdn-icons-png.flaticon.com/512/1828/1828427.png');
    this.load.audio('jump', 'https://assets.mixkit.co/active_storage/sfx/1555/1555-preview.mp3');
    this.load.audio('collect', 'https://assets.mixkit.co/active_storage/sfx/1805/1805-preview.mp3');
    this.load.audio('win', 'https://assets.mixkit.co/active_storage/sfx/2023/2023-preview.mp3');
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
    zkProofs = this.physics.add.group();
    
    this.time.addEvent({
        delay: 2000,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });
    
    this.time.addEvent({
        delay: 2500,
        callback: spawnZKProof,
        callbackScope: this,
        loop: true
    });
    
    exit = this.physics.add.staticSprite(750, 320, 'exit').setScale(0.2);
    
    cursors = this.input.keyboard.createCursorKeys();
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    
    this.physics.add.collider(player, obstacles, gameOver, null, this);
    this.physics.add.overlap(player, zkProofs, collectZKProof, null, this);
    this.physics.add.overlap(player, exit, winGame, null, this);
    
    gameOverText = this.add.text(400, 150, '', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
    restartButton = this.add.image(400, 250, 'exit').setScale(0.1).setInteractive().setVisible(false);
    restartButton.on('pointerdown', () => restartGame(), this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }
    
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
        this.sound.play('jump');
    }
}

function spawnObstacle() {
    let obstacle = obstacles.create(Phaser.Math.Between(200, 700), 360, 'obstacle');
    obstacle.setScale(0.1);
    obstacle.setVelocityX(-100);
}

function spawnZKProof() {
    let zkProof = zkProofs.create(Phaser.Math.Between(200, 700), Phaser.Math.Between(250, 350), 'zkProof');
    zkProof.setScale(0.1);
    zkProof.setVelocityX(-100);
}

function collectZKProof(player, zkProof) {
    zkProof.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
    this.sound.play('collect');
}

function gameOver() {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOverText.setText('Game Over!');
    restartButton.setVisible(true);
}

function winGame() {
    this.physics.pause();
    gameOverText.setText('You Win!');
    this.sound.play('win');
    restartButton.setVisible(true);
}

function restartGame() {
    this.scene.restart();
    score = 0;
}
