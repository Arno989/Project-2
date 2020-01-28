//global variables
let index,
	gameOver,
	makey,
	hartMain,
	connect,
	main,
	gamemode,
	highscores,
	playerOneConnected = false,
	betweenConnections = false,
	playerTwoConnected = false,
	countHeartRate1 = 0,
	countHeartRate2 = 0,
	progressbar = -84,
	countHeartRate = 10,
	pl = false,
	pr = false,
	modeChoiceSingle,
	modeChoiceMulti,
	modeChoiceWall;

//callbacks na dataophalen
const verwerkHighScores = function(data) {
	console.log(data);
	let d = `
	<tr>
		<th>
			<p>Plaats</p>
		</th>
		<th>
			<p>Naam</p>
		</th>
		<th>
			<p>Score</p>
		</th>
	</tr>`;
	data.forEach(function(element, i) {
		d += `
		<tr>
			<td>
				<p class="u-margin-reset">${i + 1}</p>
			</td>
			<td>
				<p class="u-margin-reset">${element.naam}</p>
			</td>
			<td>
				<p class="u-margin-reset">${element.score}</p>
			</td>
		</tr>`;
	});
	document.querySelector('.js-scoreboard').innerHTML = d;
};

//bluetooth connector
const bluetooth = function(y) {
	navigator.bluetooth
		.requestDevice({
			filters: [
				{
					services: ['battery_service']
				},
				{
					services: ['heart_rate']
				}
			]
		})
		.then(device => {
			connectDevice(device, 'heart_rate', 'heart_rate_measurement', y);
		})
		.then(x => {
			document.querySelector('.js-tekenConnectie').style.display = 'none';
			document.querySelector('.js-loading').style.display = 'block';
			document.querySelector('.js-btn-connect-player').disabled = true;
		})
		.catch(error => {
			document.querySelector('.js-tekenConnectie').src = '/img/svg/kruis.svg';
			console.log(error);
		});
};

//connect heartRateMonitor followed by battery service
const connectDevice = function(device, server, service, y) {
	device.gatt
		.connect()
		.then(a => {
			return a.getPrimaryService(server);
		})
		.then(b => {
			return b.getCharacteristic(service);
		})
		.then(c => {
			return c.startNotifications();
		})
		.then(d => {
			if (server === 'heart_rate') {
				d.addEventListener('characteristicvaluechanged', function() {
					//hier hebben we de hartslag
					if (y === 1) {
						countHeartRate1 += 1;
						//console.log('hartslag 1: ' + parseHeartRate(d.value).heartRate);
						document.querySelector('.js-heart-l').innerHTML = parseHeartRate(d.value).heartRate;
						if (countHeartRate1 === 5) {
							speed = getDuration(parseHeartRate(d.value).heartRate);
							document.querySelector('.js-heart-l-img').style.animationDuration = speed;
							document.querySelector('.js-heart-l').style.animationDuration = speed;
							countHeartRate1 = 0;
						}
					} else {
						countHeartRate2 += 1;
						//console.log('hartslag 2: ' + parseHeartRate(d.value).heartRate);
						document.querySelector('.js-heart-r').innerHTML = parseHeartRate(d.value).heartRate;
						if (countHeartRate2 === 5) {
							speed = getDuration(parseHeartRate(d.value).heartRate);
							document.querySelector('.js-heart-r-img').style.animationDuration = speed;
							document.querySelector('.js-heart-r').style.animationDuration = speed;
							countHeartRate2 = 0;
						}
					}
				});
				connectDevice(device, 'battery_service', 'battery_level', y);
			} else if (server === 'battery_service') {
				d.readValue()
					.then(e => {
						if (y === 1) {
							document.querySelector('.js-tekenConnectie').style.display = 'block';
							document.querySelector('.js-loading').style.display = 'none';
							document.querySelector('.js-tekenConnectie').src = '/img/svg/vink.svg';

							btn = document.querySelector('.js-btn-connect-player');
							btn.innerHTML = 'Doorgaan naar speler 2';
							btn.disabled = false;

							playerOneConnected = true;

							if (e.getUint8(0) == 10) {
								console.log('warning, low battery');
							}

							/* document.querySelector('.js-bar-three').style.width = (100 / 6) * 4 + '%'; */
						} else {
							document.querySelector('.js-tekenConnectie').style.display = 'block';
							document.querySelector('.js-loading').style.display = 'none';
							document.querySelector('.js-tekenConnectie').src = '/img/svg/vink.svg';

							btn = document.querySelector('.js-btn-connect-player');
							btn.innerHTML = 'Doorgaan';
							btn.disabled = false;

							playerTwoConnected = true;

							/* document.querySelector('.js-bar-three').style.width = (100 / 6) * 6 + '%'; 
							document.querySelector('.js-bar-three').style.borderRadius = '250px 250px 250px 250px';*/
						}
						if (e.getUint8(0) == 10) {
							console.log('warning, low battery on device ' + y);
						}
					})
					.catch(error => {
						document.querySelector('.js-tekenConnectie').src = '/img/svg/kruis.svg';
						document.querySelector('.js-tekenConnectie').style.display = 'block';
						document.querySelector('.js-loading').style.display = 'none';
						document.querySelector('.js-btn-connect-player').disabled = false;
					});
				d.addEventListener('characteristicvaluechanged', function() {
					d.readValue()
						.then(e => {
							//hier hebben we de batterijstatus
							//console.log('batterij: ' + y + ' ' + e.getUint8(0));
							//e.getUint8(0) ---> geeft de batterijstatus
							//y geeft welke batterij het is
							//einde batterij eventlistener
							//dit wordt 7 keer per seconde afgevuurd
						})
						.catch(error => {
							document.querySelector('.js-tekenConnectie').src = '/img/svg/kruis.svg';
							document.querySelector('.js-tekenConnectie').style.display = 'block';
							document.querySelector('.js-loading').style.display = 'none';
							document.querySelector('.js-btn-connect-player').disabled = false;
							if (y === 1) {
								playerOneConnected = false;
								betweenConnections = false;
								playerTwoConnected = false;
							} else {
								playerTwoConnected = false;
							}
							document.querySelector('.js-btn-connect-player').innerHTML = 'Verbind opnieuw';
						});
				});
			}
		})
		.catch(error => {
			document.querySelector('.js-tekenConnectie').src = '/img/svg/kruis.svg';
			document.querySelector('.js-tekenConnectie').style.display = 'block';
			document.querySelector('.js-loading').style.display = 'none';
			document.querySelector('.js-btn-connect-player').disabled = false;
		});
};

