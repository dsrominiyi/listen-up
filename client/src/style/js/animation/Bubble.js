class Bubble {

  constructor(canvas, ctx, rgb) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rgb = rgb;
    this.pos = {};
    this.init();
  }

  init = () => {
    this.pos.x = Math.random() * this.canvas.width;
    this.pos.y = this.canvas.height + Math.random() * 100;
    this.alpha = 0.1 + Math.random() * 0.3;
    this.scale = 0.1 + Math.random() * 0.3;
    this.velocity = Math.random();
  }

  draw = () => {
    const [ r, g, b] = this.rgb;
    if (this.alpha <= 0) {
      this.init();
    }
    this.pos.y -= this.velocity;
    this.alpha -= 0.0005;
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.scale * 10, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
    this.ctx.fill();
  }
}

export default Bubble;