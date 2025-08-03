import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, User, MessageSquare, CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react';
import { updateDecision } from '../mock/decisions';
import { mockUsers, getCurrentUser } from '../mock/users';
import { Receipt, Stance, Decision } from '../types';
import StatusPill, { getDecisionStatus } from '../components/StatusPill';
import Avatar from '../components/Avatar';
import { Button } from '../components/ui/button';
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

const DecisionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch decision from backend API
  useEffect(() => {
    const fetchDecision = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/decisions/${id}`);
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

    if (id) {
      fetchDecision();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading decision...</h2>
          <p className="text-muted-foreground">Fetching decision details from the server.</p>
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Decision not found</h2>
          <p className="text-muted-foreground mb-6">The decision you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center space-x-2 px-6 py-3 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const author = mockUsers.find(u => u.id === decision.authorId);
  const currentUserReceipt = decision.receipts.find(r => r.userId === currentUser.id);
  const isAuthor = decision.authorId === currentUser.id;
  const canRespond = !isAuthor && currentUserReceipt && currentUserReceipt.stance === null;
  
  const dueDate = new Date(decision.dueAt);
  const createdDate = new Date(decision.createdAt);
  
  const respondedCount = decision.receipts.filter(r => r.stance !== null).length;
  const totalCount = decision.receipts.length;
  const progressPercentage = totalCount > 0 ? (respondedCount / totalCount) * 100 : 0;

  const handleStanceChange = async (stance: Stance) => {
    if (!currentUserReceipt) return;

    try {
      // Call the backend API to update the receipt
      const response = await fetch(`http://localhost:3001/api/decisions/${decision.id}/receipts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          stance
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update receipt');
      }

      const result = await response.json();
      const updatedDecision = result.data;
      
      setDecision(updatedDecision);
      
      // Update the global mock data
      updateDecision(decision.id, updatedDecision);

      // Check if all have agreed after this update
      const allAgreed = updatedDecision.receipts.every(r => r.stance === 'AGREE');
      const allResponded = updatedDecision.receipts.every(r => r.stance !== null);
      
      if (allAgreed && allResponded) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      const successEmojis = ['🎉', '✨', '👍', '💫'];
      const randomEmoji = successEmojis[Math.floor(Math.random() * successEmojis.length)];
      
      toast({
        title: `Decision approved! ${randomEmoji}`,
        description: "You've approved this decision.",
      });
    } catch (error) {
      console.error('Error updating receipt:', error);
      toast({
        title: "Error",
        description: "Failed to approve decision. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Convert markdown-like content to JSX (simple implementation)
  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium text-foreground mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-muted-foreground mb-2">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to={`/dashboard?view=${searchParams.get('view') || 'my'}`}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>

        {/* Decision Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-border p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-4">{decision.title}</h1>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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

          <div className="flex items-center space-x-4 mb-6">
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
            className="bg-white rounded-xl border border-border p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Response</h3>
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
            className={`rounded-xl p-6 mb-8 ${
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
          className="bg-white rounded-xl border border-border p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Team Responses</h3>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-muted rounded-full h-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar user={user} size="md" />
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
    </div>
  );
};

export default DecisionDetail;