const parseHeartRate = function(value) {
	value = value.buffer ? value : new DataView(value);
	let result = {};
	result.heartRate = value.getUint8(1);
	return result;
};

const getDuration = function(heartRate) {
	if (heartRate == 0) {
		return 0 + 's';
	}
	return 1 / (heartRate / 60) + 's';
};

const setbetweenConnections = function() {
	betweenConnections = true;
	document.querySelector('.js-tekenConnectie').src = '/img/svg/kruis.svg';
	document.querySelector('.js-btn-connect-player').innerHTML = 'Verbind speler 2';
	document.querySelector('.js-hartslag-title').innerHTML = 'Hartslagmeter 2';

	/* document.querySelector('.js-bar-three').style.width = (100 / 6) * 5 + '%'; */
};

//setup for bluetooth connection pages

const setConnect = function() {
	btnPlayer = document.querySelector('.js-btn-connect-player');
	document.querySelector('.js-hartslag-title').innerHTML = 'Hartslagmeter 1';

	btnPlayer.addEventListener('click', function() {
		if (!playerOneConnected) {
			bluetooth(1);
			setProgress(4);
		} else if (!playerTwoConnected) {
			if (!betweenConnections) {
				setbetweenConnections();
				setProgress(5);
			} else {
				bluetooth(2);
				setProgress(6);
			}
		} else {
			gotoPos('right', 100);
		}
	});
};

const setPage = function(page) {
	info = document.querySelector('.js-harslagmeter-info');
	connect = document.querySelector('.js-harslagmeter-connect');

	switch (page) {
		case 'heart':
			info.style.display = 'flex';
			connect.style.display = 'none';
			setHeartMain();
			break;
		case 'connect':
			info.style.display = 'none';
			connect.style.display = 'flex';
			setConnect();
			break;
		default:
			info.style.display = 'none';
			connect.style.display = 'none';
			break;
	}
};

// Backend connections

const setHighScore = function() {
	handleData('https://project2function.azurewebsites.net/api/highscore', verwerkHighScores);
};

// progress bar

const setProgress = function(position) {
	bar = document.querySelector('.js-loadingbar-completed');
	bar.style.transform = 'translateX(' + progressbar + '%)';
	console.log('translateX(' + progressbar + '%)');
	setTimeout(function() {
		bar.style.transform = 'translateX(' + (-100 + (100 / 6) * position) + '%)';
		console.log('translateX(' + (-100 + (100 / 6) * position) + '%)');
	}, 500);
	progressbar = -100 + (100 / 6) * position;
};

// avatars

const getAvatar = function(name) {
	switch (name) {
		case 'Ape':
			return './img/Avatars/Ape.png';
		case 'Cat':
			return './img/Avatars/Cat.png';
		case 'Cow':
			return './img/Avatars/Cow.png';
		case 'Dog':
			return './img/Avatars/Dog.png';
		case 'Dolphin':
			return './img/Avatars/Dolphin.png';
		case 'Fish':
			return './img/Avatars/Fish.png';
		case 'Flamingo':
			return './img/Avatars/Flamingo.png';
		case 'Lion':
			return './img/Avatars/Lion.png';
		case 'Penguin':
			return './img/Avatars/Penguin.png';
		case 'Goat':
			return './img/Avatars/Goat2.0.png';
		case 'Ping':
			return './img/Avatars/Ping.png';
		case 'Shark':
			return './img/Avatars/Shark.png';
		case 'Snake':
			return './img/Avatars/Snake.png';
		case 'Koala':
			return './img/Avatars/Koala.png';
		case 'Turtle':
			return './img/Avatars/Turtle.png';

		default:
			return './img/Avatars/Ape.png';
	}
};

