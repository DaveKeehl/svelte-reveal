export interface IOptions {
	disable?: boolean;
	debug?: boolean;
	ref?: string;
	root?: ObserverRoot;
	marginTop?: number;
	marginBottom?: number;
	marginLeft?: number;
	marginRight?: number;
	threshold?: number;
	transition?: Transitions;
	delay?: number;
	duration?: number;
	easing?: Easing;
	customEase?: CustomEase;
	x?: number;
	y?: number;
}

export type ObserverRoot = HTMLElement | null | undefined;

export interface IObserverOptions {
	root?: HTMLElement | null;
	rootMargin: string;
	threshold: number;
}

export interface IConfig {
	disableDebug: boolean;
	once: boolean;
	observer: IObserverOptions;
}

export interface IReturnAction {
	update?: (options?: IOptions) => void;
	destroy?: () => void;
}

export type Transitions = 'fly' | 'fade' | 'blur' | 'scale' | 'slide';

export type Easing = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';

export type CustomEase = [number, number, number, number];
