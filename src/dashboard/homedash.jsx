import { AppShell, AppShellMain } from '@mantine/core';
import Sidebar from './sidebar';

function Homedash() {
  return (
    <AppShell
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <Sidebar />
      <AppShellMain>
        {/* Your page content goes here */}
      </AppShellMain>
    </AppShell>
  );
}

export default Homedash;