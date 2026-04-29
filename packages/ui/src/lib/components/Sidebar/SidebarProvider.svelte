<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setSidebarState, type SidebarState } from './context';

	interface Props {
		children?: Snippet;
		/**
		 * Bindable collapsed state. When the parent binds this prop
		 * (`bind:collapsed`) they become the single source of truth — useful
		 * for persisting the value to localStorage or a server preference.
		 * Without a binding it is managed internally and defaults to `false`.
		 */
		collapsed?: boolean;
		/**
		 * Called whenever the collapsed state changes. Receives the new value so
		 * you can persist it without needing a full two-way binding.
		 */
		oncollapsechange?: (collapsed: boolean) => void;
	}

	let { children, collapsed = $bindable(false), oncollapsechange }: Props = $props();

	/*
	 * The context object delegates reads/writes entirely to the bindable prop
	 * so that an external binding stays as the single source of truth.
	 *
	 * In Svelte 5's fine-grained reactivity, accessing `collapsed` (a rune)
	 * inside a getter registers it as a reactive dependency for every component
	 * that reads `sidebarState.collapsed` in a tracking context — so no
	 * separate $state wrapper or $effect sync is needed.
	 */
	const sidebarState: SidebarState = {
		get collapsed() {
			return collapsed;
		},
		set collapsed(value: boolean) {
			collapsed = value;
			oncollapsechange?.(value);
		},
		toggle() {
			this.collapsed = !this.collapsed;
		},
		setCollapsed(value: boolean) {
			this.collapsed = value;
		}
	};

	setSidebarState(sidebarState);
</script>

{@render children?.()}
