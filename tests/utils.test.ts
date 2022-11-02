import { createFinalOptions, defOpts } from '../src/internal/config';
import { setConfig, setObserverConfig } from '../src/internal/API';
import { getRevealClassNames, createStylesheet } from '../src/internal/styling';
import type { IOptions } from '../src/internal/types';
import { clean, createObserverConfig } from '../src/internal/utils';
import { markRevealNode, activateRevealNode, getRevealNode } from '../src/internal/DOM';
import { areOptionsValid } from '../src/internal/validations';

beforeEach(() => {
	setConfig({
		dev: true,
		once: false,
		responsive: {
			mobile: {
				enabled: true,
				breakpoint: 425
			},
			tablet: {
				enabled: true,
				breakpoint: 768
			},
			laptop: {
				enabled: true,
				breakpoint: 1440
			},
			desktop: {
				enabled: true,
				breakpoint: 2560
			}
		}
	});
	setObserverConfig({
		root: null,
		rootMargin: '0px 0px 0px 0px',
		threshold: 0.6
	});
});

describe('markRevealNode', () => {
	const node = document.createElement('div');

	test('The reveal node has the data-action attribute', () => {
		expect(markRevealNode(node).getAttribute('data-action')).not.toBeNull();
	});

	test("The reveal node has the data-action attribute set to 'reveal'", () => {
		expect(markRevealNode(node).getAttribute('data-action')).toMatch(/reveal/);
	});
});

describe('activateRevealNode', () => {
	const node = document.createElement('div');
	const [transitionDeclaration, transitionProperties] = getRevealClassNames(defOpts.ref, defOpts.transition);

	test('The reveal node has no css class when stylesheet does not exist', () => {
		expect(
			Object.values(activateRevealNode(node, transitionDeclaration, transitionProperties, defOpts).classList)
		).toStrictEqual([]);
	});

	test('The reveal node has correct css class when stylesheet exists', () => {
		document.body.innerHTML = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta http-equiv="X-UA-Compatible" content="ie=edge">
					<title>HTML 5 Boilerplate</title>
				</head>
				<body>
				<script src="index.js"></script>
				</body>
			</html>
		`;
		createStylesheet();
		expect(
			Object.values(activateRevealNode(node, transitionDeclaration, transitionProperties, defOpts).classList)
		).toContain(transitionProperties);
	});

	// test('Stylesheet only has one set of media queries', () => {
	// 	document.body.innerHTML = `
	// 		<!DOCTYPE html>
	// 		<html lang="en">
	// 			<head>
	// 				<meta charset="UTF-8">
	// 				<meta name="viewport" content="width=device-width, initial-scale=1.0">
	// 				<meta http-equiv="X-UA-Compatible" content="ie=edge">
	// 				<title>HTML 5 Boilerplate</title>
	// 			</head>
	// 			<body>
	// 			<script src="index.js"></script>
	// 			</body>
	// 		</html>
	// 	`;
	// 	createStylesheet();
	// 	// console.log(document.body.innerHTML);
	// 	// activateRevealNode(node, className, baseClassName, init);
	// 	// const stylesheet = document.querySelector('style[data-action="reveal"]');
	// 	// if (stylesheet) {
	// 	// 	const styles = stylesheet.innerHTML;
	// 	// 	const split = styles.split(/@media/g);
	// 	// 	expect(split.length).toBe(2);
	// 	// }
	// });
});

describe('getRevealNode', () => {
	const node = document.createElement('p');

	afterEach(() => {
		node.setAttribute('style', '');
	});

	test('The reveal node did not have any inline styles already', () => {
		expect(node.style.length).toBe(0);
		expect(getRevealNode(node)).toBe(node);
	});

	test('The reveal node already had inline styles', () => {
		node.style.position = 'absolute';
		node.style.top = '0';

		expect(node.style.length).toBe(2);
		expect(getRevealNode(node).children.length).toBe(1);
		expect(getRevealNode(node).children[0]).toBe(node);
	});
});

test('clean', () => {
	const longString = `
							hello world
	`;

	expect(clean(longString)).toBe('hello world');
	expect(clean('')).toBe('');
});

describe('createFinalOptions', () => {
	test('Using valid options', () => {
		const validOptions: IOptions = {
			threshold: 0.6,
			opacity: 0,
			delay: 200,
			duration: 2000,
			blur: 16,
			scale: 0
		};
		const finalOptions = Object.assign({}, defOpts, validOptions);
		expect(createFinalOptions(validOptions)).toStrictEqual(finalOptions);
	});
});

describe('areOptionsValid', () => {
	test('Should return false when using invalid options', () => {
		const invalidOptions: IOptions = {
			threshold: 1.2,
			opacity: 0,
			delay: -200,
			duration: 2000,
			blur: -5,
			scale: 0
		};
		const finalOptions = createFinalOptions(invalidOptions);
		expect(areOptionsValid(finalOptions)).toBe(false);
	});
});

test('createObserverConfig', () => {
	const observerOverrides = {
		threshold: 0.3
	};
	const observerConfig = createObserverConfig(observerOverrides);

	expect(observerConfig.threshold).toBe(observerOverrides.threshold);
	expect(observerConfig.rootMargin).toBe(defOpts.rootMargin);
	expect(observerConfig.root).toBe(defOpts.root);
});
