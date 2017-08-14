var BlackHole, Particle, _MAX_PARTICLES, _PARTICLE_DECAY_RATE, _animate, _canvas, _clearCanvas, _context, _getRandomInRange, _getRandomIntInRange, _screenHeight, _screenWidth, blackHoles, i, j, mousePosition, move, part, particles, ref, resizeCanvas,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
function getColor() {
  var random = Math.ceil(Math.random() * 10);
  // return random%2 == 0 ? 0 : 255
  return 255
}
_MAX_PARTICLES = 10;

_PARTICLE_DECAY_RATE = 0.0005;

_screenHeight = window.innerHeight;

_screenWidth = window.innerWidth;

_canvas = document.getElementById('canvas');

_context = _canvas.getContext('2d');

resizeCanvas = function() {
  _screenHeight = window.innerHeight;
  _screenWidth = window.innerWidth;
  _canvas.width = _screenWidth;
  _canvas.height = _screenHeight;
};

mousePosition = function(event) {
  var _cursorPosition, _rect;
  _rect = _canvas.getBoundingClientRect();
  _cursorPosition = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  // console.log(_cursorPosition);
};

_clearCanvas = function() {
  return _context.clearRect(0, 0, _screenWidth, _screenHeight);
};

_getRandomIntInRange = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

_getRandomInRange = function(min, max) {
  return Math.random() * (max - min + 1) + min;
};

Particle = (function() {
  function Particle() {
    this.draw = bind(this.draw, this);
    this.x = _getRandomIntInRange(0, _screenWidth);
    this.y = _getRandomIntInRange(0, _screenHeight);
    this.size = _getRandomInRange(0.5, .7);
    this.lifeForce = 0;
    this.lifePeak = false;
    this.maxLifeForce = _getRandomInRange(0.45, 1);
    this.velocity = [_getRandomInRange(-1, 1), _getRandomInRange(-1, 1), _getRandomInRange(-1, 1)];
  }

  Particle.prototype.draw = function() {
    if (this.lifeForce <= 0 && this.lifePeak) {
      this.constructor();
    }
    if (this.lifePeak) {
      this.lifeForce -= _PARTICLE_DECAY_RATE;
    } else if (!this.lifePeak) {
      this.lifeForce += _PARTICLE_DECAY_RATE;
    }
    if (this.lifeForce >= this.maxLifeForce) {
      this.lifePeak = true;
    }
    this.x += this.velocity[0];
    if (this.x > _screenWidth) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = _screenWidth;
    }
    this.y += this.velocity[1];
    if (this.y > _screenHeight) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = _screenHeight;
    }
    _context.beginPath();
    _context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    var color = getColor();
    _context.fillStyle = "rgba(" + color + ", " + color + ", 255, " + 1 + ")";
    return _context.fill();
  };

  return Particle;

})();

BlackHole = (function() {
  function BlackHole(x, y) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    this.draw = bind(this.draw, this);
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  BlackHole.prototype.draw = function() {
    _context.beginPath();
    _context.fillStyle = "#804C1A";
    _context.fillRect(this.x, this.y, this.size, this.size);
    return _context.fill();
  };

  return BlackHole;

})();

_animate = function() {
  var hole, j, k, len, len1, part;
  _clearCanvas();
  for (j = 0, len = particles.length; j < len; j++) {
    part = particles[j];
    part.draw();
  }
  for (k = 0, len1 = blackHoles.length; k < len1; k++) {
    hole = blackHoles[k];
    hole.draw();
  }
  return requestAnimationFrame(_animate);
};

move = function(event) {
  var x, y;
  x = event.clientX - 5.5;
  y = event.clientY - 6;
  blackHoles.push(new BlackHole(x, y));
};

particles = [];

blackHoles = [];

for (i = j = 0, ref = _MAX_PARTICLES; j <= ref; i = j += 1) {
  part = new Particle();
  particles.push(part);
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas, false);

_canvas.addEventListener('click', function(event) {
  // return move(event, false);
});

_animate();
