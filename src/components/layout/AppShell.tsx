import type { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
