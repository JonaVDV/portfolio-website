import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import readline from 'node:readline/promises';
import { projectRoot, loadConfig, loadRegistry } from './resolve.js';

/** Resolve a component set plus all transitive registry dependencies. */
function withDependencies(registry, names) {
	const seen = new Set();
	const utils = new Set();
	const queue = [...names];
	while (queue.length) {
		const name = queue.shift();
		if (seen.has(name)) continue;
		const entry = registry.components[name];
		if (!entry) {
			const known = Object.keys(registry.components).join(', ');
			throw new Error(`unknown component "${name}"\navailable: ${known}`);
		}
		seen.add(name);
		queue.push(...entry.registryDependencies);
		for (const u of entry.utils ?? []) utils.add(u);
	}
	return { components: [...seen], utils: [...utils] };
}

async function copyFiles(jobs, { overwrite }) {
	// jobs: [{ from, to, transform? }]
	let rl = null;
	let closed = null;
	let overwriteAll = overwrite;
	let written = 0;
	for (const { from, to, transform } of jobs) {
		if (existsSync(to) && !overwriteAll) {
			rl ??= readline.createInterface({ input: process.stdin, output: process.stdout });
			// default to skip when stdin closes (piped/non-interactive input)
			closed ??= new Promise((resolve) => rl.once('close', () => resolve('n')));
			const answer = (
				await Promise.race([rl.question(`${to} exists — overwrite? [y/N/all] `).catch(() => 'n'), closed])
			)
				.trim()
				.toLowerCase();
			if (answer === 'all') overwriteAll = true;
			else if (answer !== 'y') {
				console.log(`  skipped ${to}`);
				continue;
			}
		}
		let content = readFileSync(from, 'utf8');
		if (transform) content = transform(content);
		mkdirSync(dirname(to), { recursive: true });
		writeFileSync(to, content);
		console.log(`  wrote ${to}`);
		written++;
	}
	rl?.close();
	return written;
}

export async function add(names, { all, overwrite }) {
	const root = projectRoot();
	const config = loadConfig(root);
	const { dist, registry } = loadRegistry(root);

	if (all) names = Object.keys(registry.components);
	if (!names.length) throw new Error('no components given — `scope-ui add <component...>` or --all');

	const { components, utils } = withDependencies(registry, names);
	const jobs = [];

	if (config.mode === 'vendor') {
		// copy component source, preserving the dir structure so relative
		// cross-component imports keep working
		for (const name of components) {
			const entry = registry.components[name];
			for (const { path, type } of entry.files) {
				if (type === 'variants') {
					jobs.push({ from: join(dist, path), to: join(root, config.stylesDir, basename(path)) });
				} else {
					const to = join(root, config.componentsDir, path.replace(/^components\//, ''));
					jobs.push({
						from: join(dist, path),
						to,
						// rewrite util imports (../../utils/x.js) to the configured alias
						transform: (src) =>
							src.replace(/from\s+['"](?:\.\.\/)+utils\/([^'"]+)['"]/g, `from '${config.utilsAlias}/$1'`)
					});
				}
			}
		}
		for (const util of utils) {
			const entry = registry.utils[util];
			if (!entry) throw new Error(`registry is missing util "${util}"`);
			for (const path of entry.files) {
				jobs.push({ from: join(dist, path), to: join(root, config.utilsDir, basename(path)) });
			}
		}
	} else {
		// package mode: only the consumer-owned variant styles
		for (const name of components) {
			const entry = registry.components[name];
			for (const { path, type } of entry.files) {
				if (type !== 'variants') continue;
				jobs.push({ from: join(dist, path), to: join(root, config.stylesDir, basename(path)) });
			}
		}
		if (!jobs.length) {
			console.log('selected components have no variant styles — nothing to copy');
			return;
		}
	}

	const written = await copyFiles(jobs, { overwrite });
	console.log(`${written}/${jobs.length} files written`);
	if (config.mode === 'package' && written) {
		console.log(`\nimport the copied css files (e.g. in your root layout) to activate them`);
	}
}
