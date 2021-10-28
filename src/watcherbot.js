/** @format */

import Puppeteer from 'puppeteer';
import fs from 'fs';

class WatcherBot {
	/**
	 *
	 * @param { Object } param0
	 * @param { String } param0.url
	 * @param { Number } param0.watchLength
	 * @param { String } param0.watcherName
	 * @param { Boolean } param0.logEnabled
	 * @param { Boolean } param0.logDetails
	 * @param { Boolean } param0.logTime
	 */

	constructor({
		url,
		watchLength = 60,
		watcherName = '',
		logEnabled = true,
		logDetails = false,
		logTime = false,
	} = {}) {
		/**
		 * Try to read the config file. As this is a class constructor function, the file must be read synchronosly.
		 * The Config file takes precedence over arguments passed to the constructor.
		 */
		let config;
		try {
			config = JSON.parse(
				fs.readFileSync(
					process.cwd() + '/watcherbot.config.json',
					'utf-8'
				)
			);
		} catch (e) {
			config = undefined;
		}

		/**
		 *  @private
		 *  @type { String }
		 *
		 *  @description the target url for the bot to watch. The Bot will report when the page changes
		 *
		 */

		this._target = config?.url || url;

		// check if the url is undefined or an empty string
		if (this._target == undefined || this._target == '') {
			this.log.noURL();
			// exit the process, as without url, a crawl is not possible

			process.exit();
		}

		/**
		 *  @private
		 *  @type { Number }
		 *
		 *  @description the number of milliseconds between the two versions of the page to compare. Lowering the
		 *  amount may increase network load on the target
		 *
		 */

		this._refreshCycle = this._assertRefreshCycle({
			watchLength: config?.watchLength || watchLength,
		});

		/**
		 * 	@private
		 * 	@type { Number }
		 *
		 * 	@description the point in time in ms when the request was initated last
		 */

		this._lastRequestTimeStamp = undefined;

		/**
		 * @private
		 * @type { boolean }
		 *
		 * @description a boolean indicating if the progress of watching the page should be logged
		 * to the console.
		 */

		this._logEnabled = config?.logEnabled || logEnabled;

		/**
		 * @private
		 * @type { boolean }
		 *
		 * @description a boolean indicating if the details of watching the page should be logged
		 * to the console.
		 */

		this._logDetails = config?.logDetails || logDetails;

		/**
		 * @private
		 * @type { boolean }
		 *
		 * @description a boolean indicating if the timestamp of watching the page should be logged
		 * to the console.
		 */

		this._logTime = config?.logTime || logTime;

		/**
		 * @public
		 * @type { Number }
		 *
		 * @description the amount of times the keepWatching method has been executed, indicating the amount of cycles
		 * completed.
		 */

		this.watchesTaken = 0;

		/**
		 * @public
		 * @type { String }
		 *
		 * @description a custom name that can be supplied to denote the bot's messages in the console.
		 */

		this.theWatchersName = config?.watcherName || watcherName;
	}

	/**
	 *
	 *  @private
	 *  @description method to assert the time to refresh to be between the supposed parameters. The ttr should not be
	 *  below 100ms and has no upper bounds
	 *
	 *  @param { {} } param0 - the object passed to the method that contains property for the configuration
	 *  @param { Number } param0.watchLength - the number in seconds between refreshes of the page
	 *
	 *  @returns { Number } the number of milliseconds betweeen each refresh
	 */

	_assertRefreshCycle({ watchLength }) {
		// check if the passed argument is not null, undefined or 0

		if (
			watchLength == 0 ||
			watchLength == undefined ||
			watchLength == null
		) {
			return;
		}

		// the refresh time should be in ms, so the provided argument is mulitplied by 1000 to convert seconds into milliseconds

		const timeInMs = watchLength * 1000;

		// the minimum time between request should be 100 ms atleast. If the timeInMs is smaller then that, if will be set to 100

		return timeInMs > 100 ? timeInMs : 100;
	}

	/**
	 * @private
	 * @property { Number }
	 */

	get _remainingOffset() {
		const now = Date.now();

		const lastRequest =
			this._lastRequestTimeStamp == undefined
				? now
				: this._lastRequestTimeStamp;
		/**
		 *
		 * The remaining offset is the difference between the current timestamp now and the lastRequestTimetamp added
		 * to the refreshcycle value. The lastRequestTimeTstamp + the refreshCycle value add up to a point in the
		 * future that is then subtracted from the currentTimestamp. If the value is postive, a offset amount remains.
		 * If the value is negative, the request could not be completet before the timer ran out.
		 *
		 */

		const remainingOffset = lastRequest + this._refreshCycle - now;

		if (remainingOffset > 0) {
			return remainingOffset;
		} else {
			this._log.offsetOvertime(remainingOffset);
			return this._refreshCycle;
		}
	}

	/**
	 * @private
	 * @property { Object } log - A property containing methods to log different messages to the console
	 */

