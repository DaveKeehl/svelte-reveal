# svelte-reveal

svelte-reveal is library created with the purpose of helping Svelte users add reveal on scroll animations to their apps. This library leverages the Intersection Observer API.



## Usage

Using svelte-reveal is dead simple:

1. Install the library:

   ```$ npm install svelte-reveal --save-dev```

   or

   ```$ yarn add svelte-reveal -D```

2. Import the library within your Svelte component:

   ```html
   <script>
     import {reveal} from 'svelte-reveal';
   </script>
   
   <h1 use:reveal>Your title</h1>
   <p use:reveal={{transition: 'fade'}}>A paragraph</p>
   ```



## Why svelte-reveal

If you happened to scout the internet for other similar libraries you would have for sure noticed that other authors decided to use Svelte slots (similar to React's children). There is nothing against that approach, but in my opinion it kinda goes against one of Svelte's core purpose: write less code.

Having to wrap every to-be-transitioned component adds 2 extra lines of code each time, making your files unnecessary bloated for such a simple add-on.

I decided to use Svelte actions instead, which are essentially functions you attach to a DOM element and allow you to get access to that element and to its lifecycle.



## Options

Depending on the use case, you can either use this library as-is (which applies some default styles I have chosen), or customise it to your liking.

You can pass to this action an object containing additional options.



| Option       | Type               | Default                | Other values                                                 | Description                                                  |
| ------------ | ------------------ | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| disable      | ```boolean```      | ```false```            |                                                              | You can disable the transition.                              |
| debug        | ```boolean```      | ```false```            |                                                              | You can enable debugging mode for a specific targeted DOM element by setting this option to ``` true```. This will log all options and configurations to the console.<br />In order to be able to use this mode, you are required to also set the ```ref``` property. |
| ref          | ```string```       | ```""```               |                                                              | When ```debug``` is set to ```true```, you are required to specificy a ```ref``` string. When multiple DOM nodes have ```debug``` mode enabled, ```ref``` strings allow you to know to which DOM node a console log statement belongs to. |
| root         | ```ObserverRoot``` | ```null```             |                                                              | The root element used by the Intersection Observer.          |
| marginTop    | ```number```       | ```0```                |                                                              | Top margin of the rootMargin property of the Intersection Observer. |
| marginBottom | ```number```       | ```0```                |                                                              | Bottom margin of the rootMargin property of the Intersection Observer. |
| marginLeft   | ```number```       | ```0```                |                                                              | Left margin of the rootMargin property of the Intersection Observer. |
| marginRight  | ```number```       | ```0```                |                                                              | Right margin of the rootMargin property of the Intersection Observer. |
| threshold    | ```number```       | ```0.6```              |                                                              | The ```threshold``` (in percentage from 0 to 1) used by the Intersection Observer to know when its target is considered visible or not. |
| transition   | ```string```       | ```"fly"```            | ```"fade"```, ```"blur"```, ```"scale"```, ```"slide"```     | How you want your target node to transition when visible.    |
| delay        | ```number```       | ```500```              |                                                              | Amount of milliseconds (ms) you want to delay a given transition. |
| duration     | ```number```       | ```800```              |                                                              | Amount of milliseconds (ms) you want a given transition to last. |
| easing       | ```string```       | ```"ease"```           | ```"linear"```, ```"ease-in"```, ```"ease-out"```, ```"ease-in-out"```, ```"cubic-bezier"``` | The type of easing function you want to apply to a given DOM node. |
| customEase   | ```CustomEase```   | ```[0.8, 0, 0.2, 1]``` |                                                              | The individual weights of a custom cubic-bezier curve.       |
| x            | ```number```       | ```-20```              |                                                              | The starting position on the x-axis of a given transition (only the "slide" animation supports this property). |
| y            | ```number```       | ```-20```              |                                                              | The starting position on the y-axis of a given transition (only the "fly" animation supports this property). |



## API

svelte-reveal also exposes several functions you can call to change the internal behavior of this library and which will be applied globally to all instances of this action.

Since these functions change the global behavior of the action, you are supposed to call them only from a single file, otherwise you'll keep overriding the global styles from multiple files.

If you want to customise the behavior of a single DOM node, you are supposed to use the options mentioned in the previous section (they override the global ones set by the API).



### setDisableDebug (debug) => void

| Parameter | Type          | Description                                        |
| --------- | ------------- | -------------------------------------------------- |
| debug     | ```boolean``` | Globally disables all logs when set to ```true```. |



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

| Parameter | Type               | Description                                           |
| --------- | ------------------ | ----------------------------------------------------- |
| root      | ```ObserverRoot``` | Globally sets the Intersection Observer root element. |

``````typescript
type ObserverRoot = HTMLElement | null | undefined;
``````



### setObserverRootMargin (rootMargin) => void

| Parameter  | Type         | Description                                                  |
| ---------- | ------------ | ------------------------------------------------------------ |
| rootMargin | ```string``` | Globally sets the Intersection Observer rootMargin property. |



### setObserverThreshold (threshold) => void

| Parameter | Type         | Description                                                 |
| --------- | ------------ | ----------------------------------------------------------- |
| threshold | ```number``` | Globally sets the Intersection Observer threshold property. |



### setOnce (once) => void

| Parameter | Type          | Description                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| once      | ```boolean``` | Runs the scroll animations only once (refreshing the page doesn't re-run them) when once is set to true. |



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



## Changelog

[CHANGELOG](https://github.com/DaveKeehl/svelte-reveal/blob/develop/CHANGELOG.md)



## License

[MIT](https://github.com/DaveKeehl/svelte-reveal/blob/develop/LICENSE)
