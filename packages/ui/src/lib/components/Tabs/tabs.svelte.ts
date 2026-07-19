import { createContext, untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

interface TabsOptions {
	orientation?: 'horizontal' | 'vertical';
	initialTab?: string;
	onchange?: (value: string) => void;
}

export class TabsState {
	activeTab: string | undefined = $derived(this.#getActiveTab());
	readonly options: TabsOptions;

	readonly triggers = new SvelteMap<string, string>();
	readonly tabs = new SvelteMap<string, boolean>();

	constructor(options: TabsOptions = {}) {
		this.options = options;

		// Depend only on the incoming value; untrack the write so mutating the tab
		// map here doesn't re-trigger this effect (which would revert every click).
		$effect(() => {
			const initial = options.initialTab;
			if (initial) {
				untrack(() => this.setTabActive(initial));
			}
		});
	}

	#getActiveTab() {
		for (const [key, active] of this.tabs.entries()) {
			if (active) {
				return key;
			}
		}
	}

	setTabActive(tab: string) {
		this.tabs.set(tab, true);

		
		if (this.options.onchange) {
			this.options.onchange(tab);
		}

		for (const [key] of this.tabs.entries()) {
			if (key !== tab) {
				this.tabs.set(key, false);
			}
		}
	}

	registerTrigger(id: string, tab: string) {
		this.triggers.set(id, tab);

		return () => {
			this.triggers.delete(id);
		};
	}

	registerTab(tab: string) {
		this.tabs.set(tab, false);

		// Default to the first registered tab when nothing else selects one. Untracked
		// so the reactive read doesn't subscribe the caller effect (see constructor).
		untrack(() => {
			if (this.activeTab === undefined && !this.options.initialTab) {
				this.setTabActive(tab);
			}
		});

		return () => {
			this.tabs.delete(tab);
		};
	}
}

export const [getTabsState, setTabsState] = createContext<TabsState>();
