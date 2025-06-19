import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import analog from '@analogjs/platform';

export default defineConfig({
	define: {
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV),
		},
		'process.platform': JSON.stringify('browser'),
		'process.version': JSON.stringify(''),
	},
	build: {
		target: ['es2020'],
		rollupOptions: {
			output: {
				manualChunks: {
					three: ['three'],
				},
			},
		},
	},
	plugins: [
		analog({
			ssr: false,
			static: true,
			prerender: {
				routes: [],
			},
		}) as PluginOption,
	],
});
