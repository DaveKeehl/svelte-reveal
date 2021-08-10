![](assets/readme_cover_0.1.0.png)

# svelte-reveal

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/DaveKeehl/svelte-reveal/tree/develop)  ![npm](https://img.shields.io/npm/v/svelte-reveal)  [![CI/CD](https://github.com/DaveKeehl/svelte-reveal/actions/workflows/main.yml/badge.svg)](https://github.com/DaveKeehl/svelte-reveal/actions/workflows/main.yml)  ![GitHub](https://img.shields.io/github/license/davekeehl/svelte-reveal)  [![codecov](https://codecov.io/gh/DaveKeehl/svelte-reveal/branch/develop/graph/badge.svg?token=AL1KI5XRDF)](https://codecov.io/gh/DaveKeehl/svelte-reveal)

svelte-reveal is a library created with the purpose of helping [Svelte](https://svelte.dev/) users add reveal on scroll transitions to their web applications. This library leverages the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) in order to know when to trigger the animations.

> ⚠️ svelte-reveal is currently in beta and it needs people to use it and test it out in different situations. Support for SvelteKit is experimental.

## Table of Content

- [Usage](#Usage)
- [Demo](#Demo)
- [Why svelte-reveal](#Why-svelte-reveal)
- [Options](#Options)
- [API](#API)
- [Suggestions](#Suggestions)
- [Troubleshooting](#Troubleshooting)
- [Funding](#Funding)
- [Versioning](#Versioning)
- [Changelog](#Changelog)
- [License](#License)



## Usage

Using svelte-reveal is dead simple:

1. Install the library. You can use either [npm](https://www.npmjs.com/):

   ```bash
   npm install svelte-reveal --save-dev
   ```

   or [yarn](https://yarnpkg.com/):

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



A Docker image is also available on [DockerHub](https://hub.docker.com/):

```bash
docker pull davekeehl/svelte-reveal:latest
```



## Demo

I've put together a demo website where I showcase svelte-reveal in action. [Check it out](https://svelte-reveal.netlify.app).



## Why svelte-reveal

If you happened to scout the internet for other similar libraries, you would have noticed that other authors have decided to create their own library using Svelte [slots](https://svelte.dev/docs#slot) (similar to [React children](https://reactjs.org/docs/composition-vs-inheritance.html)). There is nothing wrong with that approach, but in my opinion it goes a bit against one of Svelte's core purposes: writing less code.

Having to wrap every to-be-transitioned component adds 2 extra lines of code each time, making your files unnecessarily bloated for such a simple add-on.

Instead, I decided to use Svelte [actions](https://svelte.dev/docs#use_action), which are functions you can attach to a DOM element and that allow you to get access to that element and to its lifecycle. They take up considerably less space and so far I haven't encounted any obstacle or performance drawback.



## Options

Depending on the use case, you can either use this library as-is (which applies some [default styles](https://github.com/DaveKeehl/svelte-reveal/blob/develop/src/index.ts#L5-L30) I have chosen), or customize it to your liking. If you choose to do so, you can pass to this action an object containing additional options.

Keep in mind that these options are applied to the single DOM element you add svelte-reveal to. For global and more in-depth settings, go to the [API](#API) section.

| Name           | Type               | Default                | Description                                                  |
| -------------- | ------------------ | ---------------------- | ------------------------------------------------------------ |
| disable        | ```boolean```      | ```false```            | It enables/disables the transition.                          |
| debug          | ```boolean```      | ```false```            | It enables/disables debugging mode for the targeted DOM element. This will log all options and configs to the console.<br />In order to be able to use this mode, you are required to also set the ```ref``` property. |
| ref            | ```string```       | ```""```               | When ```debug``` is set to ```true```, you are required to specificy a ```ref``` string. When multiple DOM nodes have ```debug``` mode enabled, ```ref``` strings allow you to know to which DOM node a console log statement belongs to. |
| highlightLogs  | ```boolean```      | ```false```            | When set to ```true``` the console logs of the target node get colored, making it easier to see them quicker among many other logs. |
| highlightColor | ```string```       | ```"tomato"```         | You can use this option to tweak the console logs when ```highlightLogs``` is set to ```true```. |
| root           | ```ObserverRoot``` | ```null```             | The [root](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root) element used by the Intersection Observer API. |
| marginTop      | ```number```       | ```0```                | Top margin (in *px* or *%*) of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| marginBottom   | ```number```       | ```0```                | Bottom margin (in *px* or *%*) of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| marginLeft     | ```number```       | ```0```                | Left margin (in *px* or *%*) of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| marginRight    | ```number```       | ```0```                | Right margin (in *px* or *%*) of the [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) property of the Intersection Observer API. |
| threshold      | ```number```       | ```0.6```              | The [threshold](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) (in percentage from 0.0 to 1.0) property used by the Intersection Observer API to know when its target element is considered visible or not. |
| transition     | ```string```       | ```"fly"```            | The animation that will be triggered when your target node becomes visible.<br />[Check out](https://github.com/DaveKeehl/svelte-reveal/blob/develop/src/types.ts#L163) the full list of available transitions. |
| reset          | ```boolean```      | ```false```            | When set to true, the node transitions out when it's out of view from the Intersection Observer. |
| delay          | ```number```       | ```0```                | The amount of milliseconds (*ms*) you want to delay a given transition. |
| duration       | ```number```       | ```800```              | The amount of milliseconds (*ms*) you want a given transition to last. |
| easing         | ```string```       | ```"ease"```           | The type of easing function you want to apply to a given element.<br />[Check out](https://github.com/DaveKeehl/svelte-reveal/blob/develop/src/types.ts#L168-L194) the full list of available easing functions. |
| customEasing   | ```CustomEasing``` | ```[0.8, 0, 0.2, 1]``` | The individual weights of a custom cubic-bezier curve. [This website](https://cubic-bezier.com/) is great for previewing timing functions. |
| x              | ```number```       | ```-20```              | The starting offset position in pixels (*px*) on the x-axis of a given transition (only the ```"slide"``` animation supports this property). |
| y              | ```number```       | ```-20```              | The starting offset position in pixels (*px*) on the y-axis of a given transition (only the ```"fly"``` animation supports this property). |
| deg            | ```number```       | ```-360```             | The number of degrees (*deg*) you want your node to rotate when being revealed with (only the ```"spin"``` animation supports this property). |



Among the available options you can set, there are also some callback functions you can leverage to inject some code during specific moments of the lifecycle of the nodes attached to this action:

### Callbacks

| Name          | Args                      | Return     | Description                                                  |
| ------------- | ------------------------- | ---------- | ------------------------------------------------------------ |
| onRevealStart | ```(node: HTMLElement)``` | ```void``` | Function that gets fired when the node starts being revealed. |
| onRevealEnd   | ```(node: HTMLElement)``` | ```void``` | Function that gets fired when the node is fully revealed.    |
| onResetStart  | ```(node: HTMLElement)``` | ```void``` | Function that gets fired when the reset option is set to true and the node starts transitioning out. |
| onResetEnd    | ```(node: HTMLElement)``` | ```void``` | Function that gets fired when the reset option is set to true and the node has fully transitioned out. |
| onMount       | ```(node: HTMLElement)``` | ```void``` | Function that gets fired when the node is mounted on the DOM. |
| onUpdate      | ```(node: HTMLElement)``` | ```void``` | Function that gets fired when the action options are updated. |
| onDestroy     | ```(node: HTMLElement)``` | ```void``` | Function that gets fired when the node is unmounted from the DOM. |



## API

svelte-reveal also exposes several functions you can call to change the internal behavior of this library.

Since these functions operate on a global level for all instances of svelte-reveal, you are supposed to only call them from a single file, otherwise you'll keep overriding the global options from multiple points. If you need/want to considerably customize the behavior of this library, I suggest you to create a dedicated file (e.g. reveal.config.js) and from there call the API to set global settings or shared transition properties.

If you want to customise the behavior of a single DOM node, you are supposed to use the [options](#Options) mentioned in the previous section (they override the global ones set by the API).



This library is globally configured as follows right of out the box:

| Parameter           | Type               | Default                 | Description                                                  |
| ------------------- | ------------------ | ----------------------- | ------------------------------------------------------------ |
| dev                 | ```boolean```      | ```true```              | Globally enables/disables all logs.                          |
| once                | ```boolean```      | ```false```             | Runs the scroll animations only once when set to ```true```. When set to ```true```, refreshing the page doesn't re-run them. |
| observer.root       | ```ObserverRoot``` | ```null```              | The Intersection Observer API root element.                  |
| observer.rootMargin | ```string```       | ```"0px 0px 0px 0px"``` | The Intersection Observer API rootMargin property.           |
| observer.threshold  | ```number```       | ```0.6```               | The Intersection Observer API threshold property.            |



These config parameters can be manipulated with the following functions. **All API functions return the global config object with the updated properties.**

### setDev

| Args                 | Return        | Description                         |
| -------------------- | ------------- | ----------------------------------- |
| ```(dev: boolean)``` | ```IConfig``` | Globally enables/disables all logs. |

### setOnce

| Args                  | Return        | Description                                                  |
| --------------------- | ------------- | ------------------------------------------------------------ |
| ```(once: boolean)``` | ```IConfig``` | Runs the scroll animations only once when set to true. Refreshing the page doesn't re-run them. |

### setObserverRoot

| Args                       | Return        | Description                                               |
| -------------------------- | ------------- | --------------------------------------------------------- |
| ```(root: ObserverRoot)``` | ```IConfig``` | Globally sets the Intersection Observer API root element. |

``````typescript
type ObserverRoot = HTMLElement | null | undefined;
``````

### setObserverRootMargin

| Args                       | Return        | Description                                                  |
| -------------------------- | ------------- | ------------------------------------------------------------ |
| ```(rootMargin: string)``` | ```IConfig``` | Globally sets the Intersection Observer API rootMargin property. |

### setObserverThreshold

| Args                      | Return        | Description                                                  |
| ------------------------- | ------------- | ------------------------------------------------------------ |
| ```(threshold: number)``` | ```IConfig``` | Globally sets the Intersection Observer API threshold property. |

### setObserverConfig

| Args                                    | Return        | Description                                      |
| --------------------------------------- | ------------- | ------------------------------------------------ |
| ```(observerConfig: ObserverOptions)``` | ```IConfig``` | Globally sets the Intersection Observer options. |

```typescript
type ObserverRoot = HTMLElement | null | undefined;

interface IObserverOptions {
  root: ObserverRoot;
  rootMargin: string;
  threshold: number;
}
```

### setConfig

| Args                        | Type          | Description                                                  |
| --------------------------- | ------------- | ------------------------------------------------------------ |
| ```(userConfig: IConfig)``` | ```IConfig``` | By passing an object of type ```IConfig``` you can have full control over all the internal properties. |

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



## Suggestions

In order to take full advantage of this library, I suggest you to create some environment variables to keep track of the environment you are currently in (e.g. development, staging, production) and to leverage npm scripts to update those variables. [This article](https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html) explains well this concept.

That way you can for example set the config ```dev``` property to ```false``` when in production and avoid exposing console logs to the end users.

If you use [SvelteKit](https://kit.svelte.dev/), this feature is available right out of the box with the [$app/env](https://kit.svelte.dev/docs#modules-$app-env) module.

> ⚠️ Support for SvelteKit is currently experimental.


## Troubleshooting

Behind the scenes, in order to work svelte-reveal adds inline styles to the targeted elements. If you have already applied some inline styles (in particular ```transition``` and ```transform``` css properties), they might get overridden by this library.

To avoid this situation, wrap your element in a ```<div>``` or a ```<span>``` and add the  ```use:reveal``` action to that wrapper element.



## Funding

[Want to buy me a coffee?](https://ko-fi.com/davekeehl) ☕️



## Versioning

This project uses semantic versioning ([semver](https://semver.org/)) to keep track of its version number.



## Changelog

[CHANGELOG](https://github.com/DaveKeehl/svelte-reveal/blob/develop/CHANGELOG.md)



## License

[MIT](https://github.com/DaveKeehl/svelte-reveal/blob/develop/LICENSE)
