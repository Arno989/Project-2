const canvas = document.getElementById('pong');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 90;

const gameOverScreen =  document.getElementsByClassName("c-modal-gameover");
const gameOverScore =  document.getElementsByClassName("c-menu-score");

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var pointsToWin = 15;
//Select mode
let GameMode = 'single';

var ScoreDivl = document.getElementById('score-l');
var ScoreDivr = document.getElementById('score-r');

const ctx = canvas.getContext('2d');
console.log(ctx);

const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 20,
	velocityX: 5,
	velocityY: 5,
	speed: 0.2,
	color: 'WHITE'
};

// User Paddle left
const user = {
	x: 15, // left side of canvas
	y: (canvas.height - 100) / 2, // -100 the height of paddle
	width: 20,
	height: 150,
	score: 0,
	speed: 4,
	color: "WHITE"
};

// User Paddle right
const user2 = {
	x: canvas.width - 35, // - width of paddle
	y: (canvas.height - 150) / 2, // -100 the height of paddle
	width: 20,
	height: 150,
	score: 0,
	speed: 4,
	color: "WHITE"
};

const com = {
	x: canvas.width - 35, // - width of paddle
	y: (canvas.height - 150) / 2, // -100 the height of paddle
	width: 20,
	height: 150,
	score: 0,
	speed: 4,
	color: "WHITE"
};

