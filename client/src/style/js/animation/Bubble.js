class Bubble {

  constructor(canvasWidth, canvasHeight, ctx, rgb) {
    this.ctx = ctx;
    this.rgb = rgb;
    this.pos = {};
    this.init(canvasWidth, canvasHeight);
  }

  init = (canvasWidth, canvasHeight) => {
    this.pos.x = Math.random() * canvasWidth;
    this.pos.y = canvasHeight + Math.random() * 100;
    this.alpha = 0.1 + Math.random() * 0.3;
    this.scale = 0.1 + Math.random() * 0.3;
    this.velocity = Math.random();
  }

  draw = (canvasWidth, canvasHeight) => {
    const [ r, g, b] = this.rgb;
    if (this.alpha <= 0) {
      this.init(canvasWidth, canvasHeight);
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