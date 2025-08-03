import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;