import { TEMPLATE_LIST } from './templates/registry';

/** Remotion root: one composition per registered template. */
export function RemotionRoot() {
  return (
    <>
      {TEMPLATE_LIST.map(({ id, Composition }) => (
        <Composition key={id} />
      ))}
    </>
  );
}
