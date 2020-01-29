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
	heartRateLeft = 0,
	heartRateRight = 0,
	playerDouble = 'none',
	place = 123,
	lastavatar,
	selectedAvatarl,
	selectedAvatarr,
	plaatsInScoreBoard;

const verwerkHighScoresWithNewRecord3 = function(data) 
{
	console.log("lengte van data: " + data.length);

	let d = 
	`<tr>
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

	if(data.length > plaatsInScoreBoard)
	{
		for(let i = 0; i < plaatsInScoreBoard-1; i++)
		{
			d += 
			`<tr>
				<td>
					<p class="u-margin-reset">${i + 1}</p>
				</td>
				<td>
					<p class="u-margin-reset">${data[i].naam}</p>
				</td>
				<td>
					<p class="u-margin-reset">${data[i].score}</p>
				</td>
			</tr>`;
		}
		d +=
		`<tr class="c-scoreboard-new">
			<td>
				<p class="u-margin-reset">${plaatsInScoreBoard}</p>
			</td>
			<td>
				<input class="c-scoreboard-input js-name" type="text" autofocus/>
			</td>
			<td>
				<p class="u-margin-reset">${user.score}</p>
			</td>
		</tr>`;
		for(let i = plaatsInScoreBoard-1; i < data.length; i++)
		{
			d += 
			`<tr>
				<td>
					<p class="u-margin-reset">${i + 2}</p>
				</td>
				<td>
					<p class="u-margin-reset">${data[i].naam}</p>
				</td>
				<td>
					<p class="u-margin-reset">${data[i].score}</p>
				</td>
			</tr>`;
		}
	}
	else
	{
		data.forEach(function (element, i) {
			d += 
			`<tr>
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
		d += 
		`<tr class="c-scoreboard-new">
			<td>
				<p class="u-margin-reset">${plaatsInScoreBoard}</p>
			</td>
			<td>
				<input class="c-scoreboard-input js-name" type="text" autofocus/>
			</td>
			<td>
				<p class="u-margin-reset">${user.score}</p>
			</td>
		</tr>`;
	}
	document.querySelectorAll('.js-loading-score')[1].style.display = 'none';
	document.querySelectorAll('.c-scoreboard')[1].style.display = 'table';
	document.querySelectorAll('.js-scoreboard')[1].innerHTML = d;
	tbName = document.querySelector('.js-name');
	tbName.focus();
	document.querySelector('.js-btn-annuleren').addEventListener('click', function() 
	{
		highscoresGameScreen.style.display = 'none';
		document.querySelector('.js-gameOver').style.display = "block";
	});
	document.querySelector('.js-btn-save').addEventListener('click', function() 
	{
		let y = tbName.value.trim();
		if(y)
		{
			x = `{'score': ${user.score},'naam': '${tbName.value}','mode': 0}`;
			try {
				handleData('https://project2function.azurewebsites.net/api/highscore', callbackPost, methode = "POST", body = x);
				Swal.fire({
					title: '<strong>Succesvol opgeslaan</strong>',
					imageUrl: './img/svg/vink.svg',
					showCloseButton: true,
					focusConfirm: false,
					confirmButtonText: 'Super!',
					confirmButtonAriaLabel: 'Super!'
				});
			} catch (error) {
				Swal.fire({
					title: '<strong>Fout bij opslaan</strong>',
					imageUrl: './img/svg/vink.svg',
					showCloseButton: true,
					focusConfirm: false,
					confirmButtonText: 'Verder',
					confirmButtonAriaLabel: 'Verder'
				});
			}
			highscoresGameScreen.style.display = 'none';
			document.querySelector('.js-gameOver').style.display = "block";
		}
		else
		{
			Swal.fire({
				title: '<strong>Vul je naam in om te kunnen opslaan</strong>',
				imageUrl: './img/svg/alert.svg',
				showCloseButton: true,
				focusConfirm: false,
				confirmButtonText: 'Ok',
				confirmButtonAriaLabel: 'Ok'
			});
		}
	});
};

const callbackPost = function(data) 
{
	console.log(data);
};

const verwerkHighScoresWithNewRecord2 = function(data) {
	plaatsInScoreBoard = data;
	handleData(`https://project2function.azurewebsites.net/api/highscore/5`, verwerkHighScoresWithNewRecord3);
};

const verwerkHighScoresWithNewRecord = function(score) {
	handleData(`https://project2function.azurewebsites.net/api/place/${score}`, verwerkHighScoresWithNewRecord2);
};

