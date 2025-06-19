import { Application, Router, send } from '@oak/oak';
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts';
import { serve } from 'https://deno.land/std@0.150.0/http/server.ts';

import { CustomServer } from '../shared/messages.ts';
import config from './config.ts';

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

		// Professional networking profiles endpoint
		this.router.get('/api/profiles', (context) => {
			try {
				context.response.type = 'application/json';
				context.response.body = JSON.stringify([
					{
						id: 1,
						name: 'Sarah Johnson',
						pronouns: 'she/her',
						department: 'Technology',
						role: 'Senior Software Engineer',
						yearsAtCompany: 4,
						location: 'Bloomington, IL',
						workStyle: 'Hybrid',
						bio:
							'Passionate about innovative solutions and mentoring junior developers. Always looking to collaborate on exciting projects and share knowledge about cloud architecture.',
						profileImage: '/redguy.webp',
						interests: ['Cloud Architecture', 'Mentorship', 'Innovation Labs'],
					},
					{
						id: 2,
						name: 'Marcus Chen',
						pronouns: 'he/him',
						department: 'Claims',
						role: 'Claims Operations Manager',
						yearsAtCompany: 7,
						location: 'Phoenix, AZ',
						workStyle: 'In Person',
						bio:
							'Leading digital transformation in claims processing. Interested in connecting with colleagues working on automation and process improvement initiatives.',
						profileImage: '/yellowguy.webp',
						interests: ['Process Automation', 'Digital Transformation', 'Team Leadership'],
					},
					{
						id: 3,
						name: 'Alex Rivera',
						pronouns: 'they/them',
						department: 'Marketing',
						role: 'Digital Marketing Specialist',
						yearsAtCompany: 2,
						location: 'Atlanta, GA',
						workStyle: 'Remote',
						bio:
							'Creative strategist focused on data-driven marketing campaigns. Looking to network with analytics professionals and cross-functional team members.',
						profileImage: '/redguy.webp',
						interests: ['Data Analytics', 'Creative Strategy', 'Cross-functional Collaboration'],
					},
					{
						id: 4,
						name: 'Jennifer Park',
						pronouns: 'she/her',
						department: 'Finance',
						role: 'Financial Analyst III',
						yearsAtCompany: 5,
						location: 'Dallas, TX',
						workStyle: 'Hybrid',
						bio:
							'Specializing in predictive modeling and risk assessment. Eager to connect with colleagues in data science and actuarial roles for knowledge sharing.',
						profileImage: '/yellowguy.webp',
						interests: ['Predictive Modeling', 'Risk Assessment', 'Data Science'],
					},
					{
						id: 5,
						name: 'David Kim',
						pronouns: 'he/him',
						department: 'Human Resources',
						role: 'Talent Acquisition Lead',
						yearsAtCompany: 6,
						location: 'Tempe, AZ',
						workStyle: 'In Person',
						bio:
							'Building diverse and inclusive teams across StateFarm. Always interested in connecting with hiring managers and department leads to understand evolving talent needs.',
						profileImage: '/redguy.webp',
						interests: ['Talent Acquisition', 'Diversity & Inclusion', 'Organizational Development'],
					},
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
