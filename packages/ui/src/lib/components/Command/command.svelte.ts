import { createContext, tick } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { computeCommandScore } from './search.js';

export const CommandContext = createContext<CommandState>();
export const CommandGroupContext = createContext<string | undefined>();

const initialState = {
	/**The search query */
	search: '',
	/**The selected value */
	value: ''
};

export interface ItemData {
	id: string;
	value: string;
	keywords: string[];
	groupId?: string;
	score: number;
	registrationIndex: number;
}

export class CommandState {
	static create() {
		const state = new CommandState();
		const [, setContext] = CommandContext;
		console.log('Context created for command component');

		return setContext(state);
	}

	static get() {
		try {
			const [getContext] = CommandContext;
			return getContext();
		} catch (e) {
			console.error(
				'CommandState context not found. Make sure to wrap your components in a <Command> component.',
				e.stack
			);
		}
	}

	// State
	search = $state(initialState.search);
	/** The ID of the currently selected item */
	selectedIdState = $state(initialState.value);

	// Registries using Svelte collections for fine-grained reactivity
	items = new SvelteMap<string, ItemData>();
	groups = new SvelteMap<string, SvelteSet<string>>();
	private nextRegistrationIndex = 0;

	// Element refs
	inputNode = $state<HTMLInputElement | null>(null);
	listNode = $state<HTMLElement | null>(null);

	// Pointer state to prevent selection reset during keyboard navigation
	private lastPointerX = -1;
	private lastPointerY = -1;

	// Derived state for selection
	selectedId = $derived.by(() => {
		if (this.isValidSelection(this.selectedIdState)) {
			return this.selectedIdState;
		}
		return this.filteredResults.sortedIds[0] ?? '';
	});

	// Derived state for performance
	filteredResults = $derived.by(() => {
		const scores = new Map<string, number>();
		const activeGroups = new Set<string>();
		const groupMaxScores = new Map<string, number>();
		let count = 0;

		// 1. Calculate scores and find active groups + group max scores
		for (const [id, item] of this.items) {
			const score =
				this.search.trim() === ''
					? 1
					: computeCommandScore(item.value.trim(), this.search.trim(), item.keywords);

			if (score > 0) {
				scores.set(id, score);
				count++;
				if (item.groupId) {
					activeGroups.add(item.groupId);
					const currentMax = groupMaxScores.get(item.groupId) ?? 0;
					groupMaxScores.set(item.groupId, Math.max(currentMax, score));
				}
			}
		}

		// 2. Sort all items that pass the filter
		const sortedIds = Array.from(scores.keys()).sort((a, b) => {
			const itemA = this.items.get(a)!;
			const itemB = this.items.get(b)!;

			// Priority 1: Group score (max score of any item in the group)
			// Ungrouped items use their own score as their group score
			const gScoreA = itemA.groupId ? (groupMaxScores.get(itemA.groupId) ?? 0) : scores.get(a)!;
			const gScoreB = itemB.groupId ? (groupMaxScores.get(itemB.groupId) ?? 0) : scores.get(b)!;

			if (gScoreA !== gScoreB) {
				return gScoreB - gScoreA;
			}

			// Priority 2: Group registration order (visual order of groups)
			// If items are in different groups with same group score, sort by which group appeared first
			if (itemA.groupId !== itemB.groupId) {
				const getGroupFirstIdx = (groupId?: string, itemIdx?: number) => {
					if (!groupId) return itemIdx ?? Infinity;
					const items = this.groups.get(groupId);
					if (!items || items.size === 0) return itemIdx ?? Infinity;
					let min = Infinity;
					for (const id of items) {
						const idx = this.items.get(id)?.registrationIndex;
						if (idx !== undefined && idx < min) min = idx;
					}
					return min;
				};

				const firstIdxA = getGroupFirstIdx(itemA.groupId, itemA.registrationIndex);
				const firstIdxB = getGroupFirstIdx(itemB.groupId, itemB.registrationIndex);

				if (firstIdxA !== firstIdxB) {
					return firstIdxA - firstIdxB;
				}
			}

			// Priority 3: Item score
			const scoreA = scores.get(a)!;
			const scoreB = scores.get(b)!;
			if (scoreA !== scoreB) {
				return scoreB - scoreA;
			}

			// Priority 4: Natural/Numeric sorting for values (e.g., danger-200 before danger-1000)
			const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
			const valSort = collator.compare(itemA.value, itemB.value);
			if (valSort !== 0) return valSort;

			// Priority 5: Registration index (visual order within group)
			return itemA.registrationIndex - itemB.registrationIndex;
		});

		// 3. Sort groups for visual ordering
		const sortedGroupIds = Array.from(activeGroups).sort((a, b) => {
			const scoreA = groupMaxScores.get(a) ?? 0;
			const scoreB = groupMaxScores.get(b) ?? 0;

			if (scoreA !== scoreB) {
				return scoreB - scoreA;
			}

			// Find the first item of each group to tie-break by their relative registration
			const getFirstIdx = (groupId: string) => {
				const items = this.groups.get(groupId);
				if (!items || items.size === 0) return Infinity;
				let min = Infinity;
				for (const id of items) {
					const idx = this.items.get(id)?.registrationIndex;
					if (idx !== undefined && idx < min) min = idx;
				}
				return min;
			};
			return getFirstIdx(a) - getFirstIdx(b);
		});

		// 4. Create maps for quick index/order lookup
		const idToIndex = new Map<string, number>();
		sortedIds.forEach((id, index) => idToIndex.set(id, index));

		const groupToIndex = new Map<string, number>();
		sortedGroupIds.forEach((id, index) => groupToIndex.set(id, index));

		return {
			scores,
			sortedIds,
			idToIndex,
			groupToIndex,
			count,
			activeGroups
		};
	});

