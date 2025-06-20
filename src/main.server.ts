import '@angular/platform-server/init';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import { provideServerContext } from '@analogjs/router/server';
import { ServerContext } from '@analogjs/router/tokens';

import { AppComponent } from './app/app.component.ts';
import { config } from './app/app.config.server.ts';

if (Deno.env.has('PRODUCTION')) {
	enableProdMode();
}

export function bootstrap() {
	return bootstrapApplication(AppComponent, config);
}

export default async function render(
	url: string,
	document: string,
	serverContext: ServerContext,
) {
	const html = await renderApplication(bootstrap, {
		document,
		url,
		platformProviders: [provideServerContext(serverContext)],
	});

	return html;
}