	_log = {
		colorCyan: '\x1b[36m%s\x1b[0m',
		colorBlue: '\x1b[34m%s\x1b[0m',
		colorOrange: '\x1b[31m%s\x1b[0m',
		colorGreen: '\x1b[32m%s\x1b[0m',
		botName: `The Watcher${this.botName ? `@${this.botName}` : ''}:`,
		update: () => {
			const time = new Date().toLocaleTimeString();
			console.log(
				this._log.colorCyan,
				`${this._log.botName}${
					this._logTime ? `@${time}` : ''
				} Still watching...`
			);
		},
		details: (remainingOffset) => {
			console.log(
				this._log.colorBlue,
				`${this._log.botName} Cycle ${
					this.watchCycles
				}. Last cycle was approximately ${
					this._refreshCycle - remainingOffset
				}ms.`
			);
		},
		noURL: () => {
			console.log(
				this._log.colorOrange,
				`${this._log.botName} The specified URL is either undefined or empty.`
			);
		},
		noWatch: () => {
			console.log(
				this._log.colorOrange,
				`${this._log.botName} There is nothing to watch for. Pass a 'watching' function to the 'takeWatch' function.`
			);
		},
		offsetOvertime: (remainingOffset) => {
			console.log(
				this._log.colorOrange,
				`${this._log.botName} The request took ${remainingOffset}ms longer then the specified offset. Timings may not be accurate anymore. Try increasing the 'config.watchLength' value.`
			);
		},
		watchEnd: () => {
			console.log(
				this._log.colorGreen,
				`${this._log.botName} And now my watch has ended...`
			);
		},
		tellATaleOfTime: () => {
			console.log(
				this._log.colorGreen,
				`I stood watch for ${
					(Date.now() - this.watchStarted) / 1000
				} seconds.`
			);
		},
		tellATaleOfEndurance: () => {
			console.log(
				this._log.colorGreen,
				`I completed ${
					this.watchesTaken <= 1
						? `${this.watchesTaken} watch`
						: `${this.watchesTaken} watches`
				} in this time.`
			);
		},
	};

	/**
	 *
	 * @public
	 * @description the takeWatch method is used to being watching for the changes you want to observe. You must pass
	 * a "watching" function that will execute your comparison. The "watching" method is passed the created browser &
	 * page, as well as the endOfWatch and dangerDrawsNear methods and the watcher itself. The method is the main way
	 * to interact with the created page, and the regular puppeteer api applies.
	 *
	 * The endOfWtach method should be used to exit the created loop.
	 * The dangerDrawsNear method should be used to handle errors.
	 * Both are passed to the watching method, and are passed the page & browser & watcher.
	 *
	 * @param { Object } param0 - optional object passed to the method to configure the response
	 * @param { Function } param0.endOfWatch - method that should be executed when a change in the website is detected
	 * @param { Function } param0.dangerDrawsNear - method that should be executed when a error is detected
	 * @param { Function } param0.watching - method that will be executed everytime the bot keeps watching
	 *
	 */

	async takeWatch({ endOfWatch, dangerDrawsNear, watching } = {}) {
		if (watching == undefined) {
			this._log.noWatch();
			process.exit();
		}

		/**
		 * @type { Number }
		 * @description millisecond timestamp that is created when the method is called.
		 * This is later used to determine the length of the watch.
		 */

		this.watchStarted = Date.now();

		/**
		 * @type { Browser }
		 * @description the Browser instance that is created to watch the requestes webpage
		 */

		const browser = await Puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		/**
		 * @type { Page }
		 * @description create a page and navigate to the target
		 */

		const page = await browser.newPage();
		await page.goto(this._target);

		// if the onChange (endOfWatch) method is not undefined, bind this and page and browser to it

		const endOfWatchBound = endOfWatch
			? endOfWatch.bind(this, { page, browser, theWatcher: this })
			: undefined;

		// if the onError (endOfWatch) method is not undefined, bind this and page and browser to it

		const dangerDrawsNearBound = dangerDrawsNear
			? dangerDrawsNear.bind(this, { page, browser, theWatcher: this })
			: undefined;

		const keepWatching = async ({ reload = true } = {}) => {
			// increase the watch cycle count

			this.watchesTaken++;

			// reload the page if the reload argument is not false;

			reload ? await page.reload() : null;

			/**
			 * If the logMessages property is set to true, log a message to the console indicating that the bot is
			 * still watching.
			 */

			const remainingOffset = this._remainingOffset;

			this._logEnabled ? this._log.update() : null;
			this._logDetails ? this._log.details(remainingOffset) : null;

			/**
			 *
			 * A timeout is set which will execute the navigtate method once the remaining timeout is over. The
			 * remaining timeout is calculated from the cycleTimeValue and the last time a request was initated, which
			 * is also done when the method is executed
			 *
			 */

			setTimeout(async () => {
				this._lastRequestTimeStamp = Date.now();
				await watching({
					endOfWatch: endOfWatchBound,
					dangerDrawsNear: dangerDrawsNearBound,
					theWatcher: this,
					keepWatching,
					page,
					browser,
				});
			}, remainingOffset);
		};

		/**
		 * Call the keep watching function to initate the watchmode. The watchmode will continue until keepWatching is
		 * no longer called.
		 */

		keepWatching();
	}

	/**
	 * @public
	 * @param { Object } param0 - the object passed to the method to configure it's response.
	 *
	 * @description method to log the metrics of the Bot to the console.
	 *
	 */

	tellATale({ time = true, watches = true } = {}) {
		this._log.watchEnd();
		watches ? this._log.tellATaleOfEndurance() : null;
		time ? this._log.tellATaleOfTime() : null;
	}
}

export { WatcherBot };
