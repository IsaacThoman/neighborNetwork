import { Application, Router, send } from '@oak/oak';
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts';
import { serve } from 'https://deno.land/std@0.150.0/http/server.ts';


import { CustomServer } from '../shared/messages.ts';
import config from "./config.ts";



export class MainServer {
	router: Router = new Router();
	app: Application = new Application();
	io: CustomServer = new Server();


	constructor() {
		this.setupRoutes();

		this.start();
	}

	private setupRoutes() {
		this.router.get('/api/getInfo', (context) => {
			try {
				context.response.type = 'application/json';
				context.response.body = 'example api response :)';
			} catch (err) {
				console.error('Error getting server info via API:', err);
			}
		});

		this.router.get('/(.*)', async (context) => {
			try {
				await send(context, context.params[0], {
					root: `${import.meta.dirname}/../../dist`,
					index: 'index.html',
				});
			} catch {
				try {
					await send(context, 'index.html', {
						root: `${import.meta.dirname}/../../dist`,
					});
				} catch (err) {
					console.error('Error serving files:', err);
					context.response.status = 500;
					context.response.body = 'Internal Server Error';
				}
			}
		});

		this.app.use(this.router.routes());
		this.app.use(this.router.allowedMethods());
	}

	private async start() {
		try {
			const handler = this.io.handler(async (req: Request) => {
				try {
					return await this.app.handle(req) || new Response(null, { status: 404 });
				} catch (error) {
					console.error('Request handler error:', error);
					return new Response('Internal Server Error', { status: 500 });
				}
			});

			await serve(handler, {
				port: config.server.port,
				hostname: config.server.hostname,
			});
		} catch (error) {
			console.error('Failed to start server:', error);
			Deno.exit(1);
		}
	}
}
