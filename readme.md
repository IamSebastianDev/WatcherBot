# WatcherBot

WatcherBot is a small, simple bot that uses puppeteer to watch a website for specified changes in a user given interval and has a 'interestingly' themed API.

## Installing

You can install the watcherbot via `npm`.

```bash
npm i watcherbot

```

## Usage

Import the Bot into your node js project

```js
import { WatcherBot } from "watcherbot"
```

To create a new watcher you call its constructor and pass the config to it:

```js
// main.js

import { WatcherBot } from "watcherbot"

const watcher = new WatcherBot(); 

```

### Watching

This is the core aspect of **the Watcher**. To start watching, you need to create at least a `watching` function and pass it to the **Watcher's** `takeWatch` method.

```js
// main.js

const watcher = new WatcherBot();

const watching = async ({ page, keepWatching }) => {

// do something here with puppeteers page object
console.log(page)

// after you're done doing what you want to do, call the keepWatching method to 
// call the loop again

keepWatching(); 

}

// tell the Watcher to takeWatch

watcher.takeWatch({ watching }); 
 
```

The `async` `watching` method is passed a `Object` with the following properties:

property name|type| description
-----------  |:---------------------------:|-------------
page |Puppeteer \<Page> Object. | The page that Puppeteer is accessing at the moment.
browser | Puppeteer \<Browser> Object | The Puppeteer browser instance that was created.
keepWatching | \<Function> | The function that is called to restart the watch loop.
endOfWatch   | \<Function> | A optional function that should be used to exit the loop.
dangerDrawsNear | \<Function>  | A optional function that should be used to handle errors.
theWatcher | \<Object> | A reference to the Watcher itself.

> Note: The `watching` method is the core of the bot. You have full access to the puppeteer `browser` and `page` object and it's API. To read more about this, visit the [Puppeteer docs](https://pptr.dev).

### Taking the Watch

To initate the cycle of watches, you call the `takeWatch()` function on the created **Watcher**.

```js
// main.js

watcher.takeWatch({ watching, dangerDrawsNear, endOfWatch }); 

// This will initate the cylce of watches as long as the 'keepWatching' 
// method is called inside watching.
```

The method takes a `Object` as argument with the following properties:

property name| type | description
-------------|:------------:|-------------
keepWatching | \<Function>  | The `async` function that is called to restart the watch loop.
endOfWatch   | \<Function?> | A optional `async` function that should be used to exit the loop.
dangerDrawsNear | \<Function?> | A optional `async` function that should be used to handle errors.

-

### Ending the Watch

Once you completed the task at hand, or you found the expected change in your watched webpage, you need to exit the loop and call the method that will notify you. How you are being notfied, being it via email or messenger or a terminal beep is up to you. You should use the `async` `endOfWatch` method for this.

```js
// main.js

const endOfWatch = ({ browser, theWatcher }) => {

  // notifiy the user that your expected condition is now true
  notifyUser(); 
  
  // if you're curios, you can call the 'theWatcher.tellATale()' method to 
  // log the metrics of your watch to the console.
  theWatcher.tellATale(); 
  
  // once you're done using the browser, you should close it to avoid memory leaks.
  await browser.close(); 

}

```

> Note: While for now this method & the `dangerDrawsNear` method is passed directly back to the `watching` method, in the future their might be extra operations executed when the method is called.

The Method takes an Object with the following properties as it's only argument.

property name|type| description
-----------  |:---------------------------:|-------------
page |Puppeteer \<Page> Object. | The page that Puppeteer is accessing at the moment.
browser | Puppeteer \<Browser> Object | The Puppeteer browser instance that was created.
theWatcher | \<Object> | A reference to the Watcher itself.

-

> Note: You can read more about those functions in the API reference section of this document. You can also look at the example code in the Example section.

## Configuring your Watcher

There are multiple ways to configure your **Watcher**.

### using JSON

A `watcherbot.config.json` file can be created in the root directory of your project. That will be parsed automatically and take precedence over all other forms of configuration.

```json
{
  "url" : "<string>",
  "watchLength" : <number?>,
  "watcherName" : "<string?>",
  "logEnabled" : <boolean?>,
  "logDetails" : <boolean?>,
  "logTime" : <boolean?>
}

```

### using JavaScript

The WatcherBot constructor accepts a configuration object that can be used to configure the instance. This makes it possible to have different configurations for different instances, something that is not possible when using a configuration JSON file.

```js
// main.js

import { WatcherBot } from "watcherbot";

const config = {
  url: <string>,
  watchLength: <number?>
  watcherName: <string?>
  logEnabled: <boolean?>
  logDetails: <boolean?>
  logTime: <boolean?>
}

const watcher = new WatcherBot(config); 

```

