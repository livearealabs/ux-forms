(function (document) {
	var form;
	var fields = [];
	var hasNativeValid;
	var messaging;

	function init () {
		form = document.querySelector('form');
		messaging = document.getElementsByClassName('validation--messaging')[0];

		bindEvents();
	}

	function supportsNativeValidation () {
		if (hasNativeValid === undefined) {
			var tmpInput = document.createElement('input');

			hasNativeValid = typeof tmpInput.checkValidity === 'function';
		}

		return hasNativeValid;
	}

	function bindEvents () {
		var formSets = form.getElementsByTagName('fieldset');

		fields.push(...formSets);

		fields.forEach(function (field) {
			bindInput(field);
		});

		form.addEventListener('submit', function (event) {
			event.preventDefault();

			validate();

			messaging.classList.toggle('opened');
		});
	}

	function validate () {
		fields.forEach(function (field) {
			var inputs = field.querySelectorAll('input:not([type=hidden])');
			var message = field.querySelector('.validation--message');

			field.classList.toggle('validation--error');

			[...inputs].forEach(function (input) {
				if (message) {
					message.innerText = 'This is required.';
				}
			});
		});
	}

	function bindInput (field) {
		var inputs = field.querySelectorAll('input:not([type=hidden])');

		[...inputs].forEach(function (input) {
			input.addEventListener('focus', function (event) {
				field.classList.add('input--focus');
			});

			input.addEventListener('focusout', function (event) {
				if (!this.value.length) {
					field.classList.remove('input--focus');
				}
			});

			input.addEventListener('blur', function (event) {
			});
		});
	}

	document.addEventListener('DOMContentLoaded', init);
})(document);
