(function() {
  class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
      super(scene, x, y, null);
      this.setTexture();
      this.setActive(false);
      this.setVisible(false);
      this.lifespan = 800; // ms
    }

    setTexture() {
      // Draw a white/yellow beam, no external asset
      let g = this.scene.add.graphics();
      g.fillStyle(0xffff66, 1);
      g.fillRect(-2, -10, 4, 20);
      let rt = this.scene.make.renderTexture({ width: 8, height: 24, add: false });
      rt.draw(g, 4, 12);
      this.setTexture(rt.texture.key);
      g.destroy();
      rt.destroy();
    }

    fire() {
      this.setPosition(this.x, this.y - 18);
      if (this.body) this.body.setVelocityY(-420);
      this.setActive(true);
      this.setVisible(true);
      this.spawnTime = this.scene.time.now;
    }

    preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if (this.y < -20) {
        this.setActive(false);
        this.setVisible(false);
      }
    }
  }

  window.Bullet = Bullet;
})();