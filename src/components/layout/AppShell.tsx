import type { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface AppShellProps {
  children: ReactNode;
}

/**
 * Shell di base dell'app:
 *  - TopNav sticky
 *  - main area flex-1 con altezza piena (necessario perché la mappa è 100%)
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-dvh flex flex-col">
      <TopNav />
      <main className="flex-1 flex flex-col min-h-0">{children}</main>
    </div>
  );
}
