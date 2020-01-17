const canvas = document.getElementById("pong");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - document.documentElement.clientHeight / 10;

const gameOverScreen = document.getElementsByClassName("c-modal-gameover");
const gameOverScore = document.getElementsByClassName("c-menu-score");

// input variables
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var beginVelocityX = (beginVelocityY = 5);
var ballIncrementSpeed = 0.2;
var pointsToWin = 3;

// prediction variables
var prediction = true;
var angle = null; //this is to predict the bounce
var PredictionHitX;
var PredictionHitY;
var PredictionBegin = 80; // between 0 and 80
var PredictionEnd = 60;
var predictionColor = '#7474748d';

//Select mode
let chosenGameMode = "multi"; //when you have chosen a gamemode, then set that game mode to chosenGameMode and GameMode, because GameMode can change during the game and we have to
let GameMode = "multi"; //keep track of what the selected gamemode was.

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
  color: "#4699DB"
};

// User left Paddle left
const user = {
  x: 15, // left side of canvas + 15 pixels space between edge
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 190,
  score: 0,
  speed: 6,
  color: "#F9CE5B"
};

var lastPaddleHit = user;

// User right Paddle right
const user2 = {
  x: canvas.width - 35, // - width of paddle + 15 pixels space between edge
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 190,
  score: 0,
  speed: 6,
  color: "#DEA2F3"
};

// Computer left Paddle right
const comLeft = {
  x: 15, // left side of canvas + 15 pixels space between edge
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 190,
  score: 0,
  speed: 6,
  color: "#F9CE5B"
};

