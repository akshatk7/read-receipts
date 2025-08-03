import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ExternalLink, Check } from 'lucide-react';
import { Decision } from '../types';
import { mockUsers, getCurrentUser } from '../mock/users';
import StatusPill from './StatusPill';
import Avatar from './Avatar';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface DecisionTableProps {
  decisions: Decision[];
  isCompleted?: boolean;
  showApproval?: boolean;
  showAuthor?: boolean;
  onApproval?: (decisionId: string) => void;
  onDecisionClick?: (decisionId: string) => void;
}

const DecisionTable = ({ decisions, isCompleted = false, showApproval = false, showAuthor = true, onApproval, onDecisionClick }: DecisionTableProps) => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const currentUser = getCurrentUser();
  if (decisions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-[hsl(var(--brand-primary)/0.1)] to-[hsl(var(--brand-primary)/0.05)] rounded-full flex items-center justify-center">
          <Calendar className="h-16 w-16 text-[hsl(var(--brand-primary)/0.4)]" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No decisions yet</h3>
        <p className="text-muted-foreground mb-6">Create your first decision to get started with team alignment.</p>
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] text-white rounded-lg hover:shadow-[var(--shadow-brand)] transition-all duration-300"
        >
          <span>Create Decision</span>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Decision
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {isCompleted ? 'Aligned On' : 'Due Date'}
              </th>
              {showAuthor && (
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Requestor
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {decisions.map((decision, index) => {
              const author = mockUsers.find(u => u.id === decision.authorId);
              const dueDate = new Date(decision.dueAt).toLocaleDateString();
              
              // Check if current user needs to respond - in mentioning me, all incomplete decisions should have approve button
              const myReceipt = decision.receipts.find(r => r.userId === currentUser.id);
              const needsMyApproval = showApproval && myReceipt !== undefined; // Show approve button if I'm mentioned, regardless of current stance
              
              // Calculate progress correctly - don't count current user if they haven't responded yet
              const respondedCount = decision.receipts.filter(r => r.stance !== null).length;
              const totalCount = decision.receipts.length;
              const progressPercentage = totalCount > 0 ? (respondedCount / totalCount) * 100 : 0;
              
              return (
                <motion.tr
                  key={decision.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors duration-150 cursor-pointer"
                  onClick={() => onDecisionClick?.(decision.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-foreground line-clamp-1">
                        {decision.title}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {decision.detail.replace(/#{1,6}\s/g, '').substring(0, 80)}...
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <StatusPill decision={decision} />
                      {needsMyApproval && (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 px-3 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onApproval?.(decision.id);
                            toast({
                              title: "Decision Approved",
                              description: "You have successfully approved this decision.",
                            });
                          }}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-2 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] rounded-full"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[3rem]">
                        {respondedCount}/{totalCount}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {dueDate}
                  </td>
                  
                  {showAuthor && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {author && <Avatar user={author} size="sm" />}
                        <span className="text-sm text-foreground">{author?.name}</span>
                      </div>
                    </td>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DecisionTable;