import type { Easing } from './easing.ts';
import type { RevealEvents } from './events.ts';
import type { IntersectionObserverConfig } from './intersection-observer.ts';
import type { RevealTransition } from './transitions.ts';

/**
 * Specifies how a single reveal instance behaves.
 */
export type RevealOptions = Partial<IntersectionObserverConfig & RevealTransition & { easing: Easing } & RevealEvents>;
