let index, gameOver, makey;

const setIndex = function() 
{
    btn = document.querySelector('.js-index-start');
    btn.addEventListener("click", function() 
    {
        setPage("makey");
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
            break;
        case "index":
            index.style.display = "block";
            gameOver.style.display = "none";
            makey.style.display = "none";
            setIndex();
            break;
        case "gameOver":
            index.style.display = "none";
            gameOver.style.display = "block";
            makey.style.display = "none";
            break;
        case "makey":
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "block";
            break;
        default:
            index.style.display = "none";
            gameOver.style.display = "none";
            makey.style.display = "none";
            break;
    }
};

const initialize = function ()
{
    index = document.querySelector('.js-welcome');
    gameOver = document.querySelector('.js-gameOver');
    makey = document.querySelector('.js-makey');
    setPage("index");
};

document.addEventListener('DOMContentLoaded', initialize);