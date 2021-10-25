/** @format */

import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/watcherbot.js',
	output: [
		{
			file: './dist/watcherbot.min.js',
			format: 'cjs',
			plugins: [terser({ module: false, toplevel: true })],
		},
		{
			file: './dist/watcherbot.min.mjs',
			format: 'es',
			plugins: [terser()],
		},
	],
};
