const canvas = document.getElementById('pong');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - document.documentElement.clientHeight / 10;
const ctx = canvas.getContext('2d');

// buttons and game screens and event listeners
window.addEventListener('blur', pauseOn); // detect when user is not on page, so tabbed out or focus onother window
let ScoreDivl = document.querySelector('.js-score-l');
let ScoreDivr = document.querySelector('.js-score-r');
let ScoreDivc = document.querySelector('.js-score-c');
let gameOverScreen = null;
let gameOverScore = null;
let gamePausedScreen = null;
let highscoresGameScreen = null;
let countDownScreen = null;
let infoScreen = null;
let btnAgain = null;
let btnMain = null;
let btnResume = null;
let btnMainPause = null;

//sound
var scoreSound = new sound('sounds/mp3/score.mp3');
var scoreAgainstSound = new sound('sounds/mp3/lose.mp3');
var gameStartSound = new sound('sounds/mp3/start.mp3');
var gameWonSound = new sound('sounds/mp3/win.mp3');
var bounceSound = new sound('sounds/bounce.mp3');
var threeTwoSound = new sound('sounds/mp3/threeTwoOne.mp3');
var clickSound = new sound('sounds/mp3/click.mp3');
var playSound = new sound('sounds/wav/play.wav')

//debug variables
let bounceY = false;
let bounceX = false;
let animation;
let animationInfo;

// input variables
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('keypress', logKey);
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var speedDownPressed = false;
var speedUpPressed = false;

// user variables, you can change these
var beginVelocityX = (beginVelocityY = 4.5);
var chosenVelocity = 4.5;
var increasementSpeed = 0.1;
var increasementSpeedByUser = 0.03;
var pointsToWin = 3;

// game variables, you should not change these
var chosenGameMode = 'single'; //when you have chosen a gamemode, then set that game mode to chosenGameMode and GameMode, because GameMode can change during the game and we have to
var GameMode = 'single'; //keep track of what the selected gamemode was.
var gameLoop = null;
var gameState = false;
var animeLoop = null;
var animeState = false;
var timerInterval = null;
var timerLoop = true;
var framePerSecond = 90; // number of frames per second
var lastPaddleHit;

// prediction variables
var prediction = true;
var angle = null; //this is to predict the bounce
var PredictionHitX;
var PredictionHitY;
var PredictionBeginStatic = 360; // pixels * begin velocity(4.5)
var PredictionEndStatic = 135;
var predictionColor = '#7474746d';
var pixelsFromBall = 0;

// anime vars
var ml4 = {};
ml4.opacityIn = [0, 1];
ml4.scaleIn = [0.5, 1];
ml4.scaleOut = 7;
ml4.durationIn = 500;
ml4.durationOut = 500;
ml4.delay = 0;

const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 20,
	velocityX: beginVelocityX,
	velocityY: beginVelocityY,
	speed: increasementSpeed,
	color: '#4699DB'
};

const wall = {
	x: canvas.width - 35,
	y: 0,
	width: 35,
	height: canvas.height,
	score: 0,
	color: 'White'
};

// User left Paddle left
const user = {
	x: 15, // left side of canvas + 15 pixels space between edge
	y: canvas.height / 2 - 190 / 2, // -75 the half height of paddle without half circles
	width: 20,
	height: 190,
	score: 0,
	speed: 6,
	color: '#F9CE5B'
};

// User right Paddle right
const user2 = {
	x: canvas.width - 35, // - width of paddle + 15 pixels space between edge
	y: canvas.height / 2 - 190 / 2, // -75 the half height of paddle without half circles
	width: 20,
	height: 190,
	score: 0,
	speed: 6,
	color: '#DEA2F3'
};

// Computer left Paddle right
const comLeft = {
	x: 15, // left side of canvas + 15 pixels space between edge
	y: canvas.height / 2 - 190 / 2, // -75 the half height of paddle without half circles
	width: 20,
	height: 190,
	score: 0,
	speed: 6,
	color: '#F9CE5B'
};

// Computer right Paddle right
const com = {
	x: canvas.width - 35, // - width of paddle
	y: canvas.height / 2 - 190 / 2, // -75 the half height of paddle without half circles
	width: 20,
	height: 190,
	score: 0,
	speed: 6,
	color: '#DEA2F3'
};

const net = {
	x: (canvas.width - 2) / 2,
	y: 0,
	height: 1000,
	width: 2,
	color: '#3385FF4d'
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
	ctx.moveTo(x, y);
	ctx.lineTo(xTo, yTo);
	ctx.lineWidth = w;
	ctx.stroke();
}

function drawNet() {
	drawRect(net.x, net.y, net.width, net.height, net.color);
}

function drawText(text, x, y) {
	ctx.fillStyle = '#96C2E5';
	ctx.font = '75px Neucha';
	ctx.fillText(text, x, y);
}

function logKey(event) {
	var key = event.keyCode;
	if (key == 112 || key == 32) {
		if (gameState == true) {
			//gameState = false;
			pauseOn();
		}
	}
}