> Note: To improve your code structure, it can be a good idea to create a extra configuration file and import your configuration, instead of creating it in your main.js file or inline. That's up to you though.

### Declaring the configuration inline

You can also simply pass the parameters you want to change from the defaults to constructor directly, instead of creating a config object.

```js
// main.js

import { WatcherBot } from "watcherbot"; 

const watcher = new WatcherBot({ url: <string> });

// this will create the Watcher with the specified URL and will use the 
// default values for the rest of the properties.

```

### Reference

- `url <string>` - The target URL the created Bot will navigate to.
- `watchLength <number?>` - The time between page reloads in **seconds**. The default value is 60. The Value cannot be smaller then 0.5s.
- `watcherName <string?>` - A name given to the bot which will be added to the console messages if they are enabled. Useful if you run multiple Bots at the same time. The default is no name.
- `logEnabled <boolean?>` - A boolean indicating if the Bot should log it's progress to the console. Default is true.
- `logDetails <boolean?>` - A boolean indicating if the Bot should log the amount of cycles and the time the last cycle took to the console. Default is false.
- `logTime <boolean?>` - A boolean indicating if a timestamp should be logged to the console when the Bot reports a update. Default is false.

## API Reference

The following section details all public methods and properties that exist on the WatcherBot Class.

### `WatcherBot <Class>`

```js
// main.js

import { WatcherBot } from "watcherbot"; 

const watcher = new WatcherBot(config<Object>)

```

The `WatcherBot` class is used to create a new watcher. The constructor is used to configure the bot, if no `watcherbot.config.json` file exsists in the root of your projeect.

