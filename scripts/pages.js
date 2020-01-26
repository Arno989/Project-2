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
	progressbar;

//callbacks na dataophalen
const verwerkHighScores = function(data) {
	console.log(data);
	let d = '';
	data.forEach(function(element, i) {
		d += `<tr>
            <td class="c-scoreboard-table__number">
                <p class="c-scoreboard-table-number__text">${i + 1}</p>
            </td>
            <td class="c-scoreboard-table__name">
                <p class="c-scoreboard-table-name__text">${element.naam}</p>
            </td>
            <td class="c-scoreboard-table__score">
                <p class="c-scoreboard-table-score__text">${element.score}</p>
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
						console.log('hartslag 1: ' + parseHeartRate(d.value).heartRate);
					} else {
						console.log('hartslag 2: ' + parseHeartRate(d.value).heartRate);
					}
				});
				connectDevice(device, 'battery_service', 'battery_level', y);
			} else if (server === 'battery_service') {
				d.readValue()
					.then(e => {
						if (y === 1) {
							console.log('batterij 1: ' + e.getUint8(0));

							document.querySelector('.js-tekenConnectie').style.display = 'block';
							document.querySelector('.js-loading').style.display = 'none';
							document.querySelector('.js-tekenConnectie').src = '/img/svg/vink.svg';

							btn = document.querySelector('.js-btn-connect-player');
							btn.innerHTML = 'Doorgaan naar speler 2';
							btn.disabled = false;

							playerOneConnected = true;

							/* document.querySelector('.js-bar-three').style.width = (100 / 6) * 4 + '%'; */
						} else {
							console.log('batterij 2: ' + e.getUint8(0));

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
							console.log('batterij: ' + y + ' ' + e.getUint8(0));
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

const setbetweenConnections = function() {
	betweenConnections = true;
	document.querySelector('.js-tekenConnectie').src = '/img/svg/kruis.svg';
	document.querySelector('.js-btn-connect-player').innerHTML = 'Verbind speler 2';
	document.querySelector('.js-hartslag-title').innerHTML = 'Hartslagmeter 2';

	/* document.querySelector('.js-bar-three').style.width = (100 / 6) * 5 + '%'; */
};

//setup for bluetooth connection pages

const updateCompleted = function() {
    progressbar += 16.66
    document.querySelectorAll('.c-loadingbar-completed').style.width = progressbar + '%';
}

const setConnect = function() {
	btnPlayer = document.querySelector('.js-btn-connect-player');
	document.querySelector('.js-hartslag-title').innerHTML = 'Hartslagmeter 1';

	/* bar = document.querySelector('.js-bar-three'); 
    bar.style.width = (100 / 6) * 3 + '%';*/

	btnPlayer.addEventListener('click', function() {
		if (!playerOneConnected) {
			bluetooth(1);
		} else if (!playerTwoConnected) {
			if (!betweenConnections) {
				setbetweenConnections();
			} else {
				bluetooth(2);
			}
		} else {
			gotoPos('right', 100);
		}
	});
};

const setPage = function(page) {
	switch (page) {
		case 'heart':
			heartMain.style.display = 'flex';
			connect.style.display = 'none';
			setHeartMain();
			break;
		case 'connect':
			heartMain.style.display = 'none';
			connect.style.display = 'flex';
			setConnect();
			break;
		default:
			heartMain.style.display = 'none';
			connect.style.display = 'none';
			break;
	}
};

// Backend connections

const setHighScore = function() {
	handleData('https://project2function.azurewebsites.net/api/highscore', verwerkHighScores);
};

// Initialize
const init = function() {
	btnBack = document.querySelector('.js-btn-back');
	btnConnect = document.querySelector('.js-btn-connect');

	btnSingle = document.querySelector('.js-btn-single');
	btnMulti = document.querySelector('.js-btn-multi');
	btnWall = document.querySelector('.js-btn-wall');

	btnBack.addEventListener('click', function() {
		setPage('heart');
	});
	btnConnect.addEventListener('click', function() {
		setPage('connect');
	});

	btnSingle.addEventListener('click', function() {
		setPage();
		console.log('single');
		startGame(true, 'single');
	});
	btnMulti.addEventListener('click', function() {
		setPage();
		console.log('multi');
		startGame(true, 'multi');
	});
	btnWall.addEventListener('click', function() {
		setPage();
		console.log('wall');
		startGame(true, 'wall');
	});
};

document.addEventListener('DOMContentLoaded', function() {
	init();
});
