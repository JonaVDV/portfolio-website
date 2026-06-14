/* eslint-disable svelte/prefer-svelte-reactivity */
import { createContext } from "svelte";

export const CommandContext = createContext<CommandState>();

const initialState = {
  search: "",
  value: "",
  filtered: {
    count: 0,
    items: new Map<string, number>(),
    groups: new Set<string>(),
  },
};

export class CommandState {
  static create() {
    const [_, setContext] = CommandContext;
    return setContext(new CommandState());
  }

  items = new Set<string>();
  groups = new Map<string, Set<string>>();
  state = $state.snapshot(initialState);

  #filtered = $derived(this.#filterItems());

  inputNode = $state<HTMLInputElement | null>(null);

  #update() {}

  registerItem(id: string, groupId?: string  ) {
    this.items.add(id);

    if (groupId) {
      if (!this.groups.has(groupId)) {
        this.groups.set(groupId, new Set([id]));
      } else {
        this.groups.get(groupId)?.add(id);
      }
    }
  }

  #filterItems() {}

  registerGroup(id: string) {
    if (!this.groups.has(id)) {
      this.groups.set(id, new Set());
    }
  }
}
