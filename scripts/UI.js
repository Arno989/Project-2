var position = 0;

const gotoSavedPos = () => {
	/* https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage */
	if (sessionStorage.getItem('position') != null) 
	{
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
		})
	}

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
	console.log(position);
	switch (position) {
		case -300:
			console.log('saved');
			sessionStorage.setItem('position', position);
			break;
	}

	document.querySelector('.c-container').style.transform = `translateX(${position}vw)`;
};

const init = function() {
	document.querySelectorAll('.js-content__right').forEach(element => {
		element.addEventListener('click', function () {
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