function keyDownHandler(event) {
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 71) {
		speedDownPressed = true;
	}
	if (event.keyCode == 72) {
		speedUpPressed = true;
	}
}

function keyUpHandler(event) {
	if (event.keyCode == 39) {
		rightPressed = false;
	}
	if (event.keyCode == 37) {
		leftPressed = false;
	}
	if (event.keyCode == 40) {
		downPressed = false;
	}
	if (event.keyCode == 38) {
		upPressed = false;
	}
	if (event.keyCode == 71) {
		speedDownPressed = false;
	}
	if (event.keyCode == 72) {
		speedUpPressed = false;
	}
}

function clickResume() {
	gameLoop = setInterval(game, 1000 / framePerSecond);
	gameState = true;
	gamePausedScreen.style.display = 'none';
}

function clickMainPaused() {
	clickMain();
}

function clickMain() {
	document.querySelector('.c-winner').style.display = 'none';
	user.score = 0;
	user2.score = 0;
	com.score = 0;
	comLeft.score = 0;
	wall.score = 0;
	gotoPos('left', 300);
	resetBall();
	resetPaddles();
	resetGameMode();
	playSound.stop();
	clearInterval(gameLoop);
	gameOverScreen.style.display = 'none';
	gamePausedScreen.style.display = 'none';
	gameState = false;
}

function clickRestart() {
	document.querySelector('.c-winner').style.display = 'none';
	gameOverScreen = document.querySelector('.js-gameOver');
	resetBall();
	resetPaddles();
	startMovingBall('right');
	render();
	gameOverScreen.style.display = 'none';
	/* reset ball speed */
	user.score = 0;
	user2.score = 0;
	com.score = 0;
	comLeft.score = 0;
	wall.score = 0;
	GameMode = chosenGameMode;
	setTimer();
}

function comAI(playerHit) {
	console.log(playerHit.x);
	if (playerHit.x == 15) {
		movePaddleTo(com, ball.y, 'ai');
	} else if (com.y > canvas.height / 2 && playerHit.x == canvas.width - 35) {
		movePaddleTo(com, canvas.height / 2 - com.height / 2, 'center');
	} else if (com.y < canvas.height / 2 && playerHit.x == canvas.width - 35) {
		movePaddleTo(com, canvas.height / 2 - com.height / 2, 'center');
	}
}

function comLeftAI(playerHit) {
	if (playerHit.x == canvas.width - 35) {
		movePaddleTo(comLeft, ball.y, 'ai');
	} else if (comLeft.y > canvas.height / 2 && playerHit.x == 15) {
		movePaddleTo(comLeft, canvas.height / 2 - com.height / 2, 'center');
	} else if (comLeft.y < canvas.height / 2 && playerHit.x == 15) {
		movePaddleTo(comLeft, canvas.height / 2 - com.height / 2, 'center');
	}
}

function resetBall() {
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.velocityX = beginVelocityX;
	ball.velocityY = beginVelocityY;
	prediction = false;
}

function resetPaddles() {
	user.x = 15;
	user.y = canvas.height / 2 - 190 / 2;
	user2.x = canvas.width - 35;
	user2.y = canvas.height / 2 - 190 / 2;
	comLeft.x = 15;
	comLeft.y = canvas.height / 2 - 190 / 2;
	com.x = canvas.width - 35;
	com.y = canvas.height / 2 - 190 / 2;
}

function doHighscores()
{
	highscoresGameScreen = document.querySelector(".js-gameHighscores");
	if(highscoresGameScreen.style.display == '' || highscoresGameScreen.style.display == 'none'){
		console.log("showing highscores");
		highscoresGameScreen.style.display = 'block';
	}
	GameMode = "ai";
}

function pauseOn() {
	gameOverScreen = document.querySelector('.js-gameOver');
	highscoresGameScreen = document.querySelector(".js-gameHighscores");
	if(highscoresGameScreen.style.display == '' || highscoresGameScreen.style.display == 'none'){
		if(gameOverScreen.style.display == '' || gameOverScreen.style.display == 'none'){
			if (gameLoop != null && timerLoop == false) 
			{
				console.log('paused');
				gamePausedScreen = document.querySelector('.js-gamePaused');
				gamePausedScreen.style.display = 'block';
				clearInterval(gameLoop);
				gameState = false;
				btnResume = document.querySelector('.js-btn-resume');
				btnMainPause = document.querySelector('.js-btn-mainPagePaused');
				btnResume.addEventListener('click', clickResume);
				btnMainPause.addEventListener('click', clickMainPaused);
				playSound.volume(0.2);
			}
		}
	}
}

