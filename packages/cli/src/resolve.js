import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

export const UI_PACKAGE = '@SCOPE/ui';
const SUPPORTED_REGISTRY_VERSION = 1;

export function projectRoot() {
	let dir = process.cwd();
	while (!existsSync(join(dir, 'package.json'))) {
		const parent = dirname(dir);
		if (parent === dir) throw new Error('no package.json found — run this inside your project');
		dir = parent;
	}
	return dir;
}

export function loadConfig(root) {
	const path = join(root, 'ui.config.json');
	if (!existsSync(path)) throw new Error('no ui.config.json found — run `scope-ui init` first');
	return JSON.parse(readFileSync(path, 'utf8'));
}

/** Locate the installed @SCOPE/ui package and parse its registry. */
export function loadRegistry(root) {
	let pkgPath;
	try {
		pkgPath = createRequire(join(root, 'package.json')).resolve(`${UI_PACKAGE}/package.json`);
	} catch {
		throw new Error(`${UI_PACKAGE} is not installed — install it first`);
	}
	const dist = join(dirname(pkgPath), 'dist');
	const registry = JSON.parse(readFileSync(join(dist, 'registry.json'), 'utf8'));
	if (registry.registryVersion !== SUPPORTED_REGISTRY_VERSION) {
		throw new Error(
			`registry version ${registry.registryVersion} is not supported — update the CLI`
		);
	}
	return { dist, registry };
}
