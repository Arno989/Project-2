// select canvas element
const canvas = document.getElementById("pong");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 100;
//width="1900" height="900"

// select score div
var ScoreDiv = document.getElementById('score');

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext("2d");
console.log(ctx);

// Ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "WHITE"
};

// User Paddle
const user = {
  x: 15, // left side of canvas
  y: (canvas.height - 100) / 2, // -100 the height of paddle
  width: 20,
  height: 150,
  score: 0,
  color: "WHITE"
};

// COM Paddle
const com = {
  x: canvas.width - 35, // - width of paddle
  y: (canvas.height - 150) / 2, // -100 the height of paddle
  width: 20,
  height: 150,
  score: 0,
  color: "WHITE"
};

// NET
const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 1000,
  width: 2,
  color: "#3385FF4d"
};

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// listening to the mouse
//canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
  let rect = canvas.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height / 2;
}

// when COM or USER scores, we reset the ball
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

// draw the net
function drawNet() {
  //for (let i = 0; i <= canvas.height; i += 15) {
    //drawRect(net.x, net.y + i, net.width, net.height, net.color);
  //}
  drawRect(net.x, net.y, net.width, net.height, net.color);
}

// draw text
function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "75px fantasy";
  ctx.fillText(text, x, y);
}

// collision detection
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

// update function, the function that does all calculations
function update() {
  document.onkeydown = checkKey;

  // Check if key is pressed
  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == "38") {
      let rect = canvas.getBoundingClientRect();
      user.y = user.y - 15;
    } else if (e.keyCode == "40") {
      let rect = canvas.getBoundingClientRect();
      user.y = user.y + 15;
    } else if (e.keyCode == "37") {
      let rect = canvas.getBoundingClientRect();
      com.y = com.y - 15;
    } else if (e.keyCode == "39") {
      let rect = canvas.getBoundingClientRect();
      com.y = com.y + 15;
    }
  }

  // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
  if (ball.x - ball.radius < 0) {
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }

  // the ball has a velocity
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // computer plays for itself, and we must be able to beat it
  // simple AI
  //com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

  // when the ball collides with bottom and top walls we inverse the y velocity.
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  // we check if the paddle hit the user or the com paddle
  let player = ball.x + ball.radius < canvas.width / 2 ? user : com;

  // if the ball hits a paddle
  if (collision(ball, player)) {
    // we check where the ball hits the paddle
    let collidePoint = ball.y - (player.y + player.height / 2);
    // normalize the value of collidePoint, we need to get numbers between -1 and 1.
    // -player.height/2 < collide Point < player.height/2
    collidePoint = collidePoint / (player.height / 2);

    // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
    // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
    // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
    // Math.PI/4 = 45degrees
    let angleRad = (Math.PI / 4) * collidePoint;

    // change the X and Y velocity direction
    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // speed up the ball everytime a paddle hits it.
    ball.speed += 0.1;
  }
}

// render function, the function that does al the drawing
function render() {
  // clear the canvas
  drawRect(0, 0, canvas.width, canvas.height, "#1B4186");

  // draw the user score to the left
  ScoreDiv.innerHTML = user.score + ' - ' + com.score;
  //drawText(user.score, canvas.width / 4, canvas.height / 5);

  // draw the COM score to the right
  //drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5);

  // draw the net
  drawNet();

  // draw the user's paddle
  drawRect(user.x, user.y, user.width, user.height, user.color);

  // draw the COM's paddle
  drawRect(com.x, com.y, com.width, com.height, com.color);

  // draw the ball
  drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game() {
  update();
  render();
}
// number of frames per second
let framePerSecond = 90;

let loop = setInterval(game, 1000/framePerSecond);
