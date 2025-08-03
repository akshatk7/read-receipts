import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MessageSquare, CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react';
import { updateDecision } from '../mock/decisions';
import { mockUsers, getCurrentUser } from '../mock/users';
import { Receipt, Stance, Decision } from '../types';
import StatusPill, { getDecisionStatus } from './StatusPill';
import Avatar from './Avatar';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

// Confetti component for celebration
const Confetti = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            rotate: 0,
            scale: 0
          }}
          animate={{
            y: window.innerHeight + 10,
            rotate: Math.random() * 360,
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
          className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
          style={{
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}
    </div>
  );
};

interface DecisionDetailModalProps {
  decisionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const DecisionDetailModal = ({ decisionId, isOpen, onClose }: DecisionDetailModalProps) => {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch decision from backend API
  useEffect(() => {
    const fetchDecision = async () => {
      if (!decisionId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/decisions/${decisionId}`);
        if (!response.ok) {
          throw new Error('Decision not found');
        }
        const result = await response.json();
        setDecision(result.data);
      } catch (error) {
        console.error('Error fetching decision:', error);
        setDecision(null);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && decisionId) {
      fetchDecision();
    }
  }, [decisionId, isOpen]);

  const handleStanceChange = async (stance: Stance) => {
    if (!decision) return;

    try {
      const response = await fetch(`http://localhost:3001/api/decisions/${decision.id}/receipts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          stance: stance
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update stance');
      }

      const result = await response.json();
      setDecision(result.data);

      // Show confetti if this was the final approval
      const status = getDecisionStatus(result.data);
      if (status === 'Aligned') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      toast({
        title: stance === 'AGREE' ? 'Decision approved! 🎉' : 'Response updated',
        description: stance === 'AGREE' ? 'Your approval has been recorded.' : 'Your response has been updated.',
      });
    } catch (error) {
      console.error('Error updating stance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your response. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mb-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('- ')) {
          return <p key={index} className="ml-4 mb-1">• {line.slice(2)}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Loading decision...</h2>
              <p className="text-muted-foreground">Fetching decision details from the server.</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!decision) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">Decision not found</h2>
              <p className="text-muted-foreground mb-4">The decision you're looking for doesn't exist.</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const author = mockUsers.find(u => u.id === decision.authorId);
  const dueDate = new Date(decision.dueAt);
  const createdDate = new Date(decision.createdAt);
  const respondedCount = decision.receipts.filter(r => r.stance === 'AGREE').length;
  const totalCount = decision.receipts.length;
  const progressPercentage = totalCount > 0 ? (respondedCount / totalCount) * 100 : 0;
  const isAuthor = decision.authorId === currentUser.id;
  const canRespond = !isAuthor && decision.receipts.some(r => r.userId === currentUser.id && r.stance === null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Decision Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6">
            <AnimatePresence>
              {showConfetti && <Confetti />}
            </AnimatePresence>

            {/* Decision Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-3">{decision.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Requestor: {author?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due {dueDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Created {createdDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <StatusPill decision={decision} />
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{respondedCount}/{totalCount} responses</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                {renderMarkdown(decision.detail)}
              </div>
            </motion.div>

            {/* Response Actions */}
            {canRespond && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-muted/50 rounded-lg p-4 mb-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">Your Response</h3>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleStanceChange('AGREE')}
                    className="flex items-center space-x-2 bg-[hsl(var(--status-agreed))] hover:bg-[hsl(var(--status-agreed)/0.9)] text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve</span>
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Requestor Message */}
            {isAuthor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-lg p-4 mb-6 ${
                  getDecisionStatus(decision) === 'Aligned' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${
                  getDecisionStatus(decision) === 'Aligned' 
                    ? 'text-green-900' 
                    : 'text-blue-900'
                }`}>
                  {getDecisionStatus(decision) === 'Aligned'
                    ? 'Decision Approved! 🎉'
                    : 'Waiting for Team Approval'
                  }
                </h3>
                <p className={`${
                  getDecisionStatus(decision) === 'Aligned'
                    ? 'text-green-700'
                    : 'text-blue-700'
                }`}>
                  {getDecisionStatus(decision) === 'Aligned'
                    ? 'All team members have approved your decision. The team is now aligned!'
                    : 'You requested this decision and are waiting for the team members below to provide their approval.'
                  }
                </p>
              </motion.div>
            )}

            {/* Team Responses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-muted/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Team Responses</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-2 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] rounded-full"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {decision.receipts.map((receipt, index) => {
                  // Handle both user IDs (user_2) and email addresses (sarah@alignmentai.com)
                  const user = mockUsers.find(u => u.id === receipt.userId || u.email === receipt.userId);
                  if (!user) return null;

                  return (
                    <motion.div
                      key={receipt.userId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar user={user} size="sm" />
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {receipt.stance === 'AGREE' && (
                          <span className="status-pill status-agreed">
                            <CheckCircle2 className="h-3 w-3" />
                            Agreed
                          </span>
                        )}
                        {receipt.stance === null && (
                          <span className="status-pill status-waiting">
                            <AlertCircle className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DecisionDetailModal; 