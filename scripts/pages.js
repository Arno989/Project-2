//global variables
let index, gameOver, makey, hartMain, connect, main, gamemode, highscores;
let isConnectedOne = false, inBetween = false, isConnectedTwo = false;

//callbacks na dataophalen
const verwerkHighScores = function(data) 
{
    console.log(data);
    let d = "";
    data.forEach(function (element, i) 
    {
        d += 
        `<tr>
            <td class="c-scoreboard-table__number">
                <p class="c-scoreboard-table-number__text">${i+1}</p>
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
const bluetooth = function (y) {
    navigator.bluetooth.requestDevice({
        filters: [{
            services: ['battery_service']
        }, {
            services: ['heart_rate']
        }]
    })
        .then(device => {
            connectDevice(device, 'heart_rate', 'heart_rate_measurement', y);
        })
        .then(x => {
            document.querySelector('.js-tekenConnectie').style.display = "none";
            document.querySelector('.js-loading').style.display = "block";
            document.querySelector('.js-btn-connect-playerOne').disabled = true;
        })
        .catch(error => 
        {
            document.querySelector('.js-tekenConnectie').src = "/img/svg/kruis.svg";
            console.log(error);
        });
};

//connect heartRateMonitor followed by battery service
const connectDevice = function (device, server, service, y) {
    device.gatt.connect()
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
                d.addEventListener('characteristicvaluechanged', function () {
                    //hier hebben we de hartslag
                    if(y === 1)
                    {
                        console.log("hartslag 1: " + parseHeartRate(d.value).heartRate);
                    }
                    else
                    {
                        console.log("hartslag 2: " + parseHeartRate(d.value).heartRate);
                    }
                });
                connectDevice(device, 'battery_service', 'battery_level', y);
            } else if (server === 'battery_service') {
                d.readValue()
                    .then(e => {
                        if (y === 1) 
                        {
                            console.log("batterij 1: " + e.getUint8(0));
                            bnt = document.querySelector('.js-btn-connect-playerOne');
                            bnt.innerHTML = "Doorgaan naar speler 2";
                            bnt.disabled = false;
                            document.querySelector('.js-tekenConnectie').style.display = "block";
                            document.querySelector('.js-loading').style.display = "none";
                            document.querySelector('.js-tekenConnectie').src = "/img/svg/vink.svg";
                            document.querySelector('.js-bar-three').style.width = 100 / 6 * 4 + "%";
                            isConnectedOne = true;
                        }
                        else
                        {
                            console.log("batterij 2: " + e.getUint8(0));
                            isConnectedTwo = true;
                            document.querySelector('.js-tekenConnectie').style.display = "block";
                            document.querySelector('.js-loading').style.display = "none";
                            document.querySelector('.js-tekenConnectie').src = "/img/svg/vink.svg";
                            bnt = document.querySelector('.js-btn-connect-playerOne');
                            bnt.innerHTML = "Doorgaan";
                            bnt.disabled = false;
                            isConnectedTwo = true;
                            document.querySelector('.js-bar-three').style.width = 100 / 6 * 6 + "%";
                            document.querySelector('.js-bar-three').style.borderRadius = "250px 250px 250px 250px";
                        }
                    })
                    .catch(error =>
                        {
                        document.querySelector('.js-tekenConnectie').src = "/img/svg/kruis.svg";
                        document.querySelector('.js-tekenConnectie').style.display = "block";
                        document.querySelector('.js-loading').style.display = "none";
                        document.querySelector('.js-btn-connect-playerOne').disabled = false;
                        });
                d.addEventListener('characteristicvaluechanged', function () {
                    d.readValue()
                        .then(e => {
                            //hier hebben we de batterijstatus
                            console.log("batterij: " +  y + " " + e.getUint8(0));
                        })
                        .catch(error => {
                            document.querySelector('.js-tekenConnectie').src = "/img/svg/kruis.svg";
                            document.querySelector('.js-tekenConnectie').style.display = "block";
                            document.querySelector('.js-loading').style.display = "none";
                            document.querySelector('.js-btn-connect-playerOne').disabled = false;
                            if(y === 1)
                            {
                                isConnectedOne = false;
                                inBetween = false;
                                isConnectedTwo = false;
                            }
                            else
                            {
                                isConnectedTwo = false;
                            }
                            document.querySelector('.js-btn-connect-playerOne').innerHTML = "Verbind opnieuw";
                        });
                });
            }
        })
        .catch(error => {
            document.querySelector('.js-tekenConnectie').src = "/img/svg/kruis.svg";
            document.querySelector('.js-tekenConnectie').style.display = "block";
            document.querySelector('.js-loading').style.display = "none";
            document.querySelector('.js-btn-connect-playerOne').disabled = false;
        });
};

const parseHeartRate = function (value) {
    value = value.buffer ? value : new DataView(value);
    let result = {};
    result.heartRate = value.getUint8(1);
    return result;
};

const setInbetween = function() 
{
    document.querySelector('.js-tekenConnectie').src = "/img/svg/kruis.svg";
    bnt = document.querySelector('.js-btn-connect-playerOne');
    bnt.innerHTML = "Verbind speler 2";
    document.querySelector('.js-bar-three').style.width = 100 / 6 * 5 + "%";
    inBetween = true;
    document.querySelector('.js-hartslag-title').innerHTML = "Hartslagmeter 2";
};

//setups for pages
const setIndex = function () {
    btn = document.querySelector('.js-index-start');
    btn.addEventListener("click", function () {
        setPage("makey");
        btn.removeEventListener("click", this);
    });
};

const setMakey = function () {
    btn = document.querySelector('.js-button-next');
    bar = document.querySelector('.js-bar-one');
    btn.addEventListener("click", function () {
        setPage("hart");
        btn.removeEventListener("click", this);
    });
    bar.style.width = 100 / 6 * 1 + "%";
};

const setHeartMain = function () {
    btn = document.querySelector('.js-btn-noHeartRate');
    btnOne = document.querySelector('.js-btn-connectHeartRate');
    bar = document.querySelector('.js-bar-two');
    btn.addEventListener("click", function () {
        setPage("main");
        btn.removeEventListener("click", this);
    });
    btnOne.addEventListener("click", function () {
        setPage("connect");
        btnOne.removeEventListener("click", this);
    });
    bar.style.width = 100 / 6 * 2 + "%";
};

const setConnect = function () {
    btnNo = document.querySelector('.js-btn-connect-back');
    btnPlayerOne = document.querySelector('.js-btn-connect-playerOne');
    bar = document.querySelector('.js-bar-three');
    bar.style.width = 100 / 6 * 3 + "%";
    btnNo.addEventListener("click", function () {
        setPage("hart");
        btn.removeEventListener("click", this);
    });
    document.querySelector('.js-hartslag-title').innerHTML = "Hartslagmeter 1";
    btnPlayerOne.addEventListener("click", function () {
        if(!isConnectedOne)
        {
            bluetooth(1);
        }
        else if(!isConnectedTwo)
        {
            if(!inBetween)
            {
                setInbetween();
            }
            else
            {
                bluetooth(2);
            }
        }
        else
        {
            setPage("main");
        }
    });
};

const setMain = function () {
    btn = document.querySelector('.js-btn-start');
    btnHigh = document.querySelector('.js-btn-highscores');
    startGame(false, "ai");
    btn.addEventListener("click", function () {
        setPage("gamemode");
        btn.removeEventListener("click", this);
    });
    btnHigh.addEventListener("click", function () 
    {
        setPage("highscore");
        btnHigh.removeEventListener('click', this);
    });
};

const setGamemode = function () {
    btnSingle = document.querySelector('.js-btn-single');
    btnMulti = document.querySelector('.js-btn-multi');
    btnWall = document.querySelector('.js-btn-wall');
    btnSingle.addEventListener("click", function () {
        setPage("none");
        btnSingle.removeEventListener("click", this);
        console.log("single");
        startGame(true, "single");
    });
    btnMulti.addEventListener("click", function () {
        setPage("none");
        btnMulti.removeEventListener("click", this);
        console.log("multi");
        startGame(true, "multi");
    });
    btnWall.addEventListener("click", function () {
        setPage("none");
        btnWall.removeEventListener("click", this);
        console.log("wall");
        startGame(true, "wall");
    });
};

const setHighScore = function() 
{
    handleData('https://project2function.azurewebsites.net/api/highscore', verwerkHighScores);
};

//page setter
const setPage = function (page) {
    switch (page) {
        case "none":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            break;
        case "index":
            index.style.display = "block";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            setIndex();
            break;
        case "gameOver":
            index.style.display = "none";
            gameOver.style.display = "block";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            break;
        case "makey":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "block";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            setMakey();
            break;
        case "hart":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "block";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            setHeartMain();
            break;
        case "connect":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "block";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            setConnect();
            break;
        case "main":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "block";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            setMain();
            break;
        case "gamemode":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "block";
            highscores.style.display = "none";
            setGamemode();
            break;
        case "highscore":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "block";
            setHighScore();
            break;
        default:
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            main.style.display = "none";
            gamemode.style.display = "none";
            highscores.style.display = "none";
            break;
    }
};

//initialize
const initialize = function () {
    index = document.querySelector('.js-welcome');
    gameOver = document.querySelector('.js-gameOver');
    makey = document.querySelector('.js-makey');
    hartMain = document.querySelector('.js-hartbeat__main');
    connect = document.querySelector('.js-connect');
    main = document.querySelector('.js-main-menu');
    gamemode = document.querySelector('.js-gamemode');
    highscores = document.querySelector('.js-highscore');
    setPage("index");
};

document.addEventListener('DOMContentLoaded', initialize);