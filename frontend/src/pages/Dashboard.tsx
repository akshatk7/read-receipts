import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { User, RefreshCw } from 'lucide-react';
import DecisionTable from '../components/DecisionTable';
import DecisionDetailModal from '../components/DecisionDetailModal';
import { getDecisionStatus } from '../components/StatusPill';
import { getCurrentUser } from '../mock/users';
import { type Decision } from '../types';
import { 
  getMyDecisions, 
  getMentioningMe
} from '../lib/selectors';

type ViewType = 'my' | 'mention';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = (searchParams.get('view') as ViewType) || 'my';
  const currentUser = getCurrentUser();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal state
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setView = (newView: ViewType) => {
    setSearchParams({ view: newView });
  };

  const handleDecisionClick = (decisionId: string) => {
    setSelectedDecisionId(decisionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDecisionId(null);
    // Refresh decisions when modal closes to show any updates
    fetchDecisions(true);
  };

  // Fetch decisions from backend API
  const fetchDecisions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await fetch('http://localhost:3001/api/decisions');
      if (!response.ok) {
        throw new Error('Failed to fetch decisions');
      }
      const result = await response.json();
      setDecisions(result.data);
      console.log('Fetched decisions:', result.data.length);
    } catch (error) {
      console.error('Error fetching decisions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  // Refresh decisions when returning to dashboard
  useEffect(() => {
    const handleFocus = () => {
      fetchDecisions(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Get datasets for each tab from the fetched decisions
  const myDecisions = useMemo(() => getMyDecisions(decisions), [decisions]);
  const baseMentioningMe = useMemo(() => getMentioningMe(decisions), [decisions]);

  // State for handling approvals in mentioning me decisions
  const [approvedDecisions, setApprovedDecisions] = useState<Set<string>>(new Set());

  const handleApproval = (decisionId: string) => {
    setApprovedDecisions(prev => new Set([...prev, decisionId]));
  };

  // Update mentioning me decisions with approvals
  const mentioningMe = useMemo(() => {
    return baseMentioningMe.map(decision => {
      if (approvedDecisions.has(decision.id)) {
        return {
          ...decision,
          receipts: decision.receipts.map(receipt =>
            receipt.userId === currentUser.id
              ? { ...receipt, stance: 'AGREE' as const, respondedAt: new Date().toISOString() }
              : receipt
          )
        };
      }
      return decision;
    });
  }, [baseMentioningMe, approvedDecisions, currentUser.id]);


  const decisionsToShow = useMemo(() => {
    switch (view) {
      case 'my': return myDecisions;
      case 'mention': return mentioningMe;
      default: return myDecisions;
    }
  }, [view, myDecisions, mentioningMe]);

  // Split decisions into incomplete and completed
  const { incompleteDecisions, completedDecisions } = useMemo(() => {
    const incomplete = decisionsToShow
      .filter(decision => {
        const status = getDecisionStatus(decision);
        
        // For "Mentioning Me" view, if I've already responded, don't show it as incomplete
        if (view === 'mention') {
          const myReceipt = decision.receipts.find(r => r.userId === currentUser.id);
          if (myReceipt?.stance !== null) {
            return false; // I've responded, so it's not incomplete for me
          }
        }
        
        return status === 'Pending' || status === 'Overdue';
      })
      .sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime()); // Descending order (most recent due date first)
    
    const completed = decisionsToShow
      .filter(decision => {
        const status = getDecisionStatus(decision);
        
        // For "Mentioning Me" view, if I've responded, show it as completed for me
        if (view === 'mention') {
          const myReceipt = decision.receipts.find(r => r.userId === currentUser.id);
          if (myReceipt?.stance !== null) {
            return true; // I've responded, so it's completed for me
          }
          return false;
        }
        
        // For "My Decisions" view, use the global status
        return status === 'Aligned' || status === 'Deprioritized';
      })
      .sort((a, b) => {
        // Get the most recent response date for each decision
        const getAlignedDate = (decision: Decision) => {
          const responseDates = decision.receipts
            .filter(r => r.respondedAt)
            .map(r => new Date(r.respondedAt!).getTime());
          return responseDates.length > 0 ? Math.max(...responseDates) : new Date(decision.createdAt).getTime();
        };
        
        return getAlignedDate(b) - getAlignedDate(a); // Descending order (most recently aligned first)
      });
    
    return { incompleteDecisions: incomplete, completedDecisions: completed };
  }, [decisionsToShow, view, currentUser.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Get team alignment, track decisions, and keep receipts for when you need them</p>
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setView('my')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'my'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Decisions
            </button>
            <button
              onClick={() => setView('mention')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                view === 'mention'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mentioning Me
            </button>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => fetchDecisions(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Loading decisions...
                </h3>
                <p className="text-muted-foreground">
                  Fetching your latest decisions from the server.
                </p>
              </div>
            </div>
          ) : decisionsToShow.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {view === 'my' && "Nothing pending. Time to make new calls!"}
                  {view === 'mention' && "No one needs you right now—lucky!"}
                </h3>
                <p className="text-muted-foreground">
                  {view === 'my' && "When you create decisions that need team input, they'll appear here."}
                  {view === 'mention' && "Decisions where you're asked for input will show up here."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Incomplete Decisions */}
              {incompleteDecisions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Incomplete ({incompleteDecisions.length})
                  </h2>
                  <DecisionTable 
                    decisions={incompleteDecisions} 
                    isCompleted={false} 
                    showApproval={view === 'mention'}
                    showAuthor={view !== 'my'}
                    onApproval={handleApproval}
                    onDecisionClick={handleDecisionClick}
                  />
                </div>
              )}

              {/* Completed Decisions */}
              {completedDecisions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Completed ({completedDecisions.length})
                  </h2>
                  <DecisionTable 
                    decisions={completedDecisions} 
                    isCompleted={true}
                    showApproval={false}
                    showAuthor={view !== 'my'}
                    onDecisionClick={handleDecisionClick}
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {selectedDecisionId && (
        <DecisionDetailModal
          decisionId={selectedDecisionId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;