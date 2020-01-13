const canvas = document.getElementById("pong");
canvas.width = document.documentElement.clientWidth;
canvas.height =
  document.documentElement.clientHeight -
  document.documentElement.clientHeight / 10;

const gameOverScreen = document.getElementsByClassName("c-modal-gameover");
const gameOverScore = document.getElementsByClassName("c-menu-score");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var beginVelocityX = (beginVelocityY = 5);
var ballIncrementSpeed = 0.2;
var pointsToWin = 3;

//Select mode
let chosenGameMode = "single"; //when you have chosen a gamemode, then set that game mode to chosenGameMode and GameMode, because GameMode can change during the game and we have to
let GameMode = "single"; //keep track of what the selected gamemode was.

var ScoreDivl = document.getElementById("score-l");
var ScoreDivr = document.getElementById("score-r");

const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  velocityX: beginVelocityX,
  velocityY: beginVelocityY,
  speed: ballIncrementSpeed,
  color: "WHITE"
};

// User left Paddle left
const user = {
  x: 15, // left side of canvas + 15 pixels space between edge
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 150,
  score: 0,
  speed: 6,
  color: "WHITE"
};

var lastPaddleHit = user;

// User right Paddle right
const user2 = {
  x: canvas.width - 35, // - width of paddle + 15 pixels space between edge
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 150,
  score: 0,
  speed: 6,
  color: "WHITE"
};

// Computer left Paddle right
const comLeft = {
  x: 15, // left side of canvas + 15 pixels space between edge
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 150,
  score: 0,
  speed: 6,
  color: "WHITE"
};

// Computer right Paddle right
const com = {
  x: canvas.width - 35, // - width of paddle
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 150,
  score: 0,
  speed: 6,
  color: "WHITE"
};

const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 1000,
  width: 2,
  color: "#3385FF4d"
};

function getRndInteger(min, max) {
  //min and max included
  return Math.random() * (max - min + 1) + min;
}

// draw a rectangle, used to draw paddles
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// draw circle, used to draw the ball
function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}

function startMovingBall(direction) {
  // start moving the ball in the chosen direction and sets the speed and velocity to standard.
  let dir = getRndInteger(0, 1);
  if (dir < 0.5) {
    if (direction == "left") {
      ball.velocityX = getRndInteger(-4.5, -5.5);
      ball.velocityY = getRndInteger(-4.5, -5.5);
      lastPaddleHit = user2;
    } else if (direction == "right") {
      ball.velocityX = getRndInteger(4.5, 5.5);
      ball.velocityY = getRndInteger(-4.5, -5.5);
      lastPaddleHit = user;
    }
  } else if (dir > 0.5) {
    if (direction == "left") {
      ball.velocityX = getRndInteger(-4.5, -5.5);
      ball.velocityY = getRndInteger(4.5, 5.5);
      lastPaddleHit = user2;
    } else if (direction == "right") {
      ball.velocityX = getRndInteger(4.5, 5.5);
      ball.velocityY = getRndInteger(4.5, 5.5);
      lastPaddleHit = user;
    }
  }
}

function drawNet() {
  drawRect(net.x, net.y, net.width, net.height, net.color);
  //for (let i = 0; i <= canvas.height; i += 15) {
  //drawRect(net.x, net.y + i, net.width, net.height, net.color);
  //}
}

function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "75px fantasy";
  ctx.fillText(text, x, y);
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}

function clickRestart() {
  resetBall();
  startMovingBall();
  gameOverScreen[0].style.display = "none";
  GameMode = chosenGameMode;
  if (GameMode == "multi") {
    gameOverScore[0].text = user.score + " - " + user2.score;
  } else if (GameMode == "single") {
    gameOverScore[0].text = user.score + " - " + com.score;
  } else if (GameMode == "ai") {
    gameOverScore[0].text = comLeft.score + " - " + com.score;
  }
}

function keyDownHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = true;
  } else if (event.keyCode == 37) {
    leftPressed = true;
  } else if (event.keyCode == 40) {
    downPressed = true;
  } else if (event.keyCode == 38) {
    upPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = false;
  } else if (event.keyCode == 37) {
    leftPressed = false;
  } else if (event.keyCode == 40) {
    downPressed = false;
  } else if (event.keyCode == 38) {
    upPressed = false;
  }
}

