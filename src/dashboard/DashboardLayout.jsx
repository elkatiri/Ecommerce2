import { AppShell, AppShellMain } from '@mantine/core';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <AppShell navbar={{ width: 250, breakpoint: 'sm' }} padding="md">
      <Sidebar />
      <AppShellMain>
        <Outlet />
      </AppShellMain>
    </AppShell>
  );
}

export default DashboardLayout;