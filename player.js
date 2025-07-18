(function() {
  class Player extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
      super(scene, x, y);

      // Main body (triangle spaceship)
      let body = scene.add.triangle(0, 0, -18, 16, 18, 16, 0, -20, 0x00e0ff);
      let cockpit = scene.add.ellipse(0, -6, 14, 12, 0xffffff, 0.8);
      let leftWing = scene.add.rectangle(-13, 10, 8, 16, 0x00c9d6);
      let rightWing = scene.add.rectangle(13, 10, 8, 16, 0x00c9d6);

      this.add([body, cockpit, leftWing, rightWing]);
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setSize(36, 36);
      if (this.body) {
        this.body.setCollideWorldBounds(true);
        this.body.setSize(28, 32).setOffset(-14, -16);
        this.body.immovable = true;
      }
      this.fireCooldown = 270; // milliseconds
      this.lastFired = 0;
      this.isExploding = false;
    }

    update(cursors, spaceKey, bullets, time) {
      if (this.isExploding) return;

      // Movement
      let speed = 260;
      let vx = 0, vy = 0;
      if (cursors.left.isDown) vx = -speed;
      else if (cursors.right.isDown) vx = speed;
      if (cursors.up.isDown) vy = -speed;
      else if (cursors.down.isDown) vy = speed;

      if (this.body) {
        this.body.setVelocity(vx, vy);
      }

      // Shooting
      if (Phaser.Input.Keyboard.JustDown(spaceKey) || spaceKey.isDown) {
        if (time > this.lastFired + this.fireCooldown) {
          let bullet = bullets.get(this.x, this.y - 24);
          if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.fire();
            this.lastFired = time;
          }
        }
      }
    }

    explode() {
      if (this.isExploding) return;
      this.isExploding = true;
      let scene = this.scene;
      // Explosion effect
      for (let i = 0; i < 16; i++) {
        let angle = (Math.PI * 2) * (i / 16);
        let px = this.x + Math.cos(angle) * 14;
        let py = this.y + Math.sin(angle) * 14;
        let particle = scene.add.rectangle(px, py, 4, 4, 0xffcc00);
        scene.tweens.add({
          targets: particle,
          x: this.x + Math.cos(angle) * 64,
          y: this.y + Math.sin(angle) * 64,
          alpha: 0,
          duration: 400,
          onComplete: function() { particle.destroy(); }
        });
      }
      this.setVisible(false);
      if (this.body) this.body.enable = false;
    }
  }

  window.Player = Player;
})();