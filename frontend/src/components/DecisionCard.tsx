import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Users } from 'lucide-react';
import { Decision } from '../types';
import { mockUsers } from '../mock/users';
import StatusPill from './StatusPill';
import Avatar from './Avatar';

interface DecisionCardProps {
  decision: Decision;
  index?: number;
}

const DecisionCard = ({ decision, index = 0 }: DecisionCardProps) => {
  const [searchParams] = useSearchParams();
  const author = mockUsers.find(u => u.id === decision.authorId);
  const dueDate = new Date(decision.dueAt).toLocaleDateString();
  const respondedCount = decision.receipts.filter(r => r.stance !== null).length;
  const totalCount = decision.receipts.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/decision/${decision.id}?view=${searchParams.get('view') || 'my'}`}>
        <div className="bg-white rounded-xl border border-border p-6 card-hover">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1 mr-4">
              {decision.title}
            </h3>
            <StatusPill decision={decision} />
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {decision.detail.replace(/#{1,6}\s/g, '').substring(0, 120)}...
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{author?.name}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{dueDate}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{respondedCount}/{totalCount}</span>
              </div>
              
              <div className="flex -space-x-1">
                {decision.receipts.slice(0, 3).map((receipt) => {
                  const user = mockUsers.find(u => u.id === receipt.userId);
                  if (!user) return null;
                  return (
                    <Avatar
                      key={receipt.userId}
                      user={user}
                      size="sm"
                      className="ring-2 ring-white"
                    />
                  );
                })}
                {decision.receipts.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground ring-2 ring-white">
                    +{decision.receipts.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DecisionCard;