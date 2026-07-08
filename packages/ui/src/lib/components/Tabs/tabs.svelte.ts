import { createContext } from "svelte";
import { SvelteMap } from "svelte/reactivity";

export class TabsState {
  tabs = new SvelteMap<string, boolean>();
  activeTab: string | undefined = $derived(this.#getActiveTab());
  orientation: "horizontal" | "vertical" = "horizontal";

  constructor(orientation?: "horizontal" | "vertical", initialTab?: string) {
    if (orientation) {
      this.orientation = orientation;
    }
    if (initialTab) {
      this.activeTab = initialTab;
    }
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

    this.tabs.entries().forEach(([key, active]) => {
      if (key !== tab && active) {
        this.tabs.set(key, false);
      }
    });
  }

  registerTab(tab: string) {
    if (!this.tabs.has(tab)) {
      this.tabs.set(tab, false);
    }

    // throw new Error(`Tab with id "${tab}" is already registered.`);
  }
}

export const [getTabsState, setTabsState] = createContext<TabsState>();
