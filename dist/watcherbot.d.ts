export class WatcherBot {
    /**
     *
     * @param { Object } param0
     * @param { String } param0.url
     * @param { Number } param0.timeToRefresh
     * @param { String } param0.watcherName
     * @param { Boolean } param0.logEnabled
     * @param { Boolean } param0.logDetails
     * @param { Boolean } param0.logTime
     */
    constructor({ url, timeToRefresh, watcherName, logEnabled, logDetails, logTime, }?: {
        url: string;
        timeToRefresh: number;
        watcherName: string;
        logEnabled: boolean;
        logDetails: boolean;
        logTime: boolean;
    });
    /**
     *  @private
     *  @type { String }
     *
     *  @description the target url for the bot to watch. The Bot will report when the page changes
     *
     */
    private _target;
    /**
     *  @private
     *  @type { Number }
     *
     *  @description the number of milliseconds between the two versions of the page to compare. Lowering the
     *  amount may increase network load on the target
     *
     */
    private _refreshCycle;
    /**
     * 	@private
     * 	@type { Number }
     *
     * 	@description the point in time in ms when the request was initated last
     */
    private _lastRequestTimeStamp;
    /**
     * @private
     * @type { boolean }
     *
     * @description a boolean indicating if the progress of watching the page should be logged
     * to the console.
     */
    private _logEnabled;
    /**
     * @private
     * @type { boolean }
     *
     * @description a boolean indicating if the details of watching the page should be logged
     * to the console.
     */
    private _logDetails;
    /**
     * @private
     * @type { boolean }
     *
     * @description a boolean indicating if the timestamp of watching the page should be logged
     * to the console.
     */
    private _logTime;
    /**
     * @public
     * @type { Number }
     *
     * @description the amount of times the keepWatching method has been executed, indicating the amount of cycles
     * completed.
     */
    public watchesTaken: number;
    /**
     * @public
     * @type { String }
     *
     * @description a custom name that can be supplied to denote the bot's messages in the console.
     */
    public theWatchersName: string;
    /**
     *
     *  @private
     *  @description method to assert the time to refresh to be between the supposed parameters. The ttr should not be
     *  below 100ms and has no upper bounds
     *
     *  @param { {} } param0 - the object passed to the method that contains property for the configuration
     *  @param { Number } param0.timeToRefresh - the number in seconds between refreshes of the page
     *
     *  @returns { Number } the number of milliseconds betweeen each refresh
     */
    private _assertRefreshCycle;
    /**
     * @property { Number }
     */
    get remainingOffset(): number;
    /**
     * @private
     * @property { Object } log - A property containing methods to log different messages to the console
     */
    private _log;
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
    public takeWatch({ endOfWatch, dangerDrawsNear, watching }?: {
        endOfWatch: Function;
        dangerDrawsNear: Function;
        watching: Function;
    }): Promise<void>;
    /**
     * @type { Number }
     * @description millisecond timestamp that is created when the method is called.
     * This is later used to determine the length of the watch.
     */
    watchStarted: number;
    /**
     * @public
     * @param { Object } param0 - the object passed to the method to configure it's response.
     *
     * @description method to log the metrics of the Bot to the console.
     *
     */
    public tellATale({ time, cycles }?: any): void;
}
