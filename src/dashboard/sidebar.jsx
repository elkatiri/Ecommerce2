import { AppShellNavbar } from '@mantine/core';
import '../styles/sidebar.css';
import { Boxes, ChartNoAxesCombined, LayoutDashboard, LogOut, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  return (
    <AppShellNavbar className="sidebar">
      <div className="sidebar-top">
        <LayoutDashboard size={20} />
        <span className="sidebar-title">Dashboard</span>
      </div>

      <div className="sidebar-menu">
        <div className={`sidebar-link${location.pathname === '/analytics' ? ' active' : ''}`}
         onClick={() => navigate('/analytics')}
          style={{ cursor: 'pointer' }}>
          <ChartNoAxesCombined size={18} /><span>anlaytics</span>
        </div>
        <div
          className={`sidebar-link${location.pathname === '/orders' ? ' active' : ''}`}
          onClick={() => navigate('/orders')}
          style={{ cursor: 'pointer' }}
        >
          <ShoppingBag size={18} /><span>orders</span>
        </div>
        <div
          className={`sidebar-link${location.pathname === '/products' ? ' active' : ''}`}
          onClick={() => navigate('/products')}
          style={{ cursor: 'pointer' }}
        >
          <Boxes size={18} /><span>products</span>
        </div>
      </div>

      <div className="sidebar-logout" onClick={() => navigate('/login')}>
        <LogOut size={18} color="red" />
        <span className="logout-text">Log Out</span>
      </div>
    </AppShellNavbar>
  );
};

export default Sidebar;
