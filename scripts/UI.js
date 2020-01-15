var position = 0;

const gotoPos = () => { /* https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage */
	position = sessionStorage.getItem('position');
	console.log(position)
	if (position == 0 || position == null ) {
		
	} else {
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	}
}

const init = function() {
	document.querySelectorAll('.c-topbar--score-r').forEach(element => {
		element.addEventListener('click', function() {
			position -= 100;
			sessionStorage.setItem('position', position);
			document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;

		});
	});
	document.querySelectorAll('.c-topbar--score-l').forEach(element => {
		element.addEventListener('click', function() {
			position += 100;
			sessionStorage.setItem('position', position);
			document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
		});
	});
};

document.addEventListener('DOMContentLoaded', function() {
	init();
	gotoPos();
});
