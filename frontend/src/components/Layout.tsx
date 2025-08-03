import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { mockGroups } from '@/mock/decisions';

const Layout = () => {
  const selectedGroup = mockGroups[0]; // Only one group now

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <Outlet context={{ selectedGroup }} />
    </div>
  );
};

export default Layout;