let hartslag1, hartslag2, button1, button2, img1, img2, start;
let deviceCount = 0;
let h1, h2;
let batterijWaardeEen;
let batterijLijnEen;
let battery = 0; //flag

const bluetooth = function (x, y) {
    navigator.bluetooth.requestDevice({
            filters: [{
                services: ['battery_service']
            }, {
                services: ['heart_rate']
            }]
        })
        .then(device => {
            connect(device, 'heart_rate', 'heart_rate_measurement', y);
            //connect(device, 'battery_service', 'battery_level');
        })
        .then(function () {
            if (y === 1) {
                button1.style.display = "none";
            } else {
                button2.style.display = "none";
            }
        })
        .catch(error => {
            console.log(error);
        });
};

const connect = function (device, server, service, y) {
    device.gatt.connect()
        .then(a => {
            console.log("device connected");
            console.log(a);
            return a.getPrimaryService(server);
        })
        .then(b => {
            console.log("server connected");
            console.log(b);
            return b.getCharacteristic(service);
        })
        .then(c => {
            console.log("service connected ");
            console.log(c);
            return c.startNotifications();
        })
        .then(d => {
            console.log("notifications have been started");
            if (server === 'heart_rate') {
                d.addEventListener('characteristicvaluechanged', function () {
                    console.log(parseHeartRate(d.value).heartRate);
                    hartslag1.innerHTML = `hartslag: ${parseHeartRate(d.value).heartRate} slagen per minuut`;

                });
                connect(device, 'battery_service', 'battery_level', y);
            } else if (server === 'battery_service') {
                d.readValue()
                    .then(e => {
                        console.log("batterij: " + e.getUint8(0));
                    });
                d.addEventListener('characteristicvaluechanged', function () {
                    console.log("zit in eventlisten")
                    d.readValue()
                        .then(e => {
                            if (battery == e.getUint8(0)) return;

                            batterijWaardeEen.innerHTML = `batterij: ${e.getUint8(0)}%`;
                            batterijLijnEen.style.width = e.getUint8(0) + "%";
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

const init = function () {
    hartslag1 = document.querySelector(".js-hartslagEen");
    hartslag2 = document.querySelector(".js-hartslagTwee");
    button1 = document.querySelector(".js-bluetoothButtonEen");
    button2 = document.querySelector(".js-bluetoothButtonTwee");
    //start = document.querySelector('.js-startSpel');
    start = document.querySelector('#start');
    batterijWaardeEen = document.querySelector('.js-batterij-1');
    batterijLijnEen = document.querySelector('.js-batterij-lijn-1');
    button1.addEventListener("click", function () {
        bluetooth(hartslag1, 1);
    });
    button2.addEventListener("click", function () {
        bluetooth(hartslag2, 2);
    });
};

document.addEventListener("DOMContentLoaded", init);