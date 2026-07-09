import { createContext } from 'svelte';

export interface SidebarState {
	collapsed: boolean;
	toggle: () => void;
	setCollapsed: (collapsed: boolean) => void;
}

export const [getSidebarState, setSidebarState] = createContext<SidebarState>();
