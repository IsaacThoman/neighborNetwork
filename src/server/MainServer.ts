/// <reference lib="deno.unstable" />

import { Application, Router, send } from '@oak/oak';
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts';

import { CustomServer } from '../shared/messages.ts';
import config from './config.ts';

interface User {
	alias: string;
	name?: string;
	bio?: string;
	role?: string;
	hubLocation?: string;
	yearsAtStateFarm?: number;
	areasOfInterest?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export class MainServer {
	router: Router = new Router();
	app: Application = new Application();
	io: CustomServer = new Server();
	kv!: Deno.Kv;

	constructor() {
		this.initKv().then(() => {
			this.setupRoutes();
			this.start();
		});
	}

	private async initKv() {
		this.kv = await Deno.openKv();
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

		// Get all users endpoint (admin only) - must come before /api/users/:alias
		this.router.get('/api/users', async (context) => {
			try {
				const users: User[] = [];
				const iter = this.kv.list<User>({ prefix: ['users'] });
				
				for await (const { value } of iter) {
					users.push(value);
				}
				
				context.response.type = 'application/json';
				context.response.body = JSON.stringify(users);
			} catch (err) {
				console.error('Error getting all users:', err);
				context.response.status = 500;
				context.response.body = JSON.stringify({ error: 'Internal server error' });
			}
		});

		// User management endpoints
		this.router.get('/api/users/:alias', async (context) => {
			try {
				const alias = context.params.alias;
				const result = await this.kv.get<User>(['users', alias]);
				
				if (result.value) {
					context.response.type = 'application/json';
					context.response.body = JSON.stringify(result.value);
				} else {
					this.router.post('/api/users', async (context) => {
					try {
						const body = await context.request.body.json();
						const user: User = {
							...body,
							createdAt: new Date(),
							updatedAt: new Date()
						};

						await this.kv.set(['users', user.alias], user);
						
						context.response.type = 'application/json';
						context.response.body = JSON.stringify(user);
					} catch (err) {
						console.error('Error creating user:', err);
						context.response.status = 500;
						context.response.body = JSON.stringify({ error: 'Internal server error' });
					}
					})
				}
			} catch (err) {
				console.error('Error getting user:', err);
				context.response.status = 500;
				context.response.body = JSON.stringify({ error: 'Internal server error' });
			}
		});

		this.router.post('/api/users', async (context) => {
			try {
				const body = await context.request.body.json();
				const user: User = {
					...body,
					createdAt: new Date(),
					updatedAt: new Date()
				};

				await this.kv.set(['users', user.alias], user);
				
				context.response.type = 'application/json';
				context.response.body = JSON.stringify(user);
			} catch (err) {
				console.error('Error creating user:', err);
				context.response.status = 500;
				context.response.body = JSON.stringify({ error: 'Internal server error' });
			}
		});

		this.router.put('/api/users/:alias', async (context) => {
			try {
				const alias = context.params.alias;
				const body = await context.request.body.json();
				const user: User = {
					...body,
					alias, // Ensure alias matches URL
					updatedAt: new Date()
				};

				await this.kv.set(['users', alias], user);
				
				context.response.type = 'application/json';
				context.response.body = JSON.stringify(user);
			} catch (err) {
				console.error('Error updating user:', err);
				context.response.status = 500;
				context.response.body = JSON.stringify({ error: 'Internal server error' });
			}
		});

		this.router.delete('/api/users/:alias', async (context) => {
			try {
				const alias = context.params.alias;
				await this.kv.delete(['users', alias]);
				
				context.response.status = 204;
			} catch (err) {
				console.error('Error deleting user:', err);
				context.response.status = 500;
				context.response.body = JSON.stringify({ error: 'Internal server error' });
			}
		});

		// Professional networking profiles endpoint
		this.router.get('/api/profiles', (context) => {
			try {
				context.response.type = 'application/json';
				context.response.body = JSON.stringify([
					{
						id: 1,
						name: 'Philip Nsajja',
						pronouns: '',
						department: 'Technology',
						role: 'Intern',
						yearsAtCompany: 1,
						location: 'Atlanta, GA',
						workStyle: 'Hybrid',
						bio:
							'SWE Intern @ State Farm | Honors Computer Science Student at Kennesaw State University | ColorStack KSU Mentorship Chair',
						profileImage: '/philip.png',
						interests: ['Web Development', 'Mentorship', 'Cloud Architecture'],
					},
					{
						id: 2,
						name: 'Isaac Thoman',
						pronouns: '',
						department: 'Technology',
						role: 'Intern',
						yearsAtCompany: 1,
						location: 'Atlanta, GA',
						workStyle: 'Hybrid',
						bio:
							'Software Engineer @ SF, currently working on Team Carbon',
						profileImage: '/isaac.png',
						interests: ['Process Automation', 'Digital Transformation', 'Team Leadership'],
					},
					{
						id: 3,
						name: 'Michael Carroll ',
						pronouns: 'he/him',
						department: 'Marketing',
						role: 'Digital Marketing Specialist',
						yearsAtCompany: 2,
						location: 'Atlanta, GA',
						workStyle: 'Remote',
						bio:
							'CS student at University of Denver | SWE Intern at State Farm.',
						profileImage: '/mac.png',
						interests: ['Data','Development','Problem Solving'],
					},
					{
						id: 4,
						name: 'Colin Chua',
						pronouns: '',
						department: 'Finance',
						role: 'Financial Analyst III',
						yearsAtCompany: 5,
						location: 'Dallas, TX',
						workStyle: 'Hybrid',
						bio:
							'CS Major from UGA | Data Engineer Intern',
						profileImage: '/colin.webp',
						interests: ['Rock Climbing', 'Puzzles'],
					},
					// {
					// 	id: 5,
					// 	name: 'David Kim',
					// 	pronouns: 'he/him',
					// 	department: 'Human Resources',
					// 	role: 'Talent Acquisition Lead',
					// 	yearsAtCompany: 6,
					// 	location: 'Tempe, AZ',
					// 	workStyle: 'In Person',
					// 	bio:
					// 		'Building diverse and inclusive teams across StateFarm. Always interested in connecting with hiring managers and department leads to understand evolving talent needs.',
					// 	profileImage: '/redguy.webp',
					// 	interests: ['Talent Acquisition', 'Diversity & Inclusion', 'Organizational Development'],
					// },
				]);
			} catch (err) {
				console.error('Error getting profiles via API:', err);
				context.response.status = 500;
				context.response.body = JSON.stringify({ error: 'Internal server error' });
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

	private start() {
		try {
			
			Deno.serve({
				port: config.server.port,
				hostname: config.server.hostname,
			}, async (req: Request) => {
				try {
					return await this.app.handle(req) || new Response(null, { status: 404 });
				} catch (error) {
					console.error('Request handler error:', error);
					return new Response('Internal Server Error', { status: 500 });
				}
			});
			
		} catch (error) {
			console.error('Failed to start server:', error);
			Deno.exit(1);
		}
	}
}