// Computer right Paddle right
const com = {
  x: canvas.width - 35, // - width of paddle
  y: canvas.height / 2 - 150 / 2, // -75 the half height of paddle
  width: 20,
  height: 190,
  score: 0,
  speed: 6,
  color: "#DEA2F3"
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

function drawLine(x, y, xTo, yTo, w, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.setLineDash([5, 2]);
  ctx.moveTo(x, y)
  ctx.lineTo(xTo, yTo);
  ctx.lineWidth = w;
  ctx.stroke();
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
      ball.velocityY = ball.velocityX;
      lastPaddleHit = user2;
    } else if (direction == "right") {
      ball.velocityX = getRndInteger(4.5, 5.5);
      ball.velocityY = - ball.velocityX;
      lastPaddleHit = user;
    }
  } else if (dir > 0.5) {
    if (direction == "left") {
      ball.velocityX = getRndInteger(-4.5, -5.5);
      ball.velocityY = Math.abs(ball.velocityX);
      lastPaddleHit = user2;
    } else if (direction == "right") {
      ball.velocityX = getRndInteger(4.5, 5.5);
      ball.velocityY = ball.velocityX;
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
  ctx.fillStyle = "#96C2E5";
  ctx.font = "75px Neucha";
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
  if (objectif == "center" || objectif == "none") {
    if (paddle.y < y) {
      if (y - paddle.y > 1) {
        paddle.y += paddle.speed / 2;
      }
      if (y - paddle.y < 1) {
        paddle.y += 1;
      }
    }
    if (paddle.y > y) {
      if (paddle.y - y > 1) {
        paddle.y -= paddle.speed / 2;
      }
      if (paddle.y - y < 1) {
        paddle.y -= 1;
      }
    }
  } else if (objectif == "ai") {
    if (paddle.y + paddle.height / 2 < ball.y + ball.radius && paddle.y + paddle.height < canvas.height + 5) {
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

function calcuatePredictionHit(direction){
  if (PredictionHitX == 0 && PredictionHitY == 0 && direction == "up") { // if there is no prediction yet and ball is going up
    PredictionHitX = x;
    PredictionHitY = y;
    for (y; y < (canvas.height - ball.radius); y += (ball.velocityY)) {
      PredictionHitX += (ball.velocityX);
      PredictionHitY += (ball.velocityY);
    }
  }
  if (PredictionHitX == 0 && PredictionHitY == 0 && direction == "down") { // if there is no prediction yet and ball is going down
    PredictionHitX = x;
    PredictionHitY = y;
    for (y; y > ball.radius; y -= Math.abs((ball.velocityY))) {
      PredictionHitX += (ball.velocityX);
      PredictionHitY += (ball.velocityY);
    }
  }
  if(PredictionHitX > canvas.width - 35 || PredictionHitX < 35){ // if prediction is out of boundries set it to nothing
    PredictionHitX = 0;
    PredictionHitY = 0;
  }
}

// update function, the function that does most of the calculations
function update() {
  // check if paddle is too high or too low
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
  if (user.score == pointsToWin || user2.score == pointsToWin || com.score == pointsToWin
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

  // when the ball collides with bottom and top walls, inverse the y velocity.
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  // check if the paddle hit the user or the com paddle
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
      ball.velocityX = -ball.velocityX - (direction * ball.speed);
      ball.velocityY = ball.velocityY + (direction * ball.speed);
    } else if (GameMode == "ai") {
      ball.velocityX = -ball.velocityX;
      ball.velocityY = ball.velocityY;
    }
    // this is just to make sure the angle stays always the same
    if (ball.velocityY < 0) {
      if (ball.velocityX < 0) {
        ball.velocityY = ball.velocityX;
      }
      else if (ball.velocityX > 0) {
        ball.velocityY = -ball.velocityX;
      }
    }
    else if (ball.velocityY > 0) {
      if (ball.velocityX < 0) {
        ball.velocityY = -ball.velocityX;
      }
      else if (ball.velocityX > 0) {
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

  // set prediction angle to make the game easier for kiddo
  y = ball.y;
  x = ball.x;
  if (ball.velocityY > 0 && ball.velocityX > 0 && (ball.y > canvas.height - ball.velocityY * PredictionBegin)) {
    calcuatePredictionHit("up");
    if (PredictionHitX < screen.width - 35) {
      angle = "upRight";
    }
  } else if (ball.velocityY > 0 && ball.velocityX < 0 && (ball.y > canvas.height - ball.velocityY * PredictionBegin)) {
    calcuatePredictionHit("up");
    if (PredictionHitX > 35) {
      angle = "upLeft";
    }
  } else if (ball.velocityY < 0 && ball.velocityX > 0 && (ball.y < Math.abs(ball.velocityY * PredictionBegin))) {
    calcuatePredictionHit("down");
    if (PredictionHitX < screen.width - 35) {
      angle = "downRight";
    }
  } else if (ball.velocityY < 0 && ball.velocityX < 0 && (ball.y < Math.abs(ball.velocityY * PredictionBegin))) {
    calcuatePredictionHit("down");
    if (PredictionHitX > 35) {
      angle = "downLeft";
    }
  } else if (ball.y < (canvas.height / 4) * 3  && (ball.y > (canvas.height / 4))) {
    console.log("test");
    angle = "none";
    PredictionHitX = 0;
    PredictionHitY = 0;
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
  drawArc(user2.x + user2.width / 2, user2.y + user2.height - 20, 10, user2.color
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

function drawPlayersAndScore() {
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
}

function clearCanvas() {
  //drawRect(0, 0, canvas.width, canvas.height, "#1B4186");
  var grd = ctx.createLinearGradient(0, 0, 0, canvas.height - 200);
  grd.addColorStop(0, "White");
  grd.addColorStop(1, "#9DDCFF");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBall() {
  drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function drawPrediction() {
  if (prediction) {
    if (angle == "upRight" && ball.velocityX > 0 && PredictionHitX > (canvas.width / 5)) { // only predict when ball is far enough away from the side that it makes sense to predict the angle
      PredictionEndX = PredictionHitX + (ball.velocityX * PredictionEnd);                  //first calcuate the predictions 2d
      PredictionEndY = (canvas.height - ball.radius) - (Math.abs(ball.velocityY * PredictionEnd));
      x = PredictionEndX;
      for (x; x > (canvas.width - 35); x -= ball.velocityX) {
        PredictionEndY += (Math.abs(ball.velocityY));}
      if (ball.velocityY > 0) { // when ball is still going down, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
        drawLine(ball.x, ball.y, PredictionHitX, PredictionHitY, 2, predictionColor);
        if (PredictionEndX < canvas.width - 35) { // if ball doesnt hit paddle inside prediction
          drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX > canvas.width - 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(PredictionHitX, PredictionHitY, canvas.width - 35, PredictionEndY, 2, predictionColor);}
      } else if (ball.velocityY < 0 && ball.y > PredictionEndY) { // when ball is going up after the bounce, draw line from PredictionHitX to prediction point
        if (PredictionEndX < canvas.width - 35) { // if ball doesnt hit paddle inside prediction
          drawLine(ball.x, ball.y, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX > canvas.width - 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(ball.x, ball.y, canvas.width - 35, PredictionEndY, 2, predictionColor);}}
    }else if (angle == "upLeft" && ball.velocityX < 0 && PredictionHitX < canvas.width - (canvas.width / 5)) { // only predict when ball is far enough away from the side that it makes sense to predict the angle
      PredictionEndX = PredictionHitX + (ball.velocityX * PredictionEnd);                                      //first calcuate the predictions 2d
      PredictionEndY = (canvas.height - ball.radius) - (Math.abs(ball.velocityY * PredictionEnd));
      x = PredictionEndX;
      for (x; x < 35; x -= ball.velocityX) {
        PredictionEndY += (Math.abs(ball.velocityY));}
      if (ball.velocityY > 0) { // when ball is still going down, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
        drawLine(ball.x, ball.y, PredictionHitX, PredictionHitY, 2, predictionColor);
        if (PredictionEndX > 35) { // if ball doesnt hit paddle inside prediction
          drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX < 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(PredictionHitX, PredictionHitY, 35, PredictionEndY, 2, predictionColor);}
      } else if (ball.velocityY < 0 && ball.y > PredictionEndY) { // when ball is going up after the bounce, draw line from PredictionHitX to prediction point
        if (PredictionEndX > 35) { // if ball doesnt hit paddle inside prediction
          drawLine(ball.x, ball.y, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX < 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(ball.x, ball.y, 35, PredictionEndY, 2, predictionColor);}}
    }else if (angle == "downRight" && ball.velocityX > 0 && PredictionHitX > (canvas.width / 5)) { // only predict when ball is far enough away from the side that it makes sense to predict the angle
      PredictionEndX = PredictionHitX + (ball.velocityX * PredictionEnd);                          //first calcuate the predictions 2d
      PredictionEndY = ball.radius + (Math.abs(ball.velocityY * PredictionEnd));
      x = PredictionEndX;
      for (x; x > (canvas.width - 35); x -= ball.velocityX) {
        PredictionEndY -= (Math.abs(ball.velocityY));}
      if (ball.velocityY < 0) { // when ball is still going up, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
        drawLine(ball.x, ball.y, PredictionHitX, PredictionHitY, 2, predictionColor);
        if (PredictionEndX < canvas.width - 35) { // if ball doesnt hit paddle inside prediction
          drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX > canvas.width - 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(PredictionHitX, PredictionHitY, canvas.width - 35, PredictionEndY, 2, predictionColor);}
      } else if (ball.velocityY > 0 && ball.y < PredictionEndY) { // when ball is going down after the bounce, draw line from PredictionHitX to prediction point
        if (PredictionEndX < canvas.width - 35) { // if ball doesnt hit paddle inside prediction
          drawLine(ball.x, ball.y, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX > canvas.width - 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(ball.x, ball.y, canvas.width - 35, PredictionEndY, 2, predictionColor);}}
    }else if (angle == "downLeft" && ball.velocityX < 0 && PredictionHitX < canvas.width - (canvas.width / 5)) { // only predict when ball is far enough away from the side that it makes sense to predict the angle
      PredictionEndX = PredictionHitX + (ball.velocityX * PredictionEnd);                                        //first calcuate the predictions 2d
      PredictionEndY = ball.radius + (Math.abs(ball.velocityY * PredictionEnd));
      x = PredictionEndX;
      for (x; x < 35; x -= ball.velocityX) {
        PredictionEndY -= (Math.abs(ball.velocityY));}
      if (ball.velocityY < 0) { // when ball is still going up, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
        drawLine(ball.x, ball.y, PredictionHitX, PredictionHitY, 2, predictionColor);
        if (PredictionEndX > 35) { // if ball doesnt hit paddle inside prediction
          drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX < 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(PredictionHitX, PredictionHitY, 35, PredictionEndY, 2, predictionColor);}
      } else if (ball.velocityY > 0 && ball.y < PredictionEndY) { // when ball is going down after the bounce, draw line from PredictionHitX to prediction point
        if (PredictionEndX > 35) { // if ball doesnt hit paddle inside prediction
          drawLine(ball.x, ball.y, PredictionEndX, PredictionEndY, 2, predictionColor);
        } else if (PredictionEndX < 35) { /// if ball does hit paddle inside prediction, make prediction shorter
          drawLine(ball.x, ball.y, 35, PredictionEndY, 2, predictionColor);}}
    }
  }
}

// render function, the function that does al the drawing
function render() {
  //console.log(PredictionHitX, + " " + PredictionHitY);
  clearCanvas();
  drawNet();
  drawPlayersAndScore();
  drawBall();
  drawPrediction();
}

function game() {
  update();
  render();
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

// number of frames per second
let framePerSecond = 90;
let loop = setInterval(game, 1000 / framePerSecond);