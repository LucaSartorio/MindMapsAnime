import { closeSync, mkdirSync, openSync, readFileSync, rmSync, writeSync } from 'node:fs';
import { hostname } from 'node:os';
import path from 'node:path';

/**
 * Minimal guard against two batch renders at once (they would race on the
 * queue files and history). The lock is a file created atomically (`wx`); a
 * lock left by a dead process (crash, kill -9) is detected and taken over.
 */
export class LockError extends Error {}

function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === 'EPERM';
  }
}

export function acquireLock(file: string): () => void {
  mkdirSync(path.dirname(file), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const fd = openSync(file, 'wx');
      writeSync(fd, JSON.stringify({ pid: process.pid, host: hostname(), startedAt: new Date().toISOString() }));
      closeSync(fd);
      let released = false;
      return () => {
        if (released) return;
        released = true;
        rmSync(file, { force: true });
      };
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;
      let owner: { pid?: number; host?: string; startedAt?: string } = {};
      try {
        owner = JSON.parse(readFileSync(file, 'utf8')) as typeof owner;
      } catch {
        /* unreadable lock = stale */
      }
      const sameHost = !owner.host || owner.host === hostname();
      if (owner.pid && sameHost && alive(owner.pid)) {
        throw new LockError(`Another pipeline run (render or publication apply) is running (pid ${owner.pid}, since ${owner.startedAt}). Lock: ${file}`);
      }
      if (!sameHost) throw new LockError(`Queue locked by ${owner.host} (pid ${owner.pid}). Remove ${file} if that run is gone.`);
      rmSync(file, { force: true }); // stale lock
    }
  }
  throw new LockError(`Could not acquire ${file}`);
}
