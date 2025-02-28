// ZK Maze Escape - A maze-based puzzle game
// Collect all ZK Proofs to unlock the exit and escape the maze

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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
let zkProofs;
let exit;
let walls;
let score = 0;
let scoreText;
let gameOverText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://cdn-icons-png.flaticon.com/512/4144/4144600.png');
    this.load.image('wall', 'https://cdn-icons-png.flaticon.com/512/1532/1532666.png');
    this.load.image('zkProof', 'https://cdn-icons-png.flaticon.com/512/845/845646.png');
    this.load.image('exit', 'https://cdn-icons-png.flaticon.com/512/1828/1828427.png');
    this.load.audio('collect', 'https://assets.mixkit.co/active_storage/sfx/1805/1805-preview.mp3');
    this.load.audio('win', 'https://assets.mixkit.co/active_storage/sfx/2023/2023-preview.mp3');
}

function create() {
    this.add.rectangle(400, 300, 800, 600, 0x000000);
    
    walls = this.physics.add.staticGroup();
    for (let i = 0; i < 10; i++) {
        walls.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'wall').setScale(0.1).refreshBody();
    }
    
    player = this.physics.add.sprite(100, 100, 'player');
    player.setCollideWorldBounds(true);
    player.setScale(0.15);
    
    zkProofs = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        let zkProof = zkProofs.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 500), 'zkProof');
        zkProof.setScale(0.1);
    }
    
    exit = this.physics.add.staticSprite(750, 550, 'exit').setScale(0.2);
    exit.setVisible(false);
    
    cursors = this.input.keyboard.createCursorKeys();
    scoreText = this.add.text(16, 16, 'ZK Proofs: 0/5', { fontSize: '24px', fill: '#fff' });
    
    this.physics.add.collider(player, walls);
    this.physics.add.overlap(player, zkProofs, collectZKProof, null, this);
    this.physics.add.overlap(player, exit, winGame, null, this);
    
    gameOverText = this.add.text(400, 250, '', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
}

function update() {
    player.setVelocity(0);
    
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    }
}

function collectZKProof(player, zkProof) {
    zkProof.destroy();
    score += 1;
    scoreText.setText('ZK Proofs: ' + score + '/5');
    this.sound.play('collect');
    
    if (score === 5) {
        exit.setVisible(true);
    }
}

function winGame() {
    if (score === 5) {
        this.physics.pause();
        gameOverText.setText('You Escaped!');
        this.sound.play('win');
    }
}
