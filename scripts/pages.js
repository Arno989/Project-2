let index, gameOver, makey, hartMain;

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
    btn.addEventListener("click", function () 
    {
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
            break;
        case "index":
            index.style.display = "block";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            setIndex();
            break;
        case "gameOver":
            index.style.display = "none";
            gameOver.style.display = "block";
            makey.style.display = "none";
            hartMain.style.display = "none";
            break;
        case "makey":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "block";
            hartMain.style.display = "none";
            setMakey();
            break;
        case "hart":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "block";
            break;
        default:
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            hartMain.style.display = "none";
            break;
    }
};

const initialize = function ()
{
    index = document.querySelector('.js-welcome');
    gameOver = document.querySelector('.js-gameOver');
    makey = document.querySelector('.js-makey');
    hartMain = document.querySelector('.js-hartbeat__main');
    setPage("index");
};

document.addEventListener('DOMContentLoaded', initialize);