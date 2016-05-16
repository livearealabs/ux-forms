// http://cheeriojs.github.io/cheerio/
import cheerio from 'cheerio';
import { PluginError } from 'gulp-util';
import Stream from 'stream';

const PLUGIN_NAME = 'gulp-ux-forms';
const TOKEN_NAME = 'UXForm';
const FIELDSET_CLASS = 'ux--form--group';

var $;

function replaceTokens (file) {
	var content = file.contents.toString();

	$ = cheerio.load(content, {
		recognizeSelfClosing: true,
		ignoreWhitespace: false
	});

	$('UXText').each(createTextInput);

	$('UXPassword').each(createPassword);

	$('UXCheckbox').each(createCheckbox);

	$('UXRadio').each(createRadio);

	$('UXTextArea').each(createTextArea);

	return $.html();
}

function createFieldSet () {
	return $(`<fieldset class="${FIELDSET_CLASS}" />`);
}

function assignAttributes (attr) {
	return Object.assign(attr, {
		'aria-required': this.attribs.required || false
	})
}

function createTextInput () {
	$(this).replaceWith(() => {
		const attr = assignAttributes(this.attribs);
		const $fieldset = createFieldSet();
		const $input = $('<input type="text"></input>').attr(attr);
		const $label = $(this).find('label').attr({
			for: attr.id
		});

		$fieldset
			.append($label)
			.append($input);

		return $fieldset;
	});
}

function createPassword () {
	$(this).replaceWith(() => {
		const attr = this.attribs;
		const $fieldset = createFieldSet();
		const $input = $('<input type="password" />').attr(attr);
		const $label = $(this).find('label').attr({
			for: attr.id
		});

		$fieldset
			.append($label)
			.append($input);

		return $fieldset;
	});
}

function createCheckbox () {
	$(this).replaceWith(() => {
		const attr = this.attribs;
		const $fieldset = createFieldSet();
		const $input = $('<input type="checkbox" />').attr(attr);
		const $label = $(this).find('label').attr({
			for: attr.id
		}).append($input);

		$fieldset
			.append($label);

		return $fieldset;
	});
}

function createRadio () {
	$(this).replaceWith(() => {
		const attr = this.attribs;
		const $fieldset = createFieldSet();
		const $input = $('<input type="radio" />').attr(attr);
		const $label = $(this).find('label').attr({
			for: attr.id
		}).append($input);

		$fieldset
			.append($label);

		return $fieldset;
	});
}

function createTextArea () {
	$(this).replaceWith(() => {
		const attr = this.attribs;
		const $fieldset = createFieldSet();
		const $input = $('<textarea />').attr(attr);
		const $label = $(this).find('label').attr({
			for: attr.id
		});

		$fieldset
			.append($label)
			.append($input);

		return $fieldset;
	});
}

export default function () {
	const stream = new Stream.Transform({ objectMode: true });

	stream._transform = (file, unused, callback) => {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {}

		if (file.isBuffer()) {}

		var content = replaceTokens(file);

		file.contents = new Buffer(content);

		callback(null, file);
	};

	return stream;
}