function movePaddleTo(paddle, y, objectif) {
  if (objectif == "center") {
    if (paddle.y < y) {
      if (y - paddle.y > 10) {
        paddle.y += paddle.speed / 2;
      }
      if (y - paddle.y < 10) {
        paddle.y += 1;
      }
    }
    if (paddle.y > y) {
      if (paddle.y - y > 10) {
        paddle.y -= paddle.speed / 2;
      }
      if (paddle.y - y < 10) {
        paddle.y -= 1;
      }
    }
  } else if (objectif == "ai") {
    if (paddle.y + paddle.height / 2 < ball.y + ball.radius && paddle.y + paddle.height){
      paddle.y += paddle.speed;
    }
    if (paddle.y > ball.y) {
      paddle.y -= paddle.speed;
    }
  }
}

function comAI(playerHit) {
  if (playerHit.x == 15) {
    movePaddleTo(com, ball.y, "ai");
  } else if (com.y > canvas.height / 2 && playerHit.x == canvas.width - 35) {
    movePaddleTo(com, canvas.height / 2 - com.height / 2, "center");
  } else if (com.y < canvas.height / 2 && playerHit.x == canvas.width - 35) {
    movePaddleTo(com, canvas.height / 2 - com.height / 2, "center");
  }
}

function comLeftAI(playerHit) {
  if (playerHit.x == canvas.width - 35) {
    movePaddleTo(comLeft, ball.y, "ai");
  } else if (comLeft.y > canvas.height / 2 && playerHit.x == 15) {
    movePaddleTo(comLeft, canvas.height / 2 - com.height / 2, "center");
  } else if (comLeft.y < canvas.height / 2 && playerHit.x == 15) {
    movePaddleTo(comLeft, canvas.height / 2 - com.height / 2, "center");
  }
}

// update function, the function that does all calculations
function update() {
  // check if paddle is too high or to low
  if (user2.y < 11) {
    leftPressed = false;
  } else if (user2.y > canvas.height - (user2.height - 7)) {
    rightPressed = false;
  } else if (user.y < 11) {
    upPressed = false;
  } else if (user.y > canvas.height - (user.height - 7)) {
    downPressed = false;
  }

  // Check if key is pressed between the modes
  if (rightPressed && GameMode == "multi") {
    user2.y = user2.y + user2.speed;
  }
  if (leftPressed && GameMode == "multi") {
    user2.y = user2.y - user2.speed;
  }
  if (downPressed) {
    user.y = user.y + user.speed;
  }
  if (upPressed) {
    user.y = user.y - user.speed;
  }
  // game has ended
  // show game over menu and set the score board on the menu
  if (
    user.score == pointsToWin ||
    user2.score == pointsToWin ||
    com.score == pointsToWin
  ) {
    if (GameMode == "multi") {
      gameOverScreen[0].style.display = "block";
      gameOverScore[0].innerText = user.score + " - " + user2.score;
      user.score = 0;
      user2.score = 0;
      GameMode = "ai";
    } else if (GameMode == "single") {
      gameOverScreen[0].style.display = "block";
      gameOverScore[0].innerText = user.score + " - " + com.score;
      user.score = 0;
      com.score = 0;
      GameMode = "ai";
    }
  }

  // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
  if (ball.x - ball.radius < 0 && GameMode == "single") {
    com.score++;
    resetBall();
    startMovingBall("right");
  } else if (ball.x - ball.radius < 0 && GameMode == "multi") {
    user2.score++;
    resetBall();
    startMovingBall("right");
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
    startMovingBall("left");
  }

  // the ball has a velocity
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // when the ball collides with bottom and top walls we inverse the y velocity.
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  // we check if the paddle hit the user or the com paddle
  let player;
  if (GameMode == "multi") {
    player = ball.x + ball.radius < canvas.width / 2 ? user : user2;
  } else if (GameMode == "single") {
    player = ball.x + ball.radius < canvas.width / 2 ? user : com;
  } else if (GameMode == "ai") {
    player = ball.x + ball.radius < canvas.width / 2 ? comLeft : com;
  }

  // if the ball hits a paddle
  if (collision(ball, player)) {
    lastPaddleHit = player;
    //when ball hits the rounded top or bottom of the paddle, it bugs out, so i just teleport the ball into the field to fix that and not have to calcuate the bounce.
    if (ball.left < 30) {
      ball.x += 15;
    }
    if (ball.right > screen.width - 30) {
      ball.x -= 15;
    }

    // change the X and Y velocity direction and accelerate the ball when not in ai mode
    let direction = ball.x + ball.radius < canvas.width / 2 ? -1 : 1;
    if (GameMode != "ai") {
      ball.velocityX = -ball.velocityX - direction * ball.speed;
      ball.velocityY = ball.velocityY + direction * ball.speed;
    } else if (GameMode == "ai") {
      ball.velocityX = -ball.velocityX;
      ball.velocityY = ball.velocityY;
    }
    // this is just to make sure the angle stays always the same
    if (ball.velocityY < 0) {
      if (ball.velocityX < 0) {
        ball.velocityY = ball.velocityX;
      }
      if (ball.velocityX > 0) {
        ball.velocityY = -ball.velocityX;
      }
    }
    if (ball.velocityY > 0) {
      if (ball.velocityX < 0) {
        ball.velocityY = -ball.velocityX;
      }
      if (ball.velocityX > 0) {
        ball.velocityY = ball.velocityX;
      }
    }
  }

  // set simple ai
  if (GameMode == "single") {
    comAI(lastPaddleHit);
  } else if (GameMode == "ai") {
    comAI(lastPaddleHit);
    comLeftAI(lastPaddleHit);
  }
}

