import { lazy, type ComponentType } from 'react';

/**
 * `React.lazy` con `preload()`: una volta caricato il modulo, il componente
 * viene reso in modo SINCRONO (senza passare dal fallback di Suspense).
 *
 * Serve al pre-rendering e all'idratazione: `src/main.tsx` e
 * `src/entry-server.tsx` precaricano i chunk della rotta corrente prima del
 * primo render, così l'HTML statico e il primo render client coincidono (niente
 * flash "Caricamento…" sopra contenuto già visibile). Nelle navigazioni SPA
 * successive si comporta come un normale `lazy`.
 */
export type PreloadableComponent<P> = ((props: P) => JSX.Element) & {
  preload: () => Promise<void>;
};

export function lazyWithPreload<P>(
  factory: () => Promise<ComponentType<P>>,
): PreloadableComponent<P> {
  let Loaded: ComponentType<P> | undefined;
  let pending: Promise<void> | undefined;
  const load = () => {
    pending ??= factory().then((C) => {
      Loaded = C;
    });
    return pending;
  };
  const Lazy = lazy(() => load().then(() => ({ default: Loaded! })));
  const Component = (props: P) => {
    const C = (Loaded ?? Lazy) as ComponentType<P & JSX.IntrinsicAttributes>;
    return <C {...(props as P & JSX.IntrinsicAttributes)} />;
  };
  Component.preload = load;
  return Component;
}
