export interface IOptions {
	disable?: boolean;
	debug?: boolean;
	ref?: string;
	threshold?: number;
	marginTop?: number;
	marginBottom?: number;
	marginLeft?: number;
	marginRight?: number;
	transition?: Transitions;
	delay?: number;
	duration?: number;
	easing?: Easing;
	x?: number;
	y?: number;
	root?: ObserverRoot;
}

export type ObserverRoot = HTMLElement | null | undefined;

export interface IObserverOptions {
	root: HTMLElement | null | undefined;
	rootMargin: string;
	threshold: number;
}

export interface IConfig {
	disableDebug: boolean;
	once: boolean;
	observer: ObserverOptions;
}

export interface IReturnAction {
	update?: (options?: IOptions) => void;
	destroy?: () => void;
}

export type Transitions = 'fly' | 'fade' | 'blur' | 'scale' | 'slide';

export type Easing =
	| 'ease'
	| 'linear'
	| 'ease-in'
	| 'ease-out'
	| 'ease-in-out'
	| ['cubic-bezier', number, number, number, number];
