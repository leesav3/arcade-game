"use strict";

let allEnemies = [];
let lives = [];
let player;
let lifeCount = 3;

// modal variables
let modal = document.getElementById('myModal');
let span = document.getElementsByClassName("close")[0];
let modalText = document.getElementById('modalText');

// Enemies our player must avoid
let Enemy = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    // actual width is 100x100, but we are making it less sensitive to collisions
    this.width = 80;
    this.height = 80;
    this.speed = getRandomInt(100, 400);
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;

    // check for collisions
    checkCollisions(this);

    // if bug goes off screen, put it back!
    if (this.x > 505) {
      this.x -= 600;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function(x, y) {
  //constructor(x, y) {
    this.x = x;
    this.y = y;
    // actual width is 95x95, but we are making it less sensitive to collisions
    this.width = 75;
    this.height = 75;
    this.sprite = 'images/char-pink-girl.png';
};

Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
  switch(direction) {
    case 'left':
      if (this.x - 100 >= 0) {
        this.x -= 100;
      }
      break;
    case 'up':
      if (this.y - 85 >= 0) {
        this.y -= 85;
        if (this.y <= 35) {
          // player made it to water! game won
          gameOver();
        }
      }
      break;
    case 'right':
      if (this.x + 100 <= 460) {
        this.x += 100;
      }
      break;
    case 'down':
      if (this.y + 85 <= 460) {
        this.y += 85;
      }
      break;
  }
  //console.log(this.x, this.y);
};

// Life object (heart) for HUD
let Life = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/heart.png';
};

Life.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 33.6, 56.6);
}


// Now instantiate your objects.
player = new Player(200, 460);
allEnemies = [new Enemy(-100, 120), new Enemy(-100, 205), new Enemy(-100, 290)];
lives = [new Life(390, 0), new Life(425, 0), new Life(460,0)];


// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// function to get random speed between two integers from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function checkCollisions(enemy) {
  if (enemy.x < player.x + player.width && enemy.x + enemy.width > player.x && enemy.y < player.y + player.height && enemy.height + enemy.y > player.y) {
    // collision detected! reset player and enemies
    console.log("collision!!!" + enemy.x, player.x + player.width);
    reset();
  }
}

function reset() {
  player.x = 200;
  player.y = 460;
  lifeCount -= 1;
  console.log(lifeCount);
  switch(lifeCount) {
    case 2:
      delete lives[0];
      break;
    case 1:
      delete lives[1];
      break;
    case 0:
      delete lives[2];
      gameOver();
      break;
  }
  //delete lives[0];
}

function restartGame() {
  location.reload();
}

function gameOver() {
  modal.style.display = "block";
  if (lifeCount > 0) {
    modalText.innerHTML = "You Won!";
  } else {
    modalText.innerHTML = "You Lost!";
  }

}

// Modal functionality from https://www.w3schools.com/howto/howto_css_modals.asp
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
