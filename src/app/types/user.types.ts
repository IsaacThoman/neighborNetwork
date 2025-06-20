export interface User {
	alias: string; // Primary key
	name?: string;
	bio?: string;
	role?: string;
	hubLocation?: string;
	yearsAtStateFarm?: number;
	areasOfInterest?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export const ROLES = [
	'Software Engineer',
	'Senior Software Engineer',
	'Engineering Manager',
	'Product Manager',
	'Designer',
	'Data Scientist',
	'DevOps Engineer',
	'Quality Assurance',
	'Business Analyst',
	'Marketing Specialist',
	'Sales Representative',
	'Customer Service',
	'Human Resources',
	'Finance Analyst',
	'Operations Manager',
	'Claims Specialist',
	'Underwriter',
	'Actuary',
	'Other',
] as const;

export type UserRole = typeof ROLES[number];

export function isUserComplete(user: User): boolean {
	return !!(
		user.alias &&
		user.name &&
		user.bio &&
		user.bio.length >= 20 &&
		user.role
	);
}
