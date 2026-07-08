#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { init } from './init.js';
import { add } from './add.js';

const HELP = `scope-ui — component CLI for @SCOPE/ui

Usage:
  scope-ui init                       Create ui.config.json in this project
  scope-ui add <component...>         Add components (styles or vendored source)
  scope-ui add --all                  Add every component
  scope-ui add button --overwrite     Overwrite existing files without asking

Modes (set in ui.config.json by init):
  package   you import components from @SCOPE/ui; add copies only the
            consumer-owned *.variants.css files into your styles dir
  vendor    add copies component source into your project (shadcn-style)
`;

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		all: { type: 'boolean', default: false },
		overwrite: { type: 'boolean', default: false },
		help: { type: 'boolean', short: 'h', default: false }
	}
});

const [command, ...names] = positionals;

try {
	if (values.help || !command) {
		console.log(HELP);
	} else if (command === 'init') {
		await init();
	} else if (command === 'add') {
		await add(names, values);
	} else {
		console.error(`Unknown command "${command}"\n\n${HELP}`);
		process.exit(1);
	}
} catch (err) {
	console.error(`error: ${err.message}`);
	process.exit(1);
}