> Note: To see the details of the configuration object, see the [Configuring your Watcher](#configuring-your-watcher) section.

<!---->
> Note: All methods & properties below reference a created watcher instance. `WatcherBot` does not have any static methods or properties.

--

### `watcher.takeWatch <function>`

```js
// tell the watcher to take it's watch, and tell him what to do.

watcher.takeWatch({ watching, endOfWatch })

```

The `takeWatch` method is a `public`, `async` method of the watcher used to initate a watch cycle. User created `watching`, `endOfWatch` & `dangerDrawsNear` methods can be passed to the method to make them accessible. The method's arguments in detail:

property name|type| description
-----------  |:---------:|-------------
watching | \<function> | The main loop function defined by the user. Can not be ommited.
endOfWatch | \<function?> | A method to end the loop.
dangerDrawsNear | \<function?> | A method to react on an error thrown inside the loop.

--

### `watcher.tellATale <function>`

A method to log a detailed summary of the watchers progress to the console. The method is accessible directly on the created **watcher**.

```js
// tell the watcher to tell it's tale and report it's gathered statistics.

watcher.tellATale({ time: true, watches: true})
```

Will result in this (example) output:

```bash
The Watcher: Still watching...
The Watcher: And now my watch has ended...
I completed 5 watches in this time.
I stood watch for 54.655 seconds.
```

property name|type| description
-----------  |:---------:|-------------
time | \<boolean?> | A boolean indicating if the taken time should be logged. Defaults to true.
watches | \<boolean?> | A boolean indicating if the number of watches taken should be logged. Defaults to true.

> Note: While the method can be anytime on the created watcher, calling it inside the `endOfWatch` method makes the most sense, as this will exit the loop and you can log the final metrics.

--

### `watcher.theWatchersName <string>`

A property returning the name of the created watcher.

--

### `watcher.watchesTaken <number>`

A property returning the amount of completes cycles.

--

### `watching <async function>`

The `watching` method is passed to the `takeWatch` method and is executed once the **watcher** begins its watch. This method does not exist on the watcher, but is instead created by the user itself. It is, in it's most basic form, a callback function that is repeatedley called until the used decides to exit it through a condition. The main part of the **watchers** work takes place in this method.

```js
// the method receives the `page` and `browser` objects that is created by puppeteer
// It has access to the full puppeteer API.
// The method will continiously check a webpage for the inclusion of a
// certain text phrase, which is one of the simplest examples.

const watching = async ({ page, keepWatching, endOfWatch }) => {

    // get the content of the page
    
    const content = await page.content(); 
    
    // check if content includes what you're looking for.
    
    if(content.includes('I am the watcher on the wall')) {
    
        // if the page does include the string, we have found what
        // we were looking for, we can now exit the loop and call the
        // endOfWatch method.
    
        endOfWatch(); 
    } 
    
    // if the page does not yet include the text, call the 
    // keep watching method to wait out the specified time 
    // between reloads, and then call the watching method again
    
    keepWatching()
}

```

The following properties are passed to the method:

property name|type| description
-----------  |:---------------------------:|-------------
page |Puppeteer \<Page> Object. | The page that Puppeteer is accessing at the moment.
browser | Puppeteer \<Browser> Object | The Puppeteer browser instance that was created.
keepWatching | \<Function> | The function that is called to restart the watch loop.
endOfWatch   | \<Function> | A optional function that should be used to exit the loop.
dangerDrawsNear | \<Function>  | A optional function that should be used to handle errors.
theWatcher | \<Object> | A reference to the Watcher itself.

--

### `endOfWatch <async function>`

The `endOfWatch` method is passed to the `takeWatch` method and is then passed back to the `watching` method with access to certain properties. This method does not exist on the watcher, but is instead created by the user itself. The method is used to exit the loop, close the browser, and perform any kind of notification the used intends to do.

```js
// the method receives the `page` and `browser` objects that is created by 
// puppeteer, as well as the watcher itself. You can also overload the method,
// by passing arguments when you call it. Those will then be accessible after the
// first object with the WatcherBot methods.

const endOfWatch = async ({ page, browser, theWatcher }) => {
    
    // You could, for example, email the user, that what ever he was looking for,
    // has been found. 
    
    const respose = await EmailUser({
        to: `example@example.com`, 
        from: theWatcher.theWatchersName,
        body: `My watch has ended. I found what you were looking for!`,
    })
    
    // closee the browser instance
    await browser.close()
}

```

The following properties are passed to the method:

property name|type| description
-----------  |:---------------------------:|-------------
page |Puppeteer \<Page> Object. | The page that Puppeteer is accessing at the moment.
browser | Puppeteer \<Browser> Object | The Puppeteer browser instance that was created.
theWatcher | \<Object> | The created watcher instance.

--

### `dangerDrawsNear <async function>`

The `dangerDrawsNear` method is passed to the `takeWatch` method and is then passed back to the `watching` method with access to certain properties. This method does not exist on the watcher, but is instead created by the user itself. The method is used to exit the loop, and handle any error occuring. The method can be overload to pass the error to it.

```js
// the method receives the `page` and `browser` objects that is created by 
// puppeteer, as well as the watcher itself. You can also overload the method,
// by passing arguments when you call it. Those will then be accessible after the
// first object with the WatcherBot methods.

const dangerDrawsNear = async ({ page, browser, theWatcher }, error) => {
    
    // throw an error to the console, then exit the process all together
    
    throw new Error(error); 
    
    process.exit(); 
}

```

The following properties are passed to the method by default:

property name|type| description
-----------  |:---------------------------:|-------------
page |Puppeteer \<Page> Object. | The page that Puppeteer is accessing at the moment.
browser | Puppeteer \<Browser> Object | The Puppeteer browser instance that was created.
theWatcher | \<Object> | The created watcher instance.

## Example Code

The following snippets show a complete example of what a **watcher** could look like. It is a working example, so you can copy this code to test it out.

First, create a new project and install watcherbot. This example assumes you have [node.js](https://nodejs.dev) installed already.

```bash
npm init -y
npm i watcherbot
```

After this, create a new file called `main.js`. This will contain our little **watcher** code.

```js
// main.js

// In this very simple example, we are going to check a website for changes.
// The website shows the current minute, and we would like to know when the hour is up.
// For this, we are going to poll the website once a minute, and check the textContent 
// of the #minute element.

// import the WatcherBot class after installing it via npm

import { WatcherBot } from "watcherbot"

// the url we want to watch

const url = 'https://minute-nine.vercel.app';

// the amount of time between watches

const watchLength = 60;

// creating the watcher

const watcher = new WatcherBot({ url, watchLength }); 

// We now need to setup our 'watching' & 'endOfWatch' methods

const watching = async({ page, endOfWatch }) => {
    
    // get the minute part of the website by using the $eval() method 
    // of puppeteer and search for the '#minute' selector.
    
    const minutes = await page.$eval('#minute', element => {
        return element.textContent
    }) 
    
    // we then check if the textContent is equal to "00"
    // and if true, call the endOfWatch() method
    // if false, call the keepWatching() method to restart the loop
    
    minutes === "00" ? endOfWatch() : keepWatching();  
}

const endOfWatch = async({ browser, theWatcher }) => {

    // log the result to the console.
    console.log(`Hey! It's a new hour!`)
    
    // we can also log the metrics to the console, in case we're curios
    theWatcher.tellATale(); 

    // finally, we close the browser instance
    broser.close(); 

}

// After setting up the methods, we pass them to the takeWatch method of our bot.

watcher.takeWatch({ watching, endOfWatch }); 
```

After creating the main js file, you can call it like this inside your terminal.

```bash
node main.js
```

Your little **watcher** should now start watching for the minutes changing and tell you when the hour is up.

## Dependencies

WatcherBot uses [Puppeteer](https://github.com/puppeteer/puppeteer) under the hood.

## License

Watcherbot is licensed under the [MIT License](https://opensource.org/licenses/MIT)
