// Generates dist/registry.json from the svelte-package output in dist/.
// Run after `svelte-package` (see the prepack script). Node built-ins only.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
const COMPONENTS = join(DIST, 'components');

// files excluded from the npm tarball must not appear in the registry
const EXCLUDED = /\.(test|spec|stories)\.|demo/;

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const full = join(dir, name);
		return statSync(full).isDirectory() ? walk(full) : [full];
	});
}

/** kebab-case a PascalCase path segment ("DropdownMenu" -> "dropdown-menu") */
function kebab(s) {
	return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function fileType(name) {
	if (name.endsWith('.variants.css')) return 'variants';
	if (name === 'index.js' || name === 'index.d.ts') return 'index';
	if (name.endsWith('.svelte')) return 'component';
	return 'module'; // .js/.d.ts helpers (state classes, server utils, ...)
}

// component dirs = every directory under dist/components that directly
// contains a .svelte file (covers Form/* subdirs; skips the Form root itself)
const dirs = new Map(); // dist-relative dir -> files[]
for (const file of walk(COMPONENTS)) {
	const rel = relative(DIST, file).split(sep).join(posix.sep);
	if (EXCLUDED.test(rel)) continue;
	const dir = posix.dirname(rel);
	if (!dirs.has(dir)) dirs.set(dir, []);
	dirs.get(dir).push(rel);
}
for (const [dir, files] of dirs) {
	if (!files.some((f) => f.endsWith('.svelte'))) dirs.delete(dir);
}

// registry key for a dist-relative component dir ("components/Form/Checkbox" -> "form/checkbox")
function keyFor(dir) {
	return dir.split('/').slice(1).map(kebab).join('/');
}
const dirToKey = new Map([...dirs.keys()].map((d) => [d, keyFor(d)]));

const IMPORT_RE = /from\s+['"]([^'"]+)['"]/g;

function dependenciesOf(dir, files) {
	const deps = new Set();
	const utils = new Set();
	for (const rel of files) {
		if (rel.endsWith('.css') || rel.endsWith('.d.ts')) continue;
		const src = readFileSync(join(DIST, rel), 'utf8');
		for (const [, spec] of src.matchAll(IMPORT_RE)) {
			if (!spec.startsWith('.')) continue;
			const resolved = posix.normalize(posix.join(posix.dirname(rel), spec));
			if (resolved.startsWith('utils/')) {
				// bare util name, matching the keys of the top-level utils map
				utils.add(resolved.replace(/^utils\//, '').replace(/(\.svelte)?\.js$/, ''));
				continue;
			}
			const depDir = posix.dirname(resolved);
			if (depDir !== dir && dirToKey.has(depDir)) deps.add(dirToKey.get(depDir));
			// an import of a sibling dir's index resolves to the dir itself
			if (dirToKey.has(resolved) && resolved !== dir) deps.add(dirToKey.get(resolved));
		}
	}
	return { deps: [...deps].sort(), utils: [...utils].sort() };
}

const components = {};
for (const [dir, files] of [...dirs].sort()) {
	const { deps, utils } = dependenciesOf(dir, files);
	components[dirToKey.get(dir)] = {
		dir,
		files: files.sort().map((path) => ({ path, type: fileType(posix.basename(path)) })),
		registryDependencies: deps,
		utils
	};
}

const utils = {};
for (const file of walk(join(DIST, 'utils'))) {
	const rel = relative(DIST, file).split(sep).join(posix.sep);
	if (rel.endsWith('.d.ts')) continue;
	utils[rel.replace(/^utils\//, '').replace(/(\.svelte)?\.js$/, '')] = { files: [rel] };
}

const registry = {
	registryVersion: 1,
	components,
	utils,
	styles: {
		main: 'styles/main.css',
		fluidType: 'styles/fluid-type.css'
	}
};

writeFileSync(join(DIST, 'registry.json'), JSON.stringify(registry, null, '\t') + '\n');
console.log(
	`registry.json: ${Object.keys(components).length} components, ${Object.keys(utils).length} utils`
);
