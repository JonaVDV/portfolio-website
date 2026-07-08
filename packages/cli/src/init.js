import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import readline from 'node:readline/promises';
import { projectRoot, UI_PACKAGE } from './resolve.js';

async function ask(rl, question, fallback) {
	// resolve with the fallback if stdin closes (piped/non-interactive input)
	const closed = new Promise((resolve) => rl.once('close', () => resolve(fallback)));
	const answer = (
		await Promise.race([rl.question(`${question} (${fallback}) `).catch(() => fallback), closed])
	).trim();
	return answer || fallback;
}

export async function init() {
	const root = projectRoot();
	const path = join(root, 'ui.config.json');
	if (existsSync(path)) throw new Error('ui.config.json already exists');

	const isKit = existsSync(join(root, 'src/lib'));
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

	const mode = await ask(rl, 'Mode — "package" (npm + copied styles) or "vendor" (copied source)?', 'package');
	if (mode !== 'package' && mode !== 'vendor') {
		rl.close();
		throw new Error(`invalid mode "${mode}"`);
	}
	const stylesDir = await ask(rl, 'Where should variant styles go?', isKit ? 'src/styles/ui' : 'styles/ui');
	const config = { mode, stylesDir };
	if (mode === 'vendor') {
		config.componentsDir = await ask(
			rl,
			'Where should vendored components go?',
			isKit ? 'src/lib/components/ui' : 'components/ui'
		);
		config.utilsDir = await ask(
			rl,
			'Where should vendored utils go?',
			isKit ? 'src/lib/utils' : 'utils'
		);
		config.utilsAlias = await ask(
			rl,
			'Import alias for vendored utils?',
			isKit ? '$lib/utils' : '../utils'
		);
	}
	rl.close();

	writeFileSync(path, JSON.stringify(config, null, '\t') + '\n');
	console.log(`wrote ui.config.json`);
	if (mode === 'package') {
		console.log(`\nNext steps:`);
		console.log(`  1. install ${UI_PACKAGE}`);
		console.log(`  2. import '${UI_PACKAGE}/styles/main.css' in your root layout`);
		console.log(`  3. scope-ui add <component> to pull in its variant styles`);
	}
}