function startMovingBall(direction) {
	// start moving the ball in the chosen direction and sets the speed and velocity to standard.
	console.log(chosenVelocity + ' start ball');
	ball.speed = increasementSpeed;
	ball.velocityY = chosenVelocity;
	ball.velocityX = chosenVelocity;
	let dir = getRndInteger(0, 1);
	if (dir < 0.5) {
		if (direction == 'left') {
			ball.velocityX = chosenVelocity;
			ball.velocityY = chosenVelocity;
			lastPaddleHit = user2;
		} else if (direction == 'right') {
			ball.velocityX = chosenVelocity;
			ball.velocityY = -chosenVelocity;
			lastPaddleHit = user;
		}
	} else if (dir > 0.5) {
		if (direction == 'left') {
			ball.velocityX = -chosenVelocity;
			ball.velocityY = chosenVelocity;
			lastPaddleHit = user2;
		} else if (direction == 'right') {
			ball.velocityX = chosenVelocity;
			ball.velocityY = chosenVelocity;
			lastPaddleHit = user;
		}
	}
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

function movePaddleTo(paddle, y, objectif) {
	if (objectif == 'center' || objectif == 'none') {
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
	} else if (objectif == 'ai') {
		// center the paddle if in ai mode
		if (paddle.y + paddle.height / 2 < ball.y + ball.radius && paddle.y + (paddle.height + paddle.width / 2) < canvas.height) {
			paddle.y += paddle.speed;
		}
		if (paddle.y > ball.y) {
			paddle.y -= paddle.speed;
		}
	}
}

function calcuatePredictionHit(direction) {
	PredictionHitX = 0;
	PredictionHitY = 0;
	if (direction == 'up') {
		// if there is no prediction yet and ball is going up
		PredictionHitX = x;
		PredictionHitY = y;
		for (y; y < canvas.height - ball.radius; y += ball.velocityY) {
			PredictionHitX += ball.velocityX;
			PredictionHitY += ball.velocityY;
		}
	}
	if (direction == 'down') {
		// if there is no prediction yet and ball is going down
		PredictionHitX = x;
		PredictionHitY = y;
		for (y; y > ball.radius; y -= Math.abs(ball.velocityY)) {
			PredictionHitX += ball.velocityX;
			PredictionHitY += ball.velocityY;
		}
	}
	if (PredictionHitX > canvas.width - 35 || PredictionHitX < 35) {
		// if prediction is out of boundries set it to nothing
		PredictionHitX = 0;
		PredictionHitY = 0;
	}
}

// update function, the function that does most of the calculations
function update() {
	gameState = true;
	console.log(chosenVelocity);

	// the ball has a velocity
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	PredictionBegin = PredictionBeginStatic / Math.abs(ball.velocityX); // this is to keep the prediction end and begining always the same
	PredictionEnd = PredictionEndStatic / Math.abs(ball.velocityX); // if you want it to depend on the velocity, then delete these 2 lines and rename the vars to the same name without "static".

	if (speedDownPressed == true && GameMode != 'ai') {
		//controlls to speed up and down the ball when pressed h or g
		if (ball.velocityX >= 1 && ball.velocityY >= 1) {
			ball.velocityX -= increasementSpeedByUser;
			ball.velocityY -= increasementSpeedByUser;
		} else if (ball.velocityX >= 1 && ball.velocityY <= -1) {
			ball.velocityX -= increasementSpeedByUser;
			ball.velocityY += increasementSpeedByUser;
		} else if (ball.velocityX <= -1 && ball.velocityY >= 1) {
			ball.velocityX += increasementSpeedByUser;
			ball.velocityY -= increasementSpeedByUser;
		} else if (ball.velocityX <= -1 && ball.velocityY <= -1) {
			ball.velocityX += increasementSpeedByUser;
			ball.velocityY += increasementSpeedByUser;
		}
		if (Math.abs(ball.velocityX) < beginVelocityX) {
			chosenVelocity = ball.velocityX;
		}
	} else if (speedUpPressed == true && GameMode != 'ai') {
		if (ball.velocityX >= 1 && ball.velocityY >= 1) {
			ball.velocityX += increasementSpeedByUser;
			ball.velocityY += increasementSpeedByUser;
		} else if (ball.velocityX >= 1 && ball.velocityY <= -1) {
			ball.velocityX += increasementSpeedByUser;
			ball.velocityY -= increasementSpeedByUser;
		} else if (ball.velocityX <= -1 && ball.velocityY >= 1) {
			ball.velocityX -= increasementSpeedByUser;
			ball.velocityY += increasementSpeedByUser;
		} else if (ball.velocityX <= -1 && ball.velocityY <= -1) {
			ball.velocityX -= increasementSpeedByUser;
			ball.velocityY -= increasementSpeedByUser;
		}
		if (Math.abs(ball.velocityX) < beginVelocityX) {
			chosenVelocity = ball.velocityX;
		}
	}
	ball.velocityX.toFixed(1); //keep the velocity to 1 number after the comma
	ball.velocityY.toFixed(1);
	if (ball.velocityX < 1 && ball.velocityX > 0) {
		//make sure the user cant stop the ball by making the velocity lower than 1
		ball.velocityX = 1;
	} else if (ball.velocityX > -1 && ball.velocityX < 0) {
		ball.velocityX = -1;
	}
	if (ball.velocityY < 1 && ball.velocityY > 0) {
		ball.velocityY = 1;
	} else if (ball.velocityY > -1 && ball.velocityY < 0) {
		ball.velocityY = -1;
	}

	// check if paddle is too high or too low
	if (user2.y - user2.width / 2 <= 0) {
		leftPressed = false;
		user2.y = user.width / 2;
	}
	if (user2.y + user2.height + user2.width / 2 >= canvas.height) {
		rightPressed = false;
		user2.y = canvas.height - (user2.height + user2.width / 2);
	}
	if (user.y - user.width / 2 <= 0) {
		upPressed = false;
		user.y = user.width / 2;
	}
	if (user.y + user.height + user.width / 2 >= canvas.height) {
		downPressed = false;
		user.y = canvas.height - (user.height + user.width / 2);
	}

	// Check if key is pressed between the modes
	if (rightPressed && GameMode == 'multi') {
		user2.y = user2.y + user2.speed;
	}
	if (leftPressed && GameMode == 'multi') {
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
	if (GameMode != 'wall') {
		if (user.score >= pointsToWin || user2.score >= pointsToWin || com.score >= pointsToWin) {
			gameOverScore = document.querySelector('.js-menu-score');
			gameOverScreen = document.querySelector('.js-gameOver');
			if (GameMode == 'multi') {
				gameOverScreen.style.display = 'block';
				gameOverScore.innerText = 'Gewonnen!';
				gameWonSound.play();
				GameMode = 'ai';
				document.querySelector('.c-winner').style.display = 'block';
				document.querySelector('.js-winner-avatar').src = user.score > user2.score ? document.querySelector('.js-avatar-l').src : document.querySelector('.js-avatar-r').src;
			} else if (GameMode == 'single') {
				if (com.score > user.score) {
					gameOverScore.innerText = 'verloren!';
				} else {
					gameOverScore.innerText = 'Gewonnen!';
					document.querySelector('.c-winner').style.display = 'block';
					document.querySelector('.js-winner-avatar').src = document.querySelector('.js-avatar-l').src;
					gameWonSound.play();
				}
				gameOverScreen.style.display = 'block';
				GameMode = 'ai';
			}
			if (btnAgain == null) {
				btnAgain = document.querySelector('.js-btn-again');
				btnAgain.addEventListener('click', clickRestart);
			}
			if (btnMain == null) {
				btnMain = document.querySelector('.js-btn-mainPage');
				btnMain.addEventListener('click', clickMain);
			}
		}
	} else if (GameMode == 'wall' && wall.score > 0) {
		doHighscores();
		bounceY = false;
		bounceX = false;
		lastPaddleHit.x = 15;
		GameMode = 'ai';
		wall.score = 0;
	}

	// change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
	if (ball.x - ball.radius < 0 && GameMode == 'single') {
		com.score++;
		resetBall();
		resetPaddles();
		startMovingBall('right');
		scoreAgainstSound.play();
		if (com.score < pointsToWin) {
			setTimer();
		}
	} else if (ball.x - ball.radius < 0 && GameMode == 'multi') {
		if (playerDouble == 'right') {
			user2.score += 2;
		} else if (playerDouble == 'none' || playerDouble == 'left') {
			user2.score++;
		}
		resetBall();
		resetPaddles();
		startMovingBall('right');
		scoreSound.play();
		if (user2.score < pointsToWin) {
			setTimer();
		}
	} else if (ball.x - ball.radius < 0 && GameMode == 'wall') {
		wall.score++;
		resetBall();
		scoreAgainstSound.play();
	} else if (ball.x + ball.radius > canvas.width && GameMode != 'wall') {
		console.log('links user scoort');
		console.log(playerDouble);
		if (playerDouble == 'left') {
			user.score += 2;
		} else if (playerDouble == 'right' || playerDouble == 'none') {
			user.score++;
		}
		resetBall();
		resetPaddles();
		startMovingBall('left');
		scoreSound.play();
		if (user.score < pointsToWin) {
			setTimer();
		}
	}

	// when the ball collides with bottom and top walls, inverse the y velocity.
	if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
		if (GameMode == 'ai') {
			ball.velocityY = -ball.velocityY;
		} else if (bounceY == false) {
			// make sure it only bounces once, this bugged a lot
			ball.velocityY = -ball.velocityY;
			bounceY = true;
		}
	}
	if (bounceY == true && ball.y < canvas.height - 10 && ball.y > 10) {
		// make sure the bounce gets reset after it bounced, this was to fix the bug from above
		bounceY = false;
	}

	// check if the paddle hit the user or the com paddle
	let player;
	if (GameMode == 'multi') {
		player = ball.x + ball.radius < canvas.width / 2 ? user : user2;
	} else if (GameMode == 'single') {
		player = ball.x + ball.radius < canvas.width / 2 ? user : com;
	} else if (GameMode == 'ai') {
		player = ball.x + ball.radius < canvas.width / 2 ? comLeft : com;
	} else if (GameMode == 'wall') {
		player = ball.x + ball.radius < canvas.width / 2 ? user : wall;
	}

	// if the ball hits a paddle
	if (collision(ball, player)) {
		// if the ball hits a paddle
		bounceSound.play();
		//when ball hits the rounded top or bottom of the paddle
		if (player.x == 15) {
			// left hit
			if (ball.bottom > player.top - user.width / 4 && ball.bottom < player.top + player.width / 3 && ball.velocityY > 0) {
				ball.velocityY = -ball.velocityY;
			} else if (ball.top < player.bottom + user.width / 4 && ball.top > player.bottom - player.width / 3 && ball.velocityY < 0) {
				ball.velocityY = -ball.velocityY;
			}
		} else if (player.x == canvas.width - 35) {
			// right hit
			if (ball.bottom > player.top - user.width / 4 && ball.bottom < player.top + player.width / 3 && ball.velocityY > 0) {
				ball.velocityY = -ball.velocityY;
			} else if (ball.top < player.bottom + user.width / 4 && ball.top > player.bottom - player.width / 3 && ball.velocityY < 0) {
				ball.velocityY = -ball.velocityY;
			}
		}

		// change the X and Y velocity direction and accelerate the ball when not in ai mode and add score in wall mode
		let direction = ball.x + ball.radius < canvas.width / 2 ? -1 : 1;
		if (GameMode != 'ai') {
			if (bounceX == false) {
				// this is to fix a bug where the ball keeps bouncing on a paddle
				if (GameMode == 'wall' && player.x == 15) {
					// add 1 point to user when in wall mode and collide with user paddle.
					scoreSound.play();
					user.score += 1;
					prediction = false;
				}
				ball.velocityX = -ball.velocityX - direction * ball.speed;
				ball.velocityY = ball.velocityY + direction * ball.speed;
				bounceX = true;
			}
		} else if (GameMode == 'ai') {
			ball.velocityX = -ball.velocityX;
			ball.velocityY = ball.velocityY;
		}
		// this is just to make sure the angle stays always the same
		if (bounceX == true) {
			if (ball.velocityY < 0) {
				if (ball.velocityX < 0) {
					ball.velocityY = ball.velocityX;
				} else if (ball.velocityX > 0) {
					ball.velocityY = -ball.velocityX;
				}
			} else if (ball.velocityY > 0) {
				if (ball.velocityX < 0) {
					ball.velocityY = -ball.velocityX;
				} else if (ball.velocityX > 0) {
					ball.velocityY = ball.velocityX;
				}
			}
		}
		lastPaddleHit = player;
	}
	if (ball.x > user.right + ball.velocityX * 5 && ball.x < user2.x - ball.velocityX * 5 && bounceX == true) {
		// this is for that bug where the ball keeps bouncing on the paddle
		bounceX = false;
	}

	// set simple ai and prediction
	if (GameMode == 'single') {
		comAI(lastPaddleHit);
		prediction = true;
	} else if (GameMode == 'multi') {
		prediction = true;
	} else if (GameMode == 'ai') {
		comAI(lastPaddleHit);
		comLeftAI(lastPaddleHit);
		prediction = false;
	} else if (GameMode == 'wall') {
		prediction = true;
		if (lastPaddleHit.x == 15) {
			prediction = false;
		}
	}

	// set prediction angle to make the game easier for kiddo
	y = ball.y;
	x = ball.x;
	if (ball.velocityY > 0 && ball.velocityX > 0 && ball.y > canvas.height - ball.velocityY * PredictionBegin) {
		calcuatePredictionHit('up');
		if (PredictionHitX < screen.width - 35) {
			angle = 'upRight';
		}
	} else if (ball.velocityY > 0 && ball.velocityX < 0 && ball.y > canvas.height - ball.velocityY * PredictionBegin) {
		calcuatePredictionHit('up');
		if (PredictionHitX > 35) {
			angle = 'upLeft';
		}
	} else if (ball.velocityY < 0 && ball.velocityX > 0 && ball.y < Math.abs(ball.velocityY * PredictionBegin)) {
		calcuatePredictionHit('down');
		if (PredictionHitX < screen.width - 35) {
			angle = 'downRight';
		}
	} else if (ball.velocityY < 0 && ball.velocityX < 0 && ball.y < Math.abs(ball.velocityY * PredictionBegin)) {
		calcuatePredictionHit('down');
		if (PredictionHitX > 35) {
			angle = 'downLeft';
		}
	} else if (ball.y < (canvas.height / 4) * 3 && ball.y > canvas.height / 4) {
		angle = 'none';
		PredictionHitX = 0;
		PredictionHitY = 0;
	}
}

function drawWall() {
	drawRect(wall.x, wall.y, wall.width, wall.height, wall.color);
}

function drawPlayerLeft() {
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawArc(user.x + user.width / 2, user.y, user.width / 2, user.color);
	drawArc(user.x + user.width / 2, user.y + user.height, user.width / 2, user.color);
}

function drawPlayerRight() {
	drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);
	drawArc(user2.x + user2.width / 2, user2.y, user2.width / 2, user2.color);
	drawArc(user2.x + user2.width / 2, user2.y + user2.height, user2.width / 2, com.color);
}