const net = {
	x: (canvas.width - 2) / 2,
	y: 0,
	height: 1000,
	width: 2,
	color: '#3385FF4d'
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

function resetBall() {
	ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = 5;
  ball.velocityY = 5;
	ball.speed = 0.5;
}

function drawNet() {
	drawRect(net.x, net.y, net.width, net.height, net.color);

	//for (let i = 0; i <= canvas.height; i += 15) {
	//drawRect(net.x, net.y + i, net.width, net.height, net.color);
	//}
}

function drawText(text, x, y) {
	ctx.fillStyle = '#FFF';
	ctx.font = '75px fantasy';
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

	return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function clickRestart(){
	gameOverScreen[0].style.display = "none";
	if (GameMode == 'multi') {
		gameOverScore[0].text = user.score + " - " + user2.score;
	} else if (GameMode == 'single') {
		gameOverScore[0].text = user.score + " - " + com.score;
		console.log("set score");
	}
	user.score = 0;
	user.score = 0;
	com.score = 0;
}

function keyDownHandler(event) {
	if (event.keyCode == 39) {
		rightPressed = true;
	}else if (event.keyCode == 37) {
		leftPressed = true;
	}else if (event.keyCode == 40) {
		downPressed = true;
	}else if (event.keyCode == 38) {
		upPressed = true;
	}
}

function keyUpHandler(event) {
	if (event.keyCode == 39) {
		rightPressed = false;
	}else if (event.keyCode == 37) {
		leftPressed = false;
	}else if (event.keyCode == 40) {
		downPressed = false;
	}else if (event.keyCode == 38) {
		upPressed = false;
	}
}

// update function, the function that does all calculations
function update() {
  // check if paddle is too high or to low
	if (user2.y < 10) {
		leftPressed = false;
	}else if (user2.y > canvas.height - user2.height) {
		rightPressed = false;
	}else if (user.y < 10) {
		upPressed = false
	}else if (user.y > canvas.height - user.height) {
		downPressed = false;
	}

	// Check if key is pressed between the modes
	if (rightPressed && GameMode == "multi") {
		user2.y = user2.y + user2.speed;
	}if (leftPressed && GameMode == "multi") {
		user2.y = user2.y - user2.speed;
	}if (rightPressed && GameMode == "single") {
		com.y = com.y - com.speed;
	}if (leftPressed && GameMode == "single") {
		com.y = com.y + com.speed;
	}if (downPressed) {
		user.y = user.y + user.speed;
	}if (upPressed) {
		user.y = user.y - user.speed;
	}
  
  // show game over menu and set the score board on the menu
	if (GameMode == 'multi' && user.score == pointsToWin || user2.score == pointsToWin) {
		gameOverScreen[0].style.display = "block";
		gameOverScore[0].innerText = user.score + " - " + user2.score;
	} else if (GameMode == 'single' && user.score == pointsToWin || com.score == pointsToWin) {
		gameOverScreen[0].style.display = "block";
		gameOverScore[0].innerText = user.score + " - " + com.score;
	}

	// change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
	if (ball.x - ball.radius < 0 && GameMode == 'single') {
		com.score++;
		resetBall();
	} else if (ball.x - ball.radius < 0 && GameMode == 'multi') {
		user2.score++;
		resetBall();
	} else if (ball.x + ball.radius > canvas.width) {
		user.score++;
		resetBall();
	}

	// the ball has a velocity
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	// when the ball collides with bottom and top walls we inverse the y velocity.
	if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
		ball.velocityY = -ball.velocityY;
	}

	// we check if the paddle hit the user or the com paddle and set simple computer AI
	let player;
	if (GameMode == 'multi') {
		player = ball.x + ball.radius < canvas.width / 2 ? user : user2;
	} else if (GameMode == 'single') {
		// simple AI
		com.y += (ball.y - (com.y + com.height / 2)) * 0.1;
		player = ball.x + ball.radius < canvas.width / 2 ? user : com;
	}

	// if the ball hits a paddle
	if (collision(ball, player)) {
		// we check where the ball hits the paddle
		let collidePoint = ball.y - (player.y + player.height / 2);
		// normalize the value of collidePoint, we need to get numbers between -1 and 1.
		collidePoint = collidePoint / (player.height / 2);
    let angleRad = (Math.PI / 4) * collidePoint;

		// change the X and Y velocity direction
		let direction = ball.x + ball.radius < canvas.width / 2 ? -1 : 1;
		//ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		//ball.velocityY = ball.speed * Math.sin(angleRad);
		ball.velocityX = -ball.velocityX - (direction * ball.speed);
    ball.velocityY = ball.velocityY + (direction * ball.speed);
    if(ball.velocityY < 0){
      if(ball.velocityX < 0){
        ball.velocityY = ball.velocityX;
      }
      if(ball.velocityX > 0){
        ball.velocityY = -ball.velocityX;
      }
    }
    if(ball.velocityY > 0){
      if(ball.velocityX < 0){
        ball.velocityY = -ball.velocityX;
      }
      if(ball.velocityX > 0){
        ball.velocityY = ball.velocityX;
      }
    }
    console.log(ball.velocityX);
    console.log(ball.velocityY);
	}
}

function drawPlayerLeft() {
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawArc(user.x + user.width / 2, user.y, 10, user.color);
	drawArc(user.x + user.width / 2, user.y + user.height, 10, user.color);
}

function drawPlayerRight() {
	drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
	drawArc(user2.x + user2.width / 2, user2.y, 10, user2.color);
	drawArc(user2.x + user2.width / 2, user2.y + user2.height, 10, user2.color);
}

function drawCom() {
	drawRect(com.x, com.y, com.width, com.height, com.color);
	drawArc(com.x + com.width / 2, com.y, 10, com.color);
	drawArc(com.x + com.width / 2, com.y + com.height, 10, com.color);
}

// render function, the function that does al the drawing
function render() {
	// clear the canvas
	drawRect(0, 0, canvas.width, canvas.height, '#1B4186');
	drawNet();
	drawPlayerLeft();

	if (GameMode == 'multi') {
		// draw the user's right paddle
		drawPlayerRight();
		// draw the user score
		ScoreDivl.innerHTML = user.score;
		ScoreDivr.innerHTML = user2.score;
	} else if (GameMode == 'single') {
		// draw the COM's  paddle
		drawCom();
		// draw the user score
		ScoreDivl.innerHTML = user.score;
		ScoreDivr.innerHTML = com.score;
	}

	// draw the ball
	drawArc(ball.x, ball.y, ball.radius, ball.color);
}

const resize = () => {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight - 90;

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
