(function() {
  const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    backgroundColor: '#000010',
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
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
  let spaceKey;
  let bullets;
  let enemies;
  let score = 0;
  let scoreText;
  let gameOver = false;
  let restartKey;
  let lastEnemySpawn = 0;

  function preload() {
    // No external assets: draw everything in code
  }

  function create() {
    score = 0;
    gameOver = false;
    this.add.rectangle(240, 320, 480, 640, 0x000010);

    // Stars background
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      let star = this.add.rectangle(
        Phaser.Math.Between(0, 480), Phaser.Math.Between(0, 640),
        2, 2, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.8)
      );
      this.stars.push(star);
    }

    // Player
    player = new window.Player(this, 240, 570);
    this.add.existing(player);

    // Bullets group
    bullets = this.physics.add.group({
      classType: window.Bullet,
      maxSize: 20,
      runChildUpdate: true
    });

    // Enemies group
    enemies = this.physics.add.group({
      classType: window.Enemy,
      maxSize: 32,
      runChildUpdate: true
    });

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Score
    scoreText = this.add.text(12, 8, 'Score: 0', {
      fontSize: '20px',
      fill: '#fff'
    });

    // Collisions
    this.physics.add.overlap(bullets, enemies, onBulletHitEnemy, null, this);
    this.physics.add.overlap(player, enemies, onPlayerHit, null, this);

    // Fire cooldown
    player.lastFired = 0;
  }

  function update(time, delta) {
    if (gameOver) {
      if (Phaser.Input.Keyboard.JustDown(restartKey)) {
        this.scene.restart();
      }
      return;
    }

    // Move stars
    for (let star of this.stars) {
      star.y += 1.5;
      if (star.y > 640) {
        star.y = 0;
        star.x = Phaser.Math.Between(0, 480);
      }
    }

    // Player controls
    if (player) player.update(cursors, spaceKey, bullets, time);

    // Spawn enemies
    if (time > lastEnemySpawn + 800) {
      spawnEnemy(this);
      lastEnemySpawn = time;
    }

    // Remove out-of-bounds bullets/enemies
    bullets.children.iterate(function(bullet) {
      if (bullet && bullet.active && bullet.y < -20) bullet.setActive(false).setVisible(false);
    });
    enemies.children.iterate(function(enemy) {
      if (enemy && enemy.active && enemy.y > 660) enemy.setActive(false).setVisible(false);
    });
  }

  function onBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.setActive(false).setVisible(false);
    enemy.explode();
    score += 10;
    scoreText.setText('Score: ' + score);
  }

  function onPlayerHit(playerObj, enemy) {
    if (gameOver) return;
    playerObj.explode();
    enemy.explode();
    gameOver = true;
    showGameOver(this);
  }

  function showGameOver(scene) {
    let txt = scene.add.text(240, 320, 'GAME OVER\nPress R to Restart', {
      fontSize: '32px',
      color: '#ff3333',
      align: 'center'
    });
    txt.setOrigin(0.5, 0.5);
  }

  function spawnEnemy(scene) {
    let x = Phaser.Math.Between(32, 448);
    let speed = Phaser.Math.Between(80, 120);
    let enemy = enemies.get(x, -32);
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      enemy.start(speed);
    }
  }

  window.onload = function() {
    new Phaser.Game(config);
  };
})();