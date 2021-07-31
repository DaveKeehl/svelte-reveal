# svelte-reveal

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/DaveKeehl/svelte-reveal)  ![npm](https://img.shields.io/npm/v/svelte-reveal)

svelte-reveal is a library created with the purpose of helping [Svelte](https://svelte.dev/) users add reveal on scroll transitions to their web applications. This library leverages the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) in order to know when to trigger the animations.



## Table of Content

- [Usage](#Usage)
- [Demo](#Demo)
- [Why svelte-reveal](#Why-svelte-reveal)
- [Options](#Options)
- [API](#API)
- [Troubleshooting](#Troubleshooting)
- [Funding](#Funding)
- [Changelog](#Changelog)
- [License](#License)



## Usage

Using svelte-reveal is dead simple:

1. Install the library:

   ```bash
   npm install svelte-reveal --save-dev
   ```

   or

   ```````bash
   yarn add svelte-reveal -D
   ```````

2. Import the library within your Svelte component:

   ```html
   <script>
     import { reveal } from 'svelte-reveal';
   </script>
   
   <h1 use:reveal>Your title</h1>
   <p use:reveal={{transition: "fade"}}>A paragraph</p>
   ```



## Demo

I've put together a demo website where I showcase svelte-reveal in action. [Check it out](https://svelte-reveal.netlify.app).



## Why svelte-reveal

If you happened to scout the internet for other similar libraries, you would have noticed that other authors have decided to create their own library using Svelte [slots](https://svelte.dev/docs#slot) (similar to [React children](https://reactjs.org/docs/composition-vs-inheritance.html)). There is nothing wrong with that approach, but in my opinion it goes a bit against one of Svelte's core purposes: writing less code.

Having to wrap every to-be-transitioned component adds 2 extra lines of code each time, making your files unnecessarily bloated for such a simple add-on.

Instead, I decided to use Svelte [actions](https://svelte.dev/docs#use_action), which are functions you can attach to a DOM element and that allow you to get access to that element and to its lifecycle. They take up considerably less space and so far I haven't encounted any obstacle or performance drawback.



## Options

Depending on the use case, you can either use this library as-is (which applies some default styles I have chosen), or customize it to your liking. If you choose to do so, you can pass to this action an object containing additional options.

Keep in mind that these options are applied to the single DOM element you add svelte-reveal to. For global and more in-depth settings, go to the [API](#API) section.

| Option       | Type               | Default                | Other values                                                 | Description                                                  |
| ------------ | ------------------ | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| disable      | ```boolean```      | ```false```            |                                                              | It enables/disables the transition.                          |
| debug        | ```boolean```      | ```false```            |                                                              | It enables/disables debugging mode for the targeted DOM element. This will log all options and configs to the console.<br />In order to be able to use this mode, you are required to also set the ```ref``` property. |
| ref          | ```string```       | ```""```               |                                                              | When ```debug``` is set to ```true```, you are required to specificy a ```ref``` string. When multiple DOM nodes have ```debug``` mode enabled, ```ref``` strings allow you to know to which DOM node a console log statement belongs to. |
| root         | ```ObserverRoot``` | ```null```             |                                                              | The [root](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root) element used by the Intersection Observer API. |
| marginTop    | ```number```       | ```0```                |                                                              | Top margin of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| marginBottom | ```number```       | ```0```                |                                                              | Bottom margin of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| marginLeft   | ```number```       | ```0```                |                                                              | Left margin of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| marginRight  | ```number```       | ```0```                |                                                              | Right margin of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| threshold    | ```number```       | ```0.6```              |                                                              | The [threshold](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) (in percentage from 0 to 1) property used by the Intersection Observer API to know when its target element is considered visible or not. |
| transition   | ```string```       | ```"fly"```            | ```"fade"```, ```"blur"```, ```"scale"```, ```"slide"```     | How you want your target node to transition when visible.    |
| delay        | ```number```       | ```0```                |                                                              | Amount of milliseconds (ms) you want to delay a given transition. |
| duration     | ```number```       | ```800```              |                                                              | Amount of milliseconds (ms) you want a given transition to last. |
| easing       | ```string```       | ```"ease"```           | ```"linear"```, ```"ease-in"```, ```"ease-out"```, ```"ease-in-out"```, ```"cubic-bezier"``` | The type of easing function you want to apply to a given element. |
| customEase   | ```CustomEase```   | ```[0.8, 0, 0.2, 1]``` |                                                              | The individual weights of a custom cubic-bezier curve.       |
| x            | ```number```       | ```-20```              |                                                              | The starting position on the x-axis of a given transition (only the ```"slide"``` animation supports this property). |
| y            | ```number```       | ```-20```              |                                                              | The starting position on the y-axis of a given transition (only the ```"fly"``` animation supports this property). |



## API

svelte-reveal also exposes several functions you can call to change the internal behavior of this library.

Since these functions operate on a global level for all instances of svelte-reveal, you are supposed to call them only from a single file, otherwise you'll keep overriding the global options from multiple points. If you need/want to change considerably the behavior of this library, I suggest you to create a dedicated file (e.g. reveal.config.js) where you call the API to set global settings or shared transition properties.

If you want to customise the behavior of a single DOM node, you are supposed to use the [options](#Options) mentioned in the previous section (they override the global ones set by the API).



### setDisableDebug (debug) => void

| Parameter | Type          | Description                         |
| --------- | ------------- | ----------------------------------- |
| debug     | ```boolean``` | Globally enables/disables all logs. |



### setObserverConfig (observerConfig) => void

| Parameter      | Type                  | Description                                      |
| -------------- | --------------------- | ------------------------------------------------ |
| observerConfig | ```ObserverOptions``` | Globally sets the Intersection Observer options. |

```typescript
type ObserverRoot = HTMLElement | null | undefined;

interface IObserverOptions {
  root: ObserverRoot;
  rootMargin: string;
  threshold: number;
}
```



### setObserverRoot (root) => void

| Parameter | Type               | Description                                               |
| --------- | ------------------ | --------------------------------------------------------- |
| root      | ```ObserverRoot``` | Globally sets the Intersection Observer API root element. |

``````typescript
type ObserverRoot = HTMLElement | null | undefined;
``````



### setObserverRootMargin (rootMargin) => void

| Parameter  | Type         | Description                                                  |
| ---------- | ------------ | ------------------------------------------------------------ |
| rootMargin | ```string``` | Globally sets the Intersection Observer API rootMargin property. |



### setObserverThreshold (threshold) => void

| Parameter | Type         | Description                                                  |
| --------- | ------------ | ------------------------------------------------------------ |
| threshold | ```number``` | Globally sets the Intersection Observer API threshold property. |



### setOnce (once) => void

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| once      | ```boolean``` | Runs the scroll animations only once when set to true. Refreshing the page doesn't re-run them. |



### setConfig (userConfig) => void

| Parameter  | Type          | Description                                                  |
| ---------- | ------------- | ------------------------------------------------------------ |
| userConfig | ```IConfig``` | By passing an object of type ```IConfig``` you can have full control over all the internal properties. |

``````typescript
type ObserverRoot = HTMLElement | null | undefined;

interface IObserverOptions {
  root: ObserverRoot;
  rootMargin: string;
  threshold: number;
}

interface IConfig {
  disableDebug: boolean;
  once: boolean;
  observer: IObserverOptions;
}
``````



## Troubleshooting

Behind the scenes, in order to work svelte-reveal adds inline styles to the targeted elements. If you have already applied some inline styles (in particular ```transition``` and ```transform``` css properties), they might get overridden by this library.

To avoid this situation, wrap your element in a ```<div>``` or a ```<span>``` and add the  ```use:reveal``` action to that wrapper element.



## Funding

Want to buy me a coffee? ☕️

[https://ko-fi.com/davekeehl](https://ko-fi.com/davekeehl)



## Changelog

[CHANGELOG](https://github.com/DaveKeehl/svelte-reveal/blob/develop/CHANGELOG.md)



## License

[MIT](https://github.com/DaveKeehl/svelte-reveal/blob/develop/LICENSE)
