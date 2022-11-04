import { activateRevealNode, createObserver, getRevealNode, logInfo, markRevealNode } from '../src/internal/DOM';
import { defOpts } from '../src/internal/config';
import { createStylesheet, getRevealClassNames } from '../src/internal/styling';

export function setupIntersectionObserverMock({
	root = null,
	rootMargin = '',
	thresholds = [],
	disconnect = () => null,
	observe = () => null,
	takeRecords = () => [],
	unobserve = () => null
} = {}): void {
	class MockIntersectionObserver implements IntersectionObserver {
		readonly root: Element | null = root;
		readonly rootMargin: string = rootMargin;
		readonly thresholds: ReadonlyArray<number> = thresholds;
		disconnect: () => void = disconnect;
		observe: (target: Element) => void = observe;
		takeRecords: () => IntersectionObserverEntry[] = takeRecords;
		unobserve: (target: Element) => void = unobserve;
	}

	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver
	});

	Object.defineProperty(global, 'IntersectionObserver', {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver
	});
}

beforeEach(() => {
	setupIntersectionObserverMock();
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

describe('createObserver', () => {
	test('The function returns an IntersectionObserver object', () => {
		const node = document.createElement('div');
		const res = createObserver(true, '#000000', node, defOpts, 'css_class');
		expect(res).toBeInstanceOf(IntersectionObserver);
	});
});

describe('logInfo', () => {
	test('The function returns the correct values', () => {
		const node = document.createElement('div');
		expect(logInfo(defOpts, node)).toStrictEqual([defOpts.debug, 'color: #B4BEC8']);
	});
});