//callbacks na data ophalen
const verwerkHighScores = function(data) {
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
	document.querySelector('.js-loading-score').style.display = 'none';
	document.querySelector('.c-scoreboard').style.display = 'table';
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
			console.log('probleem bij verbinden');
		});
};

//connect heartRateMonitor followed by battery service
const connectDevice = function(device, server, service, y) {
	if (y === 1) {
		//sessionStorage.setItem('device1', device);
	} else {
		//sessionStorage.setItem('device2', device);
	}
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
							heartRateLeft = parseHeartRate(d.value).heartRate;
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
							heartRateRight = parseHeartRate(d.value).heartRate;
						}
					}
					if (gamemode == 'multi') {
						if (playerOneConnected && playerTwoConnected) {
							if (heartRateLeft > heartRateRight) {
								document.querySelector('.js-flame-l').style.display = 'block';
								document.querySelector('.js-flame-r').style.display = 'none';
								playerDouble = 'left';
							} else if (heartRateLeft === heartRateRight) {
								document.querySelector('.js-flame-l').style.display = 'none';
								document.querySelector('.js-flame-r').style.display = 'none';
								playerDouble = 'none';
							} else {
								document.querySelector('.js-flame-l').style.display = 'none';
								document.querySelector('.js-flame-r').style.display = 'block';
								playerDouble = 'right';
							}
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
							btn.innerHTML = 'Doorgaan';
							btn.disabled = false;

							playerOneConnected = true;
							setProgress(4);
							/* document.querySelector('.js-bar-three').style.width = (100 / 6) * 4 + '%'; */
						} else {
							document.querySelector('.js-tekenConnectie').style.display = 'block';
							document.querySelector('.js-loading').style.display = 'none';
							document.querySelector('.js-tekenConnectie').src = '/img/svg/vink.svg';

							btn = document.querySelector('.js-btn-connect-player');
							btn.innerHTML = 'Doorgaan';
							btn.disabled = false;

							playerTwoConnected = true;
							setProgress(6);
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
						console.log('probleem bij verbinden');
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
				d.addEventListener('', function() {
					console.log(device);
				});
			}
		})
		.catch(error => {
			document.querySelector('.js-tekenConnectie').src = '/img/svg/kruis.svg';
			document.querySelector('.js-tekenConnectie').style.display = 'block';
			document.querySelector('.js-loading').style.display = 'none';
			document.querySelector('.js-btn-connect-player').disabled = false;
			console.log('probleem bij verbinden');
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
	document.querySelector('.js-polar-instructions').src = './img/Hartslagmeter2.svg';
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
		} else if (!playerTwoConnected) {
			if (!betweenConnections) {
				setbetweenConnections();
				setProgress(5);
			} else {
				bluetooth(2);
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
	setTimeout(function() {
		bar.style.transform = 'translateX(' + (-100 + (100 / 6) * position) + '%)';
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
		case 'Pig':
			return './img/Avatars/Pig.png';
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

function resetGameMode() {
	gamemode = 'null';

	modeChoiceSingle.style.border = '10px solid #FFFFFF';
	modeChoiceMulti.style.border = '10px solid #FFFFFF';
	modeChoiceWall.style.border = '10px solid #FFFFFF';

	avatarl.src = '';
	avatarr.src = '';
	pl = false;
	pr = false;
}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

// Initialize
const initPages = function() {
	btnBack = document.querySelector('.js-btn-back');
	btnConnect = document.querySelector('.js-btn-connect');

	btnMainPage = document.querySelector('.js-btn-mainPage');

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
	modeStartButton = document.querySelector('.js-mode-start');

	backbuttonmode = document.querySelector('.js-clear-selection-mode');
	backbuttonavatar = document.querySelector('.js-clear-selection-avatar');

	btnNext = document.querySelector('.js-btn-next');
	btnBackAvatar = document.querySelector('.js-btn-back-avatar');

	btnBack.addEventListener('click', function() {
		setProgress(2);
		setPage('heart');
	});
	btnConnect.addEventListener('click', function() {
		setProgress(3);
		setPage('connect');
	});
	btnStart.addEventListener('click', function() {
		startGame(true, gamemode);
		avatars.forEach(element => {
			element.style.filter = '';
			element.addEventListener('click', function() {
				clickSound.play();
			});
		});
		lastavatar = '';

		avatarl.src = selectedAvatarl.src;
		/* selectedAvatarr ? avatarr.src = selectedAvatarr.src :''; */

		selectedAvatarl = '';
		selectedAvatarr = '';

		pl = false;
		pr = false;
		avatartitle.innerHTML = 'Speler 1, kies je avatar.';
		btnStart.style.display = 'none';
		document.querySelector('.js-clear-selection-avatar').style.display = 'block';
		document.querySelector('.js-btn-back-avatar').style.display = 'none';
	});

	btnMainPage.addEventListener('click', function() {
		pl = false;
		pr = false;
		avatartitle.innerHTML = 'Speler 1, kies je avatar.';
		btnStart.style.display = 'none';
	});
	btnHighscores.addEventListener('click', function() {
		setHighScore();
		highscores.style.display = 'block';
	});
	progress.addEventListener('click', function() {
		setProgress(2);
	});
	btnNext.addEventListener('click', function() {
		btnNext.style.display = 'none';
		lastavatar != '' ? (selectedAvatarl = lastavatar) : '';
		avatarl.src = getAvatar(selectedAvatarl.id);
		pl = true;
		lastavatar ? (lastavatar.style.filter = '') : '';
		selectedAvatarl.style.filter = 'opacity(.5)';
		avatartitle.innerHTML = 'Speler 2, kies je avatar.';
		document.querySelector('.js-clear-selection-avatar').style.display = 'none';
		document.querySelector('.js-btn-back-avatar').style.display = 'block';
	});
	close.forEach(element => {
		element.addEventListener('click', function() {
			this.style.display = 'none';
		});
	});

	document.querySelector('.js-btn-back-avatar').addEventListener('click', function() {
		lastavatar ? (lastavatar.style.filter = '') : '';
		avatarr.src = '';
		pr = false;
		pl = false;
		selectedAvatarl ? (selectedAvatarl.style.filter = 'opacity(.5)') : '';
		avatartitle.innerHTML = 'Speler 1, kies je avatar.';
		btnNext.style.display = 'block';
		document.querySelector('.js-clear-selection-avatar').style.display = 'block';
		document.querySelector('.js-btn-back-avatar').style.display = 'none';
		btnStart.style.display = 'none';
	});

	avatars.forEach(element => {
		element.addEventListener('click', function() {
			clickSound.play();
			switch (gamemode) {
				case 'single':
					if (pl != true) {
						lastavatar ? (lastavatar.style.filter = '') : '';
						element.style.filter = 'opacity(.5)';
						lastavatar = element;

						selectedAvatarl = element;
						avatarr.src = './img/Avatars/Robot.png';
						avatartitle.innerHTML = 'Klik op verder om te spelen.';
						btnStart.style.display = 'block';

						document.querySelector('.js-heart-r').style.display = 'none';
						document.querySelector('.js-heart-l').style.display = 'none';
						document.querySelector('.js-heart-r-img').style.display = 'none';
						document.querySelector('.js-heart-l-img').style.display = 'none';
					}
					break;
				case 'multi':
					if (pl != true) {
						lastavatar ? (lastavatar.style.filter = '') : '';
						selectedAvatarl ? (selectedAvatarl.style.filter = '') : '';
						element.style.filter = 'opacity(.5)';
						lastavatar = element;

						btnNext.style.display = 'block';
					} else if (pl == true && element.style.filter == '') {
						lastavatar ? (lastavatar.style.filter = '') : '';
						selectedAvatarl.style.filter = 'opacity(.5)';
						element.style.filter = 'opacity(.5)';
						lastavatar = element;

						selectedAvatarr = lastavatar;
						avatarr.src = getAvatar(element.id);
						pr = true;
						avatartitle.innerHTML = 'Klik op verder om te spelen.';
						btnStart.style.display = 'block';

						document.querySelector('.js-heart-r').style.display = 'none';
						document.querySelector('.js-heart-l').style.display = 'none';
						document.querySelector('.js-heart-r-img').style.display = 'none';
						document.querySelector('.js-heart-l-img').style.display = 'none';
						if (playerOneConnected == true && playerTwoConnected == true) {
							document.querySelector('.js-heart-r').style.display = 'block';
							document.querySelector('.js-heart-l').style.display = 'block';
							document.querySelector('.js-heart-r-img').style.display = 'block';
							document.querySelector('.js-heart-l-img').style.display = 'block';
						}
					}
					break;
				case 'wall':
					if (pl != true) {
						lastavatar ? (lastavatar.style.filter = '') : '';
						element.style.filter = 'opacity(.5)';
						lastavatar = element;

						selectedAvatarl = element;
						avatarr.src = './img/Avatars/Bricks.png';

						document.querySelector('.js-heart-r').style.display = 'none';
						document.querySelector('.js-heart-l').style.display = 'none';
						document.querySelector('.js-heart-r-img').style.display = 'none';
						document.querySelector('.js-heart-l-img').style.display = 'none';

						avatartitle.innerHTML = 'Klik op verder om te spelen.';
						btnStart.style.display = 'block';
					}
					break;

				default:
					break;
			}
		});
	});

	modeChoiceSingle.addEventListener('click', function() {
		modeChoiceSingle.style.border = '10px solid #e5c9ef';
		modeChoiceMulti.style.border = '10px solid #FFFFFF';
		modeChoiceWall.style.border = '10px solid #FFFFFF';
		gamemode = 'single';
		modeChoiceSingle.classList.add('isSelected');
		modeChoiceMulti.classList.remove('isSelected');
		modeChoiceWall.classList.remove('isSelected');
		modeStartButton.style.display = 'block';
		modeStartButton.setAttribute('id', 'single');
		document.querySelector('.js-heart-r').style.display = 'none';
		document.querySelector('.js-heart-l').style.display = 'none';
		document.querySelector('.js-heart-r-img').style.display = 'none';
		document.querySelector('.js-heart-l-img').style.display = 'none';
	});

	modeChoiceMulti.addEventListener('click', function() {
		modeChoiceSingle.style.border = '10px solid #FFFFFF';
		modeChoiceMulti.style.border = '10px solid #e5c9ef';
		modeChoiceWall.style.border = '10px solid #FFFFFF';
		gamemode = 'multi';
		modeChoiceSingle.classList.remove('isSelected');
		modeChoiceMulti.classList.add('isSelected');
		modeChoiceWall.classList.remove('isSelected');
		modeStartButton.style.display = 'block';
		modeStartButton.setAttribute('id', 'multi');
	});

	modeChoiceWall.addEventListener('click', function() {
		modeChoiceSingle.style.border = '10px solid #FFFFFF';
		modeChoiceMulti.style.border = '10px solid #FFFFFF';
		modeChoiceWall.style.border = '10px solid #e5c9ef';
		modeChoiceSingle.classList.remove('isSelected');
		modeChoiceMulti.classList.remove('isSelected');
		modeChoiceWall.classList.add('isSelected');
		gamemode = 'wall';
		modeStartButton.style.display = 'block';
		modeStartButton.setAttribute('id', 'wall');
	});

	modeStartButton.addEventListener('click', function() {
		switch (this.id) {
			case 'single':
				avatartitle.innerHTML = 'Kies je avatar.';
				gotoPos('right', 100);
				break;
			case 'multi':
				gotoPos('right', 100);
				break;
			case 'wall':
				avatartitle.innerHTML = 'Kies je avatar.';
				gotoPos('right', 100);
				break;
		}
	});

	backbuttonmode.addEventListener('click', function() {
		modeChoiceSingle.style.border = '10px solid #FFFFFF';
		modeChoiceMulti.style.border = '10px solid #FFFFFF';
		modeChoiceWall.style.border = '10px solid #FFFFFF';
		modeChoiceSingle.classList.remove('isSelected');
		modeChoiceMulti.classList.remove('isSelected');
		modeChoiceWall.classList.remove('isSelected');
		gamemode = 'null';

		modeStartButton.style.display = 'none';
		modeStartButton.setAttribute('id', '');
	});

	backbuttonavatar.addEventListener('click', function() {
		avatars.forEach(element => {
			element.style.filter = '';
		});

		avatarl.src = '';
		avatarr.src = '';
		pl = false;
		pr = false;
		selectedAvatarl = '';
		selectedAvatarr = '';
		avatartitle.innerHTML = 'Speler 1, kies je avatar.';
		document.querySelector('.js-btn-back-avatar').style.display = 'none';
		btnStart.style.display = 'none';
		btnNext.style.display = 'none';
	});

	x = document.querySelectorAll('.c-button');
	x.forEach(y => {
		y.addEventListener('click', function() {
			clickSound.play();
		});
	});

	x = document.querySelectorAll('.swal2-styled');
	x.forEach(y => {
		y.addEventListener('click', function() {
			clickSound.play();
		});
	});

	x = document.querySelectorAll('.c-mode-preview');
	x.forEach(y => {
		y.addEventListener('click', function() {
			clickSound.play();
		});
	});
};

document.addEventListener('DOMContentLoaded', function() {
	initPages();
});
