![](../../assets/readme_cover.png)

# Svelte Reveal

![npm](https://img.shields.io/npm/v/svelte-reveal) ![npm](https://img.shields.io/npm/dw/svelte-reveal) ![GitHub](https://img.shields.io/github/license/davekeehl/svelte-reveal)

Svelte Reveal is a library created with the purpose of helping [Svelte](https://svelte.dev/) users add reveal on scroll animations to their web applications in the easiest way possible. This library leverages the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) in order to know when to trigger the animations.

## Features

- ⚡️ Near zero config
- 👀 Intersection Observer
- 🧩 Customizable transitions
- 🔌 Extensive API
- 📚 Exhaustive documentation
- 🔥 100% TypeScript

## Table of Contents

1. [Demo](#demo)
1. [Usage](#usage)
1. [Why Svelte Reveal](#why-svelte-reveal)
1. [SvelteKit](#sveltekit)
1. [Options](#options)
1. [Global config](#global-config)
1. [API](#api)
1. [Suggestions](#suggestions)
1. [Troubleshooting](#troubleshooting)
1. [Funding](#funding)
1. [Versioning](#versioning)
1. [Changelog](#changelog)
1. [License](#license)

## Demo

You can see Svelte Reveal in action [in this StackBlitz project](https://stackblitz.com/edit/svelte-reveal?file=src%2FApp.svelte).

## Usage

1. Install the library:

   ```bash
   # npm
   npm install -D svelte-reveal
   
   # yarn
   yarn add -D svelte-reveal
   
   # pnpm
   pnpm add -D svelte-reveal
   ```

2. Import the library in your Svelte component:

   ```svelte
   <script>
     import { reveal } from 'svelte-reveal';
   </script>
   ```

3. Add the imported `reveal` action to the DOM element you want to transition:

   ```svelte
   <h1 use:reveal>Hello world</h1>
   <p use:reveal={{ transition: "slide" }}>A paragraph</p>
   ```

   If you want to use the action on a Svelte component, you need to pass the reveal options via props:

   ```svelte
   // App.svelte
   
   <script>
     import Heading from './Heading.svelte';
   </script>
   
   <Heading useReveal={{ transition: "slide" }}>Hello world</Heading>
   ```
   
   ```svelte
   // Heading.svelte
   
   <script lang="ts">
     import { reveal, type RevealOptions } from 'svelte-reveal';
     export let useReveal: RevealOptions;
   </script>
   
   <h1 use:reveal={ useReveal }>
     <slot />
   </h1>
   ```
   
   Using [SvelteKit](https://kit.svelte.dev/)? Please refer to the ["SvelteKit"](#sveltekit) section.

## Why Svelte Reveal

If you happened to scout the internet for other similar libraries, you might have noticed that other authors have decided to create their own library using Svelte [slots](https://svelte.dev/docs#template-syntax-slot) (similar to [React children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)). There is nothing wrong with that approach, but in my opinion it goes a bit against one of Svelte's core purpose: writing more concise code. Having to wrap every to-be-transitioned component adds at least 2 extra lines of code each time, making your files unnecessarily bloated for such a simple add-on.

You might have also noticed people adding event listeners to the window object in order to transition elements, but in terms of performance it [doesn't scale very well](https://itnext.io/1v1-scroll-listener-vs-intersection-observers-469a26ab9eb6).

Instead, I decided to use Svelte [actions](https://svelte.dev/docs#template-syntax-element-directives-use-action), which are functions you can attach to a DOM element and that allow you to get access to that particular element and hook into its lifecycle. They take up considerably fewer lines of code, and so far I haven't encountered any big obstacle or performance drawback. Morever, this library is backed by the Intersection Observer API, which is great for performance.

## SvelteKit

> ⚠️ This is an active area of research

> 📅 Last update: April 2024

Since Svelte actions require client-only components (components that only work in the browser), they don't work well with [SSR](https://kit.svelte.dev/docs/page-options#ssr). However, if you import Svelte Reveal in a SvelteKit page you'll notice that it actually... works! With a few caveats though. For example, elements do get revealed on scroll (even on page refresh), except for the ones currently in view. If you disable JavaScript you can also see all the elements, which is nice. **If you're ok with this default behavior you can stop reading here, otherwise please continue and check out the workarounds I've found.**

### Workarounds

These workarounds do work, but bear in mind that they each come with some downsides, which should be thoughtfully evaluated based on your own requirements.

#### Wait for the browser to be available using lifecycle methods

If you wrap the elements to be revealed inside an `{#if}` block which is evaluated to `true` when the browser is available, the action will work fine. It works both with `onMount` and `afterUpdate`.

```svelte
// +page.svelte

<script>
  import { afterUpdate } from 'svelte';

  let show = false;

  afterUpdate(() => {
    show = true;
  });
</script>

{#if show}
  <MyComponent />
{/if}
```

Cons: 

- Not very SEO friendly, as the elements inside the `{#if}` blocks will not be rendered on the server, leaving the page with missing pieces when crawled by bots and when JS is disabled. If the entire page content is rendered this way, the initial page will be empty

#### Await the client component to be ready before being rendered

Similarly to the previous workaround, we only want our client-only component to be rendered when the DOM is accessible to get the work done. You can also achieve this result by using the `{#await}` block as follows.

```svelte
// +page.svelte

<script>
  const MyComponent = import('MyComponent.svelte')
</script>

{#await MyComponent then { default: MyComponent }}
  <MyComponent />
{/await}
```

```svelte
// MyComponent.svelte

<script>
  import { reveal } from 'svelte-reveal';
</script>

<h1 use:reveal>Hello world</h1>
```

Cons:

- You need to put your client-only components in separate files
- Same SEO consideration as before

#### Disable SSR for the whole page

This is probably the last thing you want to do, but if you're ok turning SSR off for the whole page you can do as follows. By doing so the page will always have the DOM available and the action will work fine.

```typescript
// +page.ts
export const ssr = false
```

Cons:

- The page only runs client-side

## Options

Depending on the use case, you can either use this library as-is (which applies some [default options](./src/internal/default/options.ts)), or customize it to your liking. If you choose to do so, you can pass an object to this action containing your own options to be applied.

Keep in mind that these options are applied to the single DOM element you add Svelte Reveal to. For global and more in-depth settings, refer to the [API](#api) section.

| Name       | Type                        | Default             | Description                                                  |
| ---------- | --------------------------- | ------------------- | ------------------------------------------------------------ |
| `disable`    | `boolean`                   | `false`             | When set to false, the transition is disabled for the target element. |
| `root`       | `Element \| Document \| null` | `null`              | The [root](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root) element used by the Intersection Observer. |
| `rootMargin` | `string`                    | `"0px 0px 0px 0px"` | The [root margin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer. |
| `threshold`  | `number`                    | `0.6`               | The [threshold](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds) (in percentage from `0.0` to `1.0`) property used by the Intersection Observer to know when its target element is considered visible. |
| `transition` | `Transition`                | `"fade"`            | The type of transition that is triggered when the target node becomes visible.<br />Read more [in this subsection](#transitions) for a comprehensive explanation of the full list of available transitions. |
| `reset`      | `boolean`                   | `false`             | When set to `true`, the node transitions out when out of view, and is revealed again when back in view.<br /><br />⚠️ Be careful not to overuse this option, as it prevents the Intersection Observer to stop observing the target node. Performance is therefore not guaranteed when many elements have `reset` set to `true`. |
| `duration`   | `number`                    | `800`               | How long the transition lasts (in ms).                       |
| `delay`      | `number`                    | `0`                 | How long the transition is delayed (in ms) before being triggered. |
| `easing`     | `Easing`                    | `"easeInOutCubic"`  | The easing function to use. [Check out](./src/internal/types/easing.ts) the full list of available easing functions and [this other website](https://cubic-bezier.com/) to preview timing functions. |
| `x`          | `number`                    | `-20`               | The starting offset position in pixels on the x-axis of the `"slide"` transition.<br />If `x` is negative, the element will transition from the left, else from the right. |
| `y`          | `number`                    | `-20`               | The starting offset position in pixels on the y-axis of the `"fly"` transition.<br />If `y` is negative, the element will transition from the top, else from the bottom. |
| `rotate`     | `number`                    | `-360`              | The starting rotation offset in degrees of the `"spin"` transition.<br />If `rotate` is positive, the element will spin clockwise, else counter-clockwise. |
| `opacity`    | `number`                    | `0`                 | The starting opacity value in percentage of any transition. It can be a number between `0.0` and `1.0`. |
| `blur`       | `number`                    | `16`                | The starting blur value in pixels of the `"blur"` transition. |
| `scale`      | `number`                    | `0`                 | The starting scale value in percentage of the `"scale"` transition. |

### Transitions

> ⚠️ All transitions have the `"fade"` transition backed in

| Name      | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `"fade"`  | The element fades in gracefully.<br />In practice: `opacity: 0 -> 1` |
| `"fly"`   | The element fades in and performs a translation on the y-axis (vertical).<br />In practice: `opacity: 0 -> 1` + `transform: translateY(-20px -> 0px) ` |
| `"slide"` | The element fades in and performs a translation on the x-axis (horizontal).<br />In practice: `opacity: 0 -> 1` + `transform: translateX(-20px -> 0px)` |
| `"blur"`  | The element fades in and becomes unblurred.<br />In practice: `opacity: 0 -> 1` + `filter: blur(8px -> 0px)` |
| `"scale"` | The element fades in and gets to the original size.<br />In practice: `opacity: 0 -> 1` + `transform: scale(0 -> 1)`<br /><br />⚠️ In order to use this transition it is required to use the `width` CSS property on the element to reveal. If you are not already using this property for other things, you can set it to `width: fit-content` . |
| `"spin"`  | The element fades in and gets to the original rotation degree.<br />In practice: `opacity: 0 -> 1` + `transform: rotate(-360 -> 0)`<br /><br />⚠️ In order to use this transition it is required to use the `width` CSS property on the element to reveal. If you are not already using this property for other things, you can use set it to `width: fit-content` . |

### Callbacks

The following table shows all the callback functions we provide to you.

| Name            | Args                  | Return | Description                                                  |
| --------------- | --------------------- | ------ | ------------------------------------------------------------ |
| `onRevealStart` | `(node: HTMLElement)` | `void` | Function that gets fired when the node starts being revealed. |
| `onRevealEnd`   | `(node: HTMLElement)` | `void` | Function that gets fired when the node is fully revealed.    |
| `onResetStart`  | `(node: HTMLElement)` | `void` | Function that gets fired when the` reset` option is set to `true` and the node starts transitioning out. |
| `onResetEnd`    | `(node: HTMLElement)` | `void` | Function that gets fired when the `reset` option is set to `true` and the node has fully transitioned out. |
| `onMount`       | `(node: HTMLElement)` | `void` | Function that gets fired when the node is mounted on the DOM. |
| `onUpdate`      | `(node: HTMLElement)` | `void` | Function that gets fired when the action options are updated. |
| `onDestroy`     | `(node: HTMLElement)` | `void` | Function that gets fired when the node is unmounted from the DOM. |

## Global config

The following table shows how this library is globally configured right of out the box.

| Parameter    | (children) | (children)   | Type           | Default | Description                                                  |
| ------------ | ---------- | ------------ | -------------- | ------- | ------------------------------------------------------------ |
| `once`       |            |              | `boolean`      | `false` | Whether the reveal effect runs only once (i.e. it doesn't re-run on page reload). |
| `responsive` |            |              | `Responsive`   |         | Specifies how the library handles responsiveness. It can be used to enable/disable the reveal effect on some devices. |
|              | `mobile`   |              | `DeviceConfig` |         | Configuration of mobile devices.                             |
|              |            | `enabled`    | `boolean`      | `true`  | Whether the reveal effect is performed on mobile devices.    |
|              |            | `breakpoint` | `number`       | `425`   | The max viewport width of mobile devices.                    |
|              | `tablet`   |              | `DeviceConfig` |         | Configuration of tablet devices.                             |
|              |            | `enabled`    | `boolean`      | `true`  | Whether the reveal effect is performed on tablet devices.    |
|              |            | `breakpoint` | `number`       | `768`   | The max viewport width of tablet devices.                    |
|              | `laptop`   |              | `DeviceConfig` |         | Configuration of laptop devices.                             |
|              |            | `enabled`    | `boolean`      | `true`  | Whether the reveal effect is performed on laptop devices.    |
|              |            | `breakpoint` | `number`       | `1440`  | The max viewport width of laptop devices.                    |
|              | `desktop`  |              | `DeviceConfig` |         | Configuration of desktop devices.                            |
|              |            | `enabled`    | `boolean`      | `true`  | Whether the reveal effect is performed on desktop devices.   |
|              |            | `breakpoint` | `number`       | `2560`  | The max viewport width of desktop devices.                   |

## API

> ⚠️ If you want to customise the behavior of a single DOM node, you are supposed to use [options](#options).

Svelte Reveal also exposes several functions you can call to change the [default options](./src/internal/default/options.ts) and [global configuration](./src/internal/default/config.ts) of this library. Since these functions operate on a global level across all components using Svelte Reveal, you are supposed to only call them from a single file, otherwise you'll keep overriding the default options and global config from multiple points.

| Name                    | Args                                           | Return                       | Description                                                  |
| ----------------------- | ---------------------------------------------- | ---------------------------- | ------------------------------------------------------------ |
| `setOnce`               | `(once: boolean)`                              | `RevealConfig`               | Sets the reveal animations activation status on page reload. |
| `setDeviceStatus`       | `(device: Device, status: boolean)`            | `RevealConfig`               | Sets the status of a device.                                 |
| `setDevicesStatus`      | `(devices: Device[], status: boolean)`         | `RevealConfig`               | Sets the status of multiple devices.                         |
| `setDeviceBreakpoint`   | `(device: Device, breakpoint: number)`         | `RevealConfig`               | Sets the breakpoint of a device.                             |
| `setDevice`             | `(device: Device, settings: IDevice)`          | `RevealConfig`               | Sets the settings of a device.                               |
| `setResponsive`         | `(responsive: Responsive)`                     | `RevealConfig`               | Updates how responsiveness is handled by the library.        |
| `setObserverRoot`       | `(root: Element | Document | null)`            | `IntersectionObserverConfig` | Sets the Intersection Observer `root` element.               |
| `setObserverRootMargin` | `(rootMargin: string)`                         | `IntersectionObserverConfig` | Sets the Intersection Observer `rootMargin` property.        |
| `setObserverThreshold`  | `(threshold: number)`                          | `IntersectionObserverConfig` | Sets the Intersection Observer `threshold` property.         |
| `setObserverConfig`     | `(observerConfig: IntersectionObserverConfig)` | `IntersectionObserverConfig` | Sets the Intersection Observer configuration.                |
| `setConfig`             | `(userConfig: RevealConfig)`                   | `RevealConfig`               | Updates the library global configuration.                    |
| `setDefaultOptions`     | `(options: RevealOptions)`                     | `RevealOptions`              | Updates the default options to be used for the reveal effect. |

## Suggestions

If you need to considerably customize the behavior of this library, I suggest creating a dedicated file and to import it from the top-most component in the components tree of your project. Within that file you can then call the API functions to set global settings or shared transition properties.

```typescript
// reveal.config.ts

import { setDefaultOptions } from 'svelte-reveal';

setDefaultOptions({
  blur: 20,
  x: -50,
  duration: 3000
});
```

```svelte
// App.svelte

<script>
  import 'reveal.config';
</script>

<div>{ your markup goes here }</div>
```

## Troubleshooting

Feel free to [open a new issue](https://github.com/DaveKeehl/svelte-reveal/issues/new/choose) in case of any problems.

## Funding

[Want to buy me a coffee?](https://ko-fi.com/davekeehl)

## Versioning

This project uses [Semantic Versioning](https://semver.org/) to keep track of its version number.

## Changelog

[CHANGELOG](./CHANGELOG.md)

## License

[MIT](./LICENSE)
