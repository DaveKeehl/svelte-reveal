import { createObserver, logInfo } from '../src/internal/DOM';
import { defOpts } from '../src/internal/config';

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