function drawComLeft() {
	drawRect(comLeft.x, comLeft.y, comLeft.width, comLeft.height, comLeft.color);
	drawArc(comLeft.x + comLeft.width / 2, comLeft.y, comLeft.width / 2, comLeft.color);
	drawArc(comLeft.x + comLeft.width / 2, comLeft.y + comLeft.height, comLeft.width / 2, comLeft.color);
}

function drawCom() {
	drawRect(com.x, com.y, com.width, com.height, com.color);
	drawArc(com.x + com.width / 2, com.y, com.width / 2, com.color);
	drawArc(com.x + com.width / 2, com.y + com.height, com.width / 2, com.color);
}

function drawPlayersAndScore() {
	if (GameMode == 'multi') {
		drawPlayerLeft();
		drawPlayerRight();
		ScoreDivl.innerHTML = user.score;
		ScoreDivr.innerHTML = user2.score;
		ScoreDivc.innerHTML = '-';
	} else if (GameMode == 'single') {
		drawPlayerLeft();
		drawCom();
		ScoreDivl.innerHTML = user.score;
		ScoreDivr.innerHTML = com.score;
		ScoreDivc.innerHTML = '-';
	} else if (GameMode == 'ai') {
		drawComLeft();
		drawCom();
		ScoreDivc.innerHTML = '';
	} else if (GameMode == 'wall') {
		drawWall();
		drawPlayerLeft();
		ScoreDivl.innerHTML = null;
		ScoreDivr.innerHTML = null;
		ScoreDivc.innerHTML = user.score;
	}
}

