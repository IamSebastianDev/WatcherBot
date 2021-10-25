/** @format */

import { WatcherBot } from '../dist/watcherbot.min.mjs';

const url = 'https://minute-nine.vercel.app';

const Bot = new WatcherBot({ url, timeToRefresh: 2 });

const watching = async ({ page, endOfWatch, keepWatching, theWatcher }) => {
	const minute = await page.$eval('#minute', (elem) => {
		return elem.textContent;
	});

	console.log(minute);

	if (minute === '35') {
		endOfWatch();
	}

	keepWatching();
};

const endOfWatch = async ({ page, browser, theWatcher }, overload) => {
	// do something after change has been detected

	theWatcher.tellATale();

	// close the browser instance

	await browser.close();
};

Bot.takeWatch({ watching, endOfWatch });
