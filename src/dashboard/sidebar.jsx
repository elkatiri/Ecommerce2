import { AppShellNavbar } from '@mantine/core';
import '../styles/sidebar.css';
import { Boxes, ChartNoAxesCombined, LayoutDashboard, LogOut, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize the hook

  return (
    <AppShellNavbar className="sidebar">
      <div className="sidebar-top">
        <LayoutDashboard size={20} />
        <span className="sidebar-title">Dashboard</span>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-link"><ChartNoAxesCombined size={18} /><span>anlaytics</span></div>
        <div className="sidebar-link"><ShoppingBag size={18} /><span>orders</span></div>
        <div
          className="sidebar-link"
          onClick={() => navigate('/products')}
          style={{ cursor: 'pointer' }}
        >
          <Boxes size={18} /><span>products</span>
        </div>
      </div>

      <div className="sidebar-logout">
        <LogOut size={18} color="red" />
        <span className="logout-text">Log Out</span>
      </div>
    </AppShellNavbar>
  );
};

export default Sidebar;