//countdown animation
/*
ml.timelines = {};

ml.playComposition = function(comp) {
	var compID = comp.querySelector('h1').className;
	ml.timelines[compID].play();
};

ml.restartComposition = function(comp) {
	var compID = comp.querySelector('h1').className;
	ml.timelines[compID].restart();
};

ml.pauseComposition = function(comp) {
	var compID = comp.querySelector('h1').className;
	ml.timelines[compID].pause();
};

var ml4 = {};
ml4.opacityIn = [0, 1];
ml4.scaleIn = [0.2, 1];
ml4.scaleOut = 3;
ml4.durationIn = 800;
ml4.durationOut = 600;
ml4.delay = 500;

ml.timelines['ml4'] = anime
	.timeline({ loop: true })
	.add({
		targets: '.ml4 .letters-1',
		opacity: ml4.opacityIn,
		scale: ml4.scaleIn,
		duration: ml4.durationIn
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
		opacity: ml4.opacityIn,
		scale: ml4.scaleIn,
		duration: ml4.durationIn
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
		opacity: ml4.opacityIn,
		scale: ml4.scaleIn,
		duration: ml4.durationIn
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
		duration: 500,
		delay: 500
	});

ml.playComposition('ml4');

*/

// Initialize
const initPages = function() {
	btnBack = document.querySelector('.js-btn-back');
	btnConnect = document.querySelector('.js-btn-connect');

	btnSingle = document.querySelector('.js-btn-single');
	btnMulti = document.querySelector('.js-btn-multi');
	btnWall = document.querySelector('.js-btn-wall');
	btnStart = document.querySelector('.js-btn-start');

	btnHighscores = document.querySelector('.js-btn-highscores');
	highscores = document.querySelector('.js-highscores');

	progress = document.querySelector('.js-setProgress');
	close = document.querySelectorAll('.js-modal-close');

	avatartitle = document.querySelector('.js-avatar-title');
	avatars = document.querySelectorAll('.js-avatar-item');
	avatarl = document.querySelector('.js-avatar-l');
	avatarr = document.querySelector('.js-avatar-r');

	modeChoiceSingle = document.querySelector('.js-mode-single');
	modeChoiceMulti = document.querySelector('.js-mode-multi');
	modeChoiceWall = document.querySelector('.js-mode-wall');

	btnBack.addEventListener('click', function() {
		setProgress(2);
		setPage('heart');
	});
	btnConnect.addEventListener('click', function() {
		setProgress(3);
		setPage('connect');
	});

	// btnSingle.addEventListener('click', function() {
	// 	setPage();
	// 	gamemode = 'single';
	// });
	// btnMulti.addEventListener('click', function() {
	// 	setPage();
	// 	gamemode = 'multi';
	// });
	// btnWall.addEventListener('click', function() {
	// 	setPage();
	// 	gamemode = 'wall';
	// });
	btnStart.addEventListener('click', function() {
		setPage();
		startGame(true, gamemode);
	});

	btnHighscores.addEventListener('click', function() {
		setHighScore();
		highscores.style.display = 'block';
	});

	progress.addEventListener('click', function() {
		setProgress(2);
	});

	close.forEach(element => {
		element.addEventListener('click', function() {
			this.style.display = 'none';
		});
	});

	avatars.forEach(element => {
		element.addEventListener('click', function() {
			if (pl != true) {
				element.style.filter = 'drop-shadow(0 0px 16px rgba(109, 241, 0, 0.555))';
				avatarl.src = getAvatar(element.id);
				console.log(avatarl.src);
				pl = true;
				avatartitle.innerHTML = 'Speler 2, kies je avatar.';
			} else if (pr != true) {
				element.style.filter = 'drop-shadow(0 0px 16px rgba(255, 0, 0, 0.459))';
				avatarr.src = getAvatar(element.id);
				console.log(avatarl.src);
				pr = true;
				avatartitle.innerHTML = 'Klik op verder om te spelen.';
			}
		});
	});

	modeChoiceSingle.addEventListener('click', function() 
	{
		modeChoiceSingle.style.border = "10px solid #e5c9ef";
		modeChoiceMulti.style.border = "10px solid #FFFFFF";
		modeChoiceWall.style.border = "10px solid #FFFFFF";
		gamemode = "single";
	});

	modeChoiceMulti.addEventListener('click', function() 
	{
		modeChoiceSingle.style.border = "10px solid #FFFFFF";
		modeChoiceMulti.style.border = "10px solid #e5c9ef";
		modeChoiceWall.style.border = "10px solid #FFFFFF";
		gamemode = "multi";
	});

	modeChoiceWall.addEventListener('click', function() 
	{
		modeChoiceSingle.style.border = "10px solid #FFFFFF";
		modeChoiceMulti.style.border = "10px solid #FFFFFF";
		modeChoiceWall.style.border = "10px solid #e5c9ef";
		gamemode = "wall";
	});
};

document.addEventListener('DOMContentLoaded', function() {
	initPages();
});
