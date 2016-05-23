(function (document) {
	var form;
	var fields = [];
	var hasNativeValid;
	var messaging;

	function init () {
		form = document.getElementsByClassName('ux--form')[0];
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
		var formSets = form.getElementsByClassName('ux--form--group');

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

			field.classList.toggle('validation--error');

			[...inputs].forEach(function (input) {
				input.value = 'This is required.';
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
