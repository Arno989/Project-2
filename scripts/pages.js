//global variables
let index, gameOver, makey, hartMain, connect;

//bluetooth connector
const bluetooth = function (y) 
{
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
        .then(x => 
            {
                document.querySelector('.js-tekenConnectie').style.display = "none";
                document.querySelector('.js-loading').style.display = "block";
            })
        .catch(error => {
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
            if (server === 'heart_rate') 
            {
                d.addEventListener('characteristicvaluechanged', function () 
                {
                    //hier hebben we de hartslag
                    console.log(parseHeartRate(d.value).heartRate);

                });
                connectDevice(device, 'battery_service', 'battery_level', y);
            } else if (server === 'battery_service') 
            {
                d.readValue()
                    .then(e => {
                        console.log("batterij: " + e.getUint8(0));
                        if(y===1)
                        {
                            document.querySelector('.js-btn-connect-playerOne').innerHTML = "Doorgaan naar speler 2";
                            document.querySelector('.js-tekenConnectie').style.display = "block";
                            document.querySelector('.js-loading').style.display = "none";
                            document.querySelector('.js-tekenConnectie').src = "/img/svg/vink.svg";
                            document.querySelector('.js-bar-three').style.width = 100 / 6 * 4 + "%";
                        }
                    });
                d.addEventListener('characteristicvaluechanged', function () 
                {
                    d.readValue()
                        .then(e => 
                            {
                                //hier hebben we de batterijstatus
                                console.log("batterij: " + e.getUint8(0));
                        });
                });

            }
        })
};

const parseHeartRate = function (value) {
    value = value.buffer ? value : new DataView(value);
    let result = {};
    result.heartRate = value.getUint8(1);
    return result;
}

//setups for pages
const setIndex = function() 
{
    btn = document.querySelector('.js-index-start');
    btn.addEventListener("click", function() 
    {
        setPage("makey");
        btn.removeEventListener("click", this);
    });
};

const setMakey = function() 
{
    btn = document.querySelector('.js-button-next');
    bar = document.querySelector('.js-bar-one');
    btn.addEventListener("click", function () 
    {
        setPage("hart");
        btn.removeEventListener("click", this);
    });
    bar.style.width = 100 / 6 * 1 + "%";
};

const setHeartMain = function() 
{
    btn = document.querySelector('.js-btn-noHeartRate');
    btnOne = document.querySelector('.js-btn-connectHeartRate');
    bar = document.querySelector('.js-bar-two');
    btn.addEventListener("click", function () {
        //setPage("");
        //hier moet de speler naar het hoofdmenu gebracht worden!
        btn.removeEventListener("click", this);
    });
    btnOne.addEventListener("click", function() 
    {
        setPage("connect");
        btnOne.removeEventListener("click", this); 
    });
    bar.style.width = 100 / 6 * 2 + "%";
};

const setConnect = function() 
{
    btnNo = document.querySelector('.js-btn-connect-back');
    btnPlayerOne = document.querySelector('.js-btn-connect-playerOne');
    bar = document.querySelector('.js-bar-three');
    bar.style.width = 100 / 6 * 3 + "%";
    btnNo.addEventListener("click", function () {
        setPage("hart");
        btn.removeEventListener("click", this);
    });
    btnPlayerOne.addEventListener("click", function() 
    {
        bluetooth(1);
    });
};

//page setter
const setPage = function(page)
{
    switch (page) 
    {
        case "none":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            break;
        case "index":
            index.style.display = "block";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            setIndex();
            break;
        case "gameOver":
            index.style.display = "none";
            gameOver.style.display = "block";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            break;
        case "makey":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "block";
            hartMain.style.display = "none";
            connect.style.display = "none";
            setMakey();
            break;
        case "hart":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "block";
            connect.style.display = "none";
            setHeartMain();
            break;
        case "connect":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "block";
            setConnect();
            break;
        default:
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            connect.style.display = "none";
            break;
    }
};

//initialize
const initialize = function ()
{
    index = document.querySelector('.js-welcome');
    gameOver = document.querySelector('.js-gameOver');
    makey = document.querySelector('.js-makey');
    hartMain = document.querySelector('.js-hartbeat__main');
    connect = document.querySelector('.js-connect');
    setPage("index");
};

document.addEventListener('DOMContentLoaded', initialize);