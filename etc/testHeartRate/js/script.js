let hartslag1, hartslag2, button1, button2, img1, img2, start;
let deviceCount = 0;
let h1, h2;

const bluetooth = function(x, y) 
{
    navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
        .then(device => device.gatt.connect())
        .then(server => server.getPrimaryService('heart_rate'))
        .then(service => service.getCharacteristic('heart_rate_measurement'))
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => 
            {
            deviceCount++;
            if(deviceCount === 2)
            {
                document.querySelector('.c-wait').style.display = 'block';
                var elem = document.querySelector('.c-wait-line');
                var width = 1;
                var id = setInterval(frame, 1000);
                function frame() {
                    if (width >= 99) 
                    {
                        elem.style.width = "100%";
                        clearInterval(id);
                        start.style.display = 'inline';
                        
                    } else {
                        width = width + 1.666666666666667;
                        elem.style.width = width + "%";
                    }
                }
            }
                characteristic.addEventListener('characteristicvaluechanged', function() 
                {
                    let value = characteristic.value;
                    value = parseHeartRate(value);
                    x.innerHTML = value.heartRate;
                });
                console.log('Notifications have been started.');
            })
        .catch(error => { console.log(error); });
};

const parseHeartRate = function(value) 
{
    value = value.buffer ? value : new DataView(value);
    let result = {};
    result.heartRate = value.getUint8(1);
    return result;
}

const init = function() 
{
    img1 = document.querySelector(".js-img_x");
    img2 = document.querySelector(".js-img_y");
    img1.style.display = "none";
    img2.style.display = "none";
    hartslag1 = document.querySelector(".js-hartslagEen");
    hartslag2 = document.querySelector(".js-hartslagTwee");
    hartslag1.innerHTML = "0";
    hartslag2.innerHTML = "0";
    button1 = document.querySelector(".js-bluetoothButtonEen");
    button2 = document.querySelector(".js-bluetoothButtonTwee");
    //start = document.querySelector('.js-startSpel');
    start = document.querySelector('#start');
    button1.addEventListener("click", function() 
    {
        bluetooth(hartslag1, 1);    
    });
    button2.addEventListener("click", function () 
    {
        bluetooth(hartslag2, 2);
    });
};

document.addEventListener("DOMContentLoaded", init);