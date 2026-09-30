import { createStore, useStore, type StateCreator, type StoreApi } from 'zustand';

/**
 * Come `create` di zustand, ma lo snapshot usato durante il PRE-RENDERING e
 * l'IDRATAZIONE è lo stato CORRENTE, non quello iniziale.
 *
 * zustand 4.5 passa a `useSyncExternalStore` `api.getServerState ??
 * api.getInitialState`: con `create()` l'HTML statico verrebbe reso con lo stato
 * iniziale anche se lo store è stato aggiornato prima del render (lingua
 * dell'URL, mondo attivo) — es. la pagina `/en` uscirebbe con i nomi in
 * italiano. Usarlo solo per store che vengono impostati PRIMA del primo render
 * sia al build sia nel client (`src/entry-server.tsx`, `src/main.tsx`).
 */
export function createSnapshotStore<T>(init: StateCreator<T>) {
  const api = createStore<T>()(init) as StoreApi<T> & { getServerState?: () => T };
  api.getServerState = api.getState;
  function useBoundStore(): T;
  function useBoundStore<U>(selector: (state: T) => U): U;
  function useBoundStore<U>(selector?: (state: T) => U) {
    return useStore(api, (selector ?? ((s: T) => s as unknown as U)) as (state: T) => U);
  }
  return Object.assign(useBoundStore, api);
}
