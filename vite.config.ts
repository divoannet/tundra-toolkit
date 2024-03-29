import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import preact from '@preact/preset-vite';

export default defineConfig({
	plugins: [
		preact(),
		viteStaticCopy({
			targets: [{
				src: 'src/scripts',
				dest: '.',
			}],
		}),
	],
});
