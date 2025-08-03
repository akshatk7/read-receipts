import { Link } from 'react-router-dom';
import { CheckCircle2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CreateDecisionModal from './CreateDecisionModal';

const Navbar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-white/90"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] rounded-lg group-hover:scale-105 transition-transform duration-200">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] bg-clip-text text-transparent">
                Read Receipts
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] text-white rounded-lg hover:shadow-[var(--shadow-brand)] transition-all duration-300 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Decision</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <CreateDecisionModal 
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
};

export default Navbar;