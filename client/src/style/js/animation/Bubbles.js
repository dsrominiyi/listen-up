import Bubble from './Bubble';

class Bubbles {
  /** 
   *  rgb: array of int values [ r, g, b ]
   */
  constructor(rgb) {
    this.rgb = rgb;
  }

  start = () => {
    this.initCanvas();
    this.addListeners();
  }

  stop = () => {
    cancelAnimationFrame(this.requestId);
    this.removeListeners();
  }

  initCanvas = () => {
    this.content = document.getElementsByClassName('content')[0];

    this.canvas = document.getElementsByClassName('background-canvas')[0];
    this.canvas.width = this.content.offsetWidth;
    this.canvas.height = this.content.offsetHeight;

    this.ctx = this.canvas.getContext('2d');

    this.initBubbles();
    this.animate();
  }

  initBubbles = () => {
    this.bubbles = [];
    for (var x = 0; x < this.canvas.width * 0.5; x++) {
      const b = new Bubble(this.canvas, this.ctx, this.rgb);
      this.bubbles.push(b);
    }
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bubbles.forEach(bubble => {
      bubble.draw();
    });
    this.requestId = requestAnimationFrame(this.animate);
  }

  resize = () => {
    const oldWidth = this.canvas.width;
    this.canvas.width = this.content.offsetWidth;
    this.canvas.height = this.content.offsetHeight;
    if (this.canvas.width !== oldWidth) {
      this.initBubbles();
    }
  }

  addListeners = () => {
    window.addEventListener('resize', this.resize);
    this.content.addEventListener('DOMSubtreeModified', this.resize);
  }

  removeListeners = () => {
    window.removeEventListener('resize', this.resize);
    this.content.removeEventListener('DOMSubtreeModified', this.resize);
  }
}

export default Bubbles;