function drawPlayerLeft() {
  drawRect(user.x, user.y, user.width, user.height - 20, user.color);
  drawArc(user.x + user.width / 2, user.y, 10, user.color);
  drawArc(user.x + user.width / 2, user.y + user.height - 20, 10, user.color);
}

function drawPlayerRight() {
  drawRect(user2.x, user2.y, user2.width, user2.height - 20, user2.color);
  drawArc(user2.x + user2.width / 2, user2.y, 10, user2.color);
  drawArc(
    user2.x + user2.width / 2,
    user2.y + user2.height - 20,
    10,
    user2.color
  );
}

function drawComLeft() {
  drawRect(
    comLeft.x,
    comLeft.y,
    comLeft.width,
    comLeft.height - 20,
    comLeft.color
  );
  drawArc(comLeft.x + comLeft.width / 2, comLeft.y, 10, comLeft.color);
  drawArc(
    comLeft.x + comLeft.width / 2,
    comLeft.y + comLeft.height - 20,
    10,
    comLeft.color
  );
}

function drawCom() {
  drawRect(com.x, com.y, com.width, com.height - 20, com.color);
  drawArc(com.x + com.width / 2, com.y, 10, com.color);
  drawArc(com.x + com.width / 2, com.y + com.height - 20, 10, com.color);
}

// render function, the function that does al the drawing
function render() {
  // clear the canvas
  drawRect(0, 0, canvas.width, canvas.height, "#1B4186");
  drawNet();

  if (GameMode == "multi") {
    drawPlayerLeft();
    drawPlayerRight();
    ScoreDivl.innerHTML = user.score;
    ScoreDivr.innerHTML = user2.score;
  } else if (GameMode == "single") {
    drawPlayerLeft();
    drawCom();
    ScoreDivl.innerHTML = user.score;
    ScoreDivr.innerHTML = com.score;
  } else if (GameMode == "ai") {
    drawComLeft();
    drawCom();
    ScoreDivl.innerHTML = comLeft.score;
    ScoreDivr.innerHTML = com.score;
  }

  // draw the ball
  drawArc(ball.x, ball.y, ball.radius, ball.color);
}

const resize = () => {
  canvas.width = document.documentElement.clientWidth;
  canvas.height =
    document.documentElement.clientHeight -
    document.documentElement.clientHeight / 10;

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  user.y = (canvas.height - 100) / 2;

  user2.x = canvas.width - 35;
  user2.y = (canvas.height - 150) / 2;

  com.x = canvas.width - 35;
  com.y = (canvas.height - 150) / 2;

  net.x = (canvas.width - 2) / 2;
};

function game() {
  update();
  render();
}

// number of frames per second
let framePerSecond = 90;
let loop = setInterval(game, 1000 / framePerSecond);