	/**
	 * Returns the visual order (index) for an item for CSS `order` support.
	 */
	getItemOrder(id: string) {
		return this.filteredResults.idToIndex.get(id);
	}

	/**
	 * Returns the visual order (index) for a group for CSS `order` support.
	 */
	getGroupOrder(id: string) {
		return this.filteredResults.groupToIndex.get(id);
	}

	/**
	 * Returns true if an item should be visible based on the current search.
	 */
	shouldRenderItem(id: string) {
		return this.filteredResults.scores.has(id);
	}

	/**
	 * Returns true if a group should be visible (has at least one visible item).
	 */
	shouldRenderGroup(id: string) {
		return this.filteredResults.activeGroups.has(id);
	}

	registerItem(id: string, value: string, keywords: string[] = [], groupId?: string) {
		this.items.set(id, {
			id,
			value,
			keywords,
			groupId,
			score: 0,
			registrationIndex: this.nextRegistrationIndex++
		});

		if (groupId) {
			if (!this.groups.has(groupId)) {
				this.groups.set(groupId, new SvelteSet());
			}
			this.groups.get(groupId)?.add(id);
		}

		return () => {
			this.items.delete(id);
			if (groupId) {
				this.groups.get(groupId)?.delete(id);
			}
			if (this.selectedIdState === id) {
				// Re-select if the current selection is removed
				tick().then(() => {
					this.selectFirstAvailable();
				});
			}
		};
	}

	private isValidSelection(id: string): boolean {
		if (!id) return false;
		return this.items.has(id) && this.shouldRenderItem(id);
	}

	registerGroup(id: string) {
		if (!this.groups.has(id)) {
			this.groups.set(id, new SvelteSet());
		}
		return () => {
			this.groups.delete(id);
		};
	}

	onPointerMove(id: string, e: PointerEvent) {
		if (e.clientX === this.lastPointerX && e.clientY === this.lastPointerY) {
			return;
		}

		this.lastPointerX = e.clientX;
		this.lastPointerY = e.clientY;
		this.selectedIdState = id;
	}

	selectFirstAvailable() {
		const firstId = this.filteredResults.sortedIds.at(0);
		if (!firstId) {
			return (this.selectedIdState = '');
		}
		this.selectedIdState = firstId;
	}

	onKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				this.moveSelection(1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				this.moveSelection(-1);
				break;
			case 'Home':
				e.preventDefault();
				this.selectFirstAvailable();
				break;
			case 'End': {
				e.preventDefault();
				const lastId = this.filteredResults.sortedIds.at(-1);
				if (lastId) this.selectedIdState = lastId;
				break;
			}
			case 'Enter': {
				const selectedEl = document.querySelector('[data-selected="true"]') as HTMLElement;
				selectedEl?.click();
				break;
			}
		}
	}
	/**
	 * Moves the selection up or down based on the provided direction.
	 * @param dir either 1 (down) or -1 (up)
	 */
	private moveSelection(dir: number) {
		const { sortedIds, idToIndex } = this.filteredResults;
		if (sortedIds.length === 0) return;

		const currentIndex = idToIndex.get(this.selectedId) ?? -1;
		let nextIndex = currentIndex + dir;

		if (nextIndex < 0) nextIndex = sortedIds.length - 1;
		if (nextIndex >= sortedIds.length) nextIndex = 0;

		const nextId = sortedIds[nextIndex];
		if (nextId) {
			this.selectedIdState = nextId;
			this.scrollSelectedIntoView();
		}
	}

	private async scrollSelectedIntoView() {
		await tick();
		const selectedEl = document.querySelector('[data-selected="true"]');
		selectedEl?.scrollIntoView({ block: 'nearest' });
	}
}
