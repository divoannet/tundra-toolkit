import { viteStaticCopy } from 'vite-plugin-static-copy';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				nested: resolve(__dirname, 'options.html')
			}
		}
	},
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
