// https://tympanus.net/codrops/2014/09/23/animated-background-headers/

const bubbles = () => {

  var width, height, content, canvas, ctx, circles = true;

  // Main
  initHeader();

  function initHeader() {
    content = document.getElementsByClassName('content')[0];
    width = content.offsetWidth;
    height = content.offsetHeight;

    canvas = document.getElementsByClassName('background-canvas')[0];
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create particles
    circles = [];
    for (var x = 0; x < width * 0.5; x++) {
      var c = new Circle();
      circles.push(c);
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    circles.forEach(function(circle) {
      circle.draw();
    });
    requestAnimationFrame(animate);
  }

  // Canvas manipulation
  function Circle() {
    var _this = this;

    // constructor
    (function () {
      _this.pos = {};
      init();
    })();

    function init() {
      _this.pos.x = Math.random() * width;
      _this.pos.y = height + Math.random() * 100;
      _this.alpha = 0.1 + Math.random() * 0.3;
      _this.scale = 0.1 + Math.random() * 0.3;
      _this.velocity = Math.random();
    }

    this.draw = function () {
      if (_this.alpha <= 0) {
        init();
      }
      _this.pos.y -= _this.velocity;
      _this.alpha -= 0.0005;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(181,135,255,' + _this.alpha + ')';
      ctx.fill();
    };
  }
};

export default bubbles;