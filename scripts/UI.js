var position = 0;

const gotoSavedPos = () => {
	/* https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage */
	if (sessionStorage.getItem('position') != null) {
		position = parseInt(sessionStorage.getItem('position'));
		Swal.fire({
			title: '<strong>De bluetoothconnectie met de hartslagmeters is verbroken, opnieuw verbinden?</strong>',
			imageUrl: './img/svg/kruis.svg',
			showCloseButton: true,
			showCancelButton: true,
			focusConfirm: false,
			confirmButtonText: 'Opnieuw verbinden',
			confirmButtonAriaLabel: 'Opnieuw verbinden',
			cancelButtonText: 'Zonder hartslagmeter verdergaan',
			cancelButtonAriaLabel: 'Zonder hartslagmeter verdergaan'
		}).then(result => {
			if (result.value) {
				gotoPos('left', 100);
			}
		});
	}

	if (position != 0 && position != null) {
		document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	}
};

var forceRedraw = function(element) {
	if (!element) {
		return;
	}

	var n = document.createTextNode(' ');
	var disp = element.style.display; // don't worry about previous display style

	element.appendChild(n);
	element.style.display = 'none';

	setTimeout(function() {
		element.style.display = disp;
		n.parentNode.removeChild(n);
	}, 20); // you can play with this timeout to make it as short as possible
};

const gotoPos = function(direction, amount) {
	if (direction == 'right') {
		position -= amount;
	} else if (direction == 'left') {
		position += amount;
	}

	switch (position) {
		case -300:
			console.log('saved');
			sessionStorage.setItem('position', position);
			break;
	}

	document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
	console.log(position);
	forceRedraw(document.getElementById('redraw'));
	console.log("redrawn");
	render();
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
	gotoSavedPos();
});
