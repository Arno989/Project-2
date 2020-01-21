let index, gameOver, makey, hartMain, connect;

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
    bar.style.width = "20%";
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
    bar.style.width = "40%";
};

const setConnect = function() 
{
    btnNo = document.querySelector('.js-btn-connect-back');
    btnPlayerOne = document.querySelector('.js-btn-connect-playerOne');
    bar = document.querySelector('.js-bar-three');
    bar.style.width = "60%";
    btnNo.addEventListener("click", function () {
        setPage("hart");
        btn.removeEventListener("click", this);
    });
};

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