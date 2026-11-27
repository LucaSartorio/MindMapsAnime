/**
 * Explicit GPU-resource ownership. Every geometry, material, texture and render target created for a viewer
 * session goes through `track()`; closing the viewer calls `disposeAll()` once. Objects shared inside a session
 * (one material used by 20 meshes, one unit box geometry used by 300 instances) are tracked ONCE, so they are
 * released exactly once and never while still in use. Nothing is shared across sessions: re-opening the viewer
 * rebuilds from code (deterministic), which makes leaks measurable (`renderer.info` returns to zero).
 */
export interface Disposable {
  dispose(): void;
}

export class ResourceTracker {
  private readonly items = new Set<Disposable>();
  private disposed = false;

  track<T extends Disposable>(resource: T): T {
    if (this.disposed) {
      // A late async build finished after the viewer closed: free immediately instead of leaking.
      resource.dispose();
      return resource;
    }
    this.items.add(resource);
    return resource;
  }

  get size(): number {
    return this.items.size;
  }

  disposeAll(): void {
    for (const r of this.items) {
      try {
        r.dispose();
      } catch {
        /* already released by the context loss */
      }
    }
    this.items.clear();
    this.disposed = true;
  }
}
