var position = 0;

const gotoPos = () => { /* https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage */
	position = sessionStorage.getItem('position');
	if (position == 0 || position == null ) {
		
	} else {
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	}
}

const init = function() {
	document.querySelectorAll('.js-content__right').forEach(element => {
		element.addEventListener('click', function() {
			position -= 100;
			sessionStorage.setItem('position', position);
			document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;

		});
	});
	document.querySelectorAll('.js-content__left').forEach(element => {
		element.addEventListener('click', function() {
			position += 100;
			sessionStorage.setItem('position', position);
			document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		});
	});
};

document.addEventListener('DOMContentLoaded', function() {
	init();
	/*  gotoPos();*/
});