function clearCanvas() {
	//drawRect(0, 0, canvas.width, canvas.height, "#1B4186");
	var grd = ctx.createLinearGradient(0, 0, 0, canvas.height - 200);
	grd.addColorStop(0, '#EEF7FE');
	grd.addColorStop(1, '#9DDCFF');
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBall() {
	drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function drawPrediction() {
	if (prediction) {
		if (angle == 'upRight' && ball.velocityX > 0 && PredictionHitX > canvas.width / 5) {
			// only predict when ball is far enough away from the side that it makes sense to predict the angle
			PredictionEndX = PredictionHitX + ball.velocityX * PredictionEnd; //first calcuate the predictions 2d
			PredictionEndY = canvas.height - ball.radius - Math.abs(ball.velocityY * PredictionEnd);
			x = PredictionEndX;
			for (x; x > canvas.width - 35; x -= ball.velocityX) {
				PredictionEndY += Math.abs(ball.velocityY);
			}
			if (ball.velocityY > 0) {
				// when ball is still going down, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
				drawLine(ball.x + (ball.radius + pixelsFromBall), ball.y + (ball.radius + pixelsFromBall), PredictionHitX, PredictionHitY, 1.5, predictionColor);
				if (PredictionEndX < canvas.width - 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX > canvas.width - 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(PredictionHitX, PredictionHitY, canvas.width - 35, PredictionEndY, 1.5, predictionColor);
				}
			} else if (ball.velocityY < 0 && ball.y > PredictionEndY) {
				// when ball is going up after the bounce, draw line from PredictionHitX to prediction point
				if (PredictionEndX < canvas.width - 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(ball.x + (ball.radius + pixelsFromBall), ball.y - (ball.radius + pixelsFromBall), PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX > canvas.width - 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(ball.x + (ball.radius + pixelsFromBall), ball.y - (ball.radius + pixelsFromBall), canvas.width - 35, PredictionEndY, 1.5, predictionColor);
				}
			}
		} else if (angle == 'upLeft' && ball.velocityX < 0 && PredictionHitX < canvas.width - canvas.width / 5) {
			// only predict when ball is far enough away from the side that it makes sense to predict the angle
			PredictionEndX = PredictionHitX + ball.velocityX * PredictionEnd; //first calcuate the predictions 2d
			PredictionEndY = canvas.height - ball.radius - Math.abs(ball.velocityY * PredictionEnd);
			x = PredictionEndX; // this is to predict where the x position will be when the ball bounces off to the other direction
			for (x; x < 35; x -= ball.velocityX) {
				// this is to "look into the future" and predict where the y position of the ball will be when x(in the future) is bouncing off.
				PredictionEndY += Math.abs(ball.velocityY);
			}
			if (ball.velocityY > 0) {
				// when ball is still going down, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
				drawLine(ball.x - (ball.radius + pixelsFromBall), ball.y + (ball.radius + pixelsFromBall), PredictionHitX, PredictionHitY, 1.5, predictionColor);
				if (PredictionEndX > 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX < 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(PredictionHitX, PredictionHitY, 35, PredictionEndY, 1.5, predictionColor);
				}
			} else if (ball.velocityY < 0 && ball.y > PredictionEndY) {
				// when ball is going up after the bounce, draw line from PredictionHitX to prediction point
				if (PredictionEndX > 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(ball.x - (ball.radius + pixelsFromBall), ball.y - (ball.radius + pixelsFromBall), PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX < 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(ball.x - (ball.radius + pixelsFromBall), ball.y - (ball.radius + pixelsFromBall), 35, PredictionEndY, 1.5, predictionColor);
				}
			}
		} else if (angle == 'downRight' && ball.velocityX > 0 && PredictionHitX > canvas.width / 5) {
			// only predict when ball is far enough away from the side that it makes sense to predict the angle
			PredictionEndX = PredictionHitX + ball.velocityX * PredictionEnd; //first calcuate the predictions 2d
			PredictionEndY = ball.radius + Math.abs(ball.velocityY * PredictionEnd);
			x = PredictionEndX;
			for (x; x > canvas.width - 35; x -= ball.velocityX) {
				PredictionEndY -= Math.abs(ball.velocityY);
			} // this is to "look into the future" and predict where the y position of the ball will be when x(in the future) is bouncing off.
			if (ball.velocityY < 0) {
				// when ball is still going up, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
				drawLine(ball.x + (ball.radius + pixelsFromBall), ball.y - (ball.radius + pixelsFromBall), PredictionHitX, PredictionHitY, 1.5, predictionColor);
				if (PredictionEndX < canvas.width - 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX > canvas.width - 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(PredictionHitX, PredictionHitY, canvas.width - 35, PredictionEndY, 1.5, predictionColor);
				}
			} else if (ball.velocityY > 0 && ball.y < PredictionEndY) {
				// when ball is going down after the bounce, draw line from PredictionHitX to prediction point
				if (PredictionEndX < canvas.width - 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(ball.x + (ball.radius + pixelsFromBall), ball.y + (ball.radius + pixelsFromBall), PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX > canvas.width - 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(ball.x + (ball.radius + pixelsFromBall), ball.y + (ball.radius + pixelsFromBall), canvas.width - 35, PredictionEndY, 1.5, predictionColor);
				}
			}
		} else if (angle == 'downLeft' && ball.velocityX < 0 && PredictionHitX < canvas.width - canvas.width / 5) {
			// only predict when ball is far enough away from the side that it makes sense to predict the angle
			PredictionEndX = PredictionHitX + ball.velocityX * PredictionEnd; //first calcuate the predictions 2d
			PredictionEndY = ball.radius + Math.abs(ball.velocityY * PredictionEnd);
			x = PredictionEndX;
			for (x; x < 35; x -= ball.velocityX) {
				PredictionEndY -= Math.abs(ball.velocityY);
			} // this is to "look into the future" and predict where the y position of the ball will be when x(in the future) is bouncing off.
			if (ball.velocityY < 0) {
				// when ball is still going up, draw line from ball to PredictionHitX and from PredictionHitX to prediction point
				drawLine(ball.x - (ball.radius + pixelsFromBall), ball.y - (ball.radius + pixelsFromBall), PredictionHitX, PredictionHitY, 1.5, predictionColor);
				if (PredictionEndX > 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(PredictionHitX, PredictionHitY, PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX < 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(PredictionHitX, PredictionHitY, 35, PredictionEndY, 1.5, predictionColor);
				}
			} else if (ball.velocityY > 0 && ball.y < PredictionEndY) {
				// when ball is going down after the bounce, draw line from PredictionHitX to prediction point
				if (PredictionEndX > 35) {
					// if ball doesnt hit paddle inside prediction
					drawLine(ball.x - (ball.radius + pixelsFromBall), ball.y + (ball.radius + pixelsFromBall), PredictionEndX, PredictionEndY, 1.5, predictionColor);
				} else if (PredictionEndX < 35) {
					/// if ball does hit paddle inside prediction, make prediction shorter
					drawLine(ball.x - (ball.radius + pixelsFromBall), ball.y + (ball.radius + pixelsFromBall), 35, PredictionEndY, 1.5, predictionColor);
				}
			}
		}
	}
}

function sound(src) 
{
	this.sound = document.createElement('audio');
	this.sound.src = src;
	this.sound.setAttribute('preload', 'auto');
	this.sound.setAttribute('controls', 'none');
	this.sound.style.display = 'none';
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	};
	this.stop = function() {
		this.sound.pause();
	};
	this.volume = function(v) 
	{
		this.sound.volume = v;	
	};
};

function setTimer() {
	doAnime();
	console.log('anime');
}

function doInfo() {
	console.log("do info anime");
	var textWrapper = document.querySelector('.ml7 .letters');
	textWrapper.innerHTML = 'De eerste met 11 punten wint!';
	if (GameMode == 'wall') {
		textWrapper.innerHTML = 'Haal zo veel mogelijk punten!';
	}
	textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

	if (animationInfo == null) {
		animationInfo = anime
			.timeline()
			.add({
				targets: '.ml7 .letter',
				translateY: ['1.1em', 0],
				translateX: ['0.55em', 0],
				translateZ: 0,
				rotateZ: [180, 0],
				duration: 500,
				easing: 'easeOutExpo',
				delay: (el, i) => 40 * i
			})
			.add({
				targets: '.ml7',
				opacity: 0,
				duration: 1000,
				easing: 'easeOutExpo',
				delay: 1000
			});
	} else {
		animationInfo.restart();
		animationInfo = anime
			.timeline()
			.add({
				targets: '.ml7 .letter',
				translateY: ['1.1em', 0],
				translateX: ['0.55em', 0],
				translateZ: 0,
				rotateZ: [180, 0],
				duration: 500,
				easing: 'easeOutExpo',
				delay: (el, i) => 40 * i
			})
			.add({
				targets: '.ml7',
				opacity: 0,
				duration: 1000,
				easing: 'easeOutExpo',
				delay: 1000
			});
	}
}

function doAnime() 
{
	console.log(' 3 2 1 ');
	timerLoop = true;
	threeTwoSound.play();

	animation = anime
		.timeline()
		.add({
			targets: '.ml4 .letters-1',
			translateY: ['5em', 0],
			opacity: ml4.opacityIn,
			scale: ml4.scaleIn,
			duration: ml4.durationIn,
			color: '#F07575'
		})
		.add({
			targets: '.ml4 .letters-1',
			opacity: 0,
			scale: ml4.scaleOut,
			duration: ml4.durationOut,
			easing: 'easeInExpo',
			delay: ml4.delay
		})
		.add({
			targets: '.ml4 .letters-2',
			translateY: ['5em', 0],
			opacity: ml4.opacityIn,
			scale: ml4.scaleIn,
			duration: ml4.durationIn,
			color: '#FBDB86'
		})
		.add({
			targets: '.ml4 .letters-2',
			opacity: 0,
			scale: ml4.scaleOut,
			duration: ml4.durationOut,
			easing: 'easeInExpo',
			delay: ml4.delay
		})
		.add({
			targets: '.ml4 .letters-3',
			translateY: ['5em', 0],
			opacity: ml4.opacityIn,
			scale: ml4.scaleIn,
			duration: ml4.durationIn,
			color: '#7AD8A0'
		})
		.add({
			targets: '.ml4 .letters-3',
			opacity: 0,
			scale: ml4.scaleOut,
			duration: ml4.durationOut,
			easing: 'easeInExpo',
			delay: ml4.delay
		})
		.add({
			targets: '.ml4',
			opacity: 0,
			duration: 0,
			delay: 0
		});
}

// render function, the function that does al the drawing
function render() {
	clearCanvas();
	drawNet();
	drawPlayersAndScore();
	drawBall();
	drawPrediction();
}

function game() 
{
	if (animation.completed) 
	{
		timerLoop = false;
		update();
		render();
		playSound.play();
		playSound.volume(1);
	}
}

function loopAnime() {
	if (animationInfo.completed && animeState == false) {
		console.log(' anime 3 2 1 ');
		countDownScreen = document.querySelector('.js-countdown');
		countDownScreen.style.display = 'block';
		doAnime();
		animeState = true;
		gameLoop = setInterval(game, 1000 / framePerSecond);
		gameState = true;
	}
}

const resize = () => {
	console.log('resize');
	pauseOn();
	prediction = false;

	gameOverScreen = document.querySelector('.js-gameOver');

	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight - document.documentElement.clientHeight / 10;

	user.x = 15;
	user.y = (canvas.height - user.height) / 2;

	user2.x = canvas.width - 35;
	user2.y = (canvas.height - user2.height) / 2;

	comLeft.x = 15;

	com.x = canvas.width - 35;

	wall.x = canvas.width - 35;
	wall.height = canvas.height;

	net.x = (canvas.width - net.width) / 2;
	resetBall();
	render();
};

function startGame(state, mode_p) {
	console.log('start game');
	gameLoop = null;
	clearInterval(gameLoop);
	console.log(gameLoop);
	if (gameLoop == null || mode_p == 'ai') {
		chosenGameMode = mode_p;
		GameMode = mode_p;
		lastPaddleHit = user;
		bounceX = false;
		bounceY = false;
		if (state) {
			gameStartSound.play();
			animeState = false;
			infoScreen = document.querySelector('.js-info');
			infoScreen.style.display = 'block';
			doInfo();
			animeLoop = setInterval(loopAnime, 1000 / framePerSecond);
			render();
		} else {
			gameState = false;
			resetBall();
		}
	}
	/* document.querySelector('.js-restmode').style.display = 'block';
			calmDown(); */
	console.log(heartRateRight + ', ' + heartRateLeft);
	document.querySelector('.js-info').style.display = 'block';
}
