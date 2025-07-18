(function() {
  class Enemy extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
      super(scene, x, y);

      // Main body (red saucer)
      let saucerBase = scene.add.ellipse(0, 0, 34, 18, 0xff4444);
      let saucerLight = scene.add.ellipse(0, -7, 16, 8, 0xffffff, 0.7);
      let dome = scene.add.ellipse(0, -7, 14, 10, 0x99ddff, 0.92);
      let leftLight = scene.add.ellipse(-10, 6, 4, 4, 0xfffa66, 0.9);
      let rightLight = scene.add.ellipse(10, 6, 4, 4, 0xfffa66, 0.9);

      this.add([saucerBase, saucerLight, dome, leftLight, rightLight]);
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setSize(34, 18);
      if (this.body) {
        this.body.setSize(28, 12).setOffset(-14, -6);
        this.body.immovable = true;
      }
      this.isExploding = false;
    }

    start(speed) {
      this.setPosition(this.x, -18);
      if (this.body) {
        this.body.setVelocityY(speed);
      }
      this.setVisible(true);
      this.setActive(true);
      this.isExploding = false;
    }

    explode() {
      if (this.isExploding) return;
      this.isExploding = true;
      let scene = this.scene;
      // Explosion effect
      for (let i = 0; i < 10; i++) {
        let angle = (Math.PI * 2) * (i / 10);
        let px = this.x + Math.cos(angle) * 10;
        let py = this.y + Math.sin(angle) * 7;
        let particle = scene.add.rectangle(px, py, 3, 3, 0xff7777);
        scene.tweens.add({
          targets: particle,
          x: this.x + Math.cos(angle) * 45,
          y: this.y + Math.sin(angle) * 32,
          alpha: 0,
          duration: 320,
          onComplete: function() { particle.destroy(); }
        });
      }
      this.setVisible(false);
      this.setActive(false);
      if (this.body) this.body.enable = false;
    }
  }

  window.Enemy = Enemy;
})();