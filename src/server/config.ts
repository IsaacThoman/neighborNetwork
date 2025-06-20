const defaults = {
	// Server settings
	PORT: '3000',
	SERVER_HOSTNAME: '0.0.0.0',
	//platform-specific settings
	DOKPLOY_DEPLOY_URL: '',
};

async function updateEnvFile(defaults: Record<string, string>) {
	const envPath = '.env';
	const envExists = await Deno.stat(envPath).catch(() => false);
	let currentEnvFromFile: Record<string, string> = {};

	if (envExists) {
		const content = await Deno.readTextFile(envPath);
		currentEnvFromFile = content.split('\n')
			.filter((line) => line && !line.startsWith('#'))
			.reduce((acc, line) => {
				const eqIndex = line.indexOf('=');
				if (eqIndex === -1) return acc; // Skip lines without '='
				const key = line.slice(0, eqIndex).trim();
				let value = line.slice(eqIndex + 1).trim();
				// Remove surrounding quotes if present
				if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
					value = value.slice(1, -1);
				}
				acc[key] = value;
				return acc;
			}, {} as Record<string, string>);
	}

	// Get system environment variables
	const systemEnv = Deno.env.toObject();

	// Merge sources: defaults < .env file < system env
	const finalEnv = {
		...defaults,
		...currentEnvFromFile,
		...systemEnv, // System env vars override others
	};

	// Keep only keys present in the original defaults or systemEnv
	// This prevents arbitrary env vars from polluting the config
	const filteredFinalEnv: Record<string, string> = {};
	for (const key in finalEnv) {
		if (key in defaults) {
			filteredFinalEnv[key] = finalEnv[key];
		}
	}

	// Write the final effective configuration back to .env (optional but can be helpful for debugging)
	const envContent = Object.entries(filteredFinalEnv)
		.map(([key, value]) => `${key}=${value}`)
		.join('\n');

	await Deno.writeTextFile(envPath, envContent);
	return filteredFinalEnv; // Return the final, merged config
}

// Parse specific types from string values
function parseConfig(env: Record<string, string>) {
	return {
		server: {
			port: parseInt(env.PORT),
			hostname: env.SERVER_HOSTNAME,
		},
	};
}

const rawConfig = await updateEnvFile(defaults);
const config = parseConfig(rawConfig);

export default config;
