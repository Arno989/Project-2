var position = 0;

const gotoSavedPos = () => {
	/* https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage */
	position = sessionStorage.getItem('position');
	if (position != 0 && position != null) {
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	}
};

const gotoPos = function(direction, amount) {
	if (direction == 'right') {
		position -= amount;
	} else if (direction == 'left') {
		position += amount;
	}

	sessionStorage.setItem('position', position);
	document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
};

const init = function() {
	document.querySelectorAll('.js-content__right').forEach(element => {
		element.addEventListener('click', function() {
			gotoPos('right', 100);
		});
	});

	document.querySelectorAll('.js-content__left').forEach(element => {
		element.addEventListener('click', function() {
			gotoPos('left', 100);
		});
	});
};

document.addEventListener('DOMContentLoaded', function() {
	init();
	/* gotoSavedPos(); */
});
