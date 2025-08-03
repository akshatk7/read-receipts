import { Decision, DecisionStatus } from '../types';
import { CheckCircle2, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { getCurrentUser } from '../mock/users';

interface StatusPillProps {
  decision: Decision;
  className?: string;
}

export const getDecisionStatus = (decision: Decision): DecisionStatus => {
  const now = new Date();
  const dueDate = new Date(decision.dueAt);
  
  // Check if anyone hasn't responded
  const unansweredCount = decision.receipts.filter(r => r.stance === null).length;
  
  // If anyone hasn't responded, check if overdue
  if (unansweredCount > 0) {
    if (now > dueDate) {
      return 'Overdue';
    }
    return 'Pending';
  }
  
  // All have responded and all agreed - this is Aligned regardless of due date
  return 'Aligned';
};

const StatusPill = ({ decision, className = '' }: StatusPillProps) => {
  const status = getDecisionStatus(decision);
  const currentUser = getCurrentUser();
  
  // Check if current user needs to respond to this decision
  const myReceipt = decision.receipts.find(r => r.userId === currentUser.id);
  const needsMyInput = myReceipt?.stance === null;
  
  const statusConfig = {
    'Aligned': {
      className: 'status-agreed',
      icon: CheckCircle2,
      text: 'Aligned'
    },
    'Pending': {
      className: needsMyInput ? 'status-needs-you' : 'status-waiting',
      icon: Clock,
      text: needsMyInput ? 'Needs You' : 'Pending'
    },
    'Overdue': {
      className: 'status-overdue',
      icon: AlertTriangle,
      text: 'Overdue'
    },
    'Deprioritized': {
      className: 'status-deprioritized',
      icon: Clock,
      text: 'Deprioritized'
    }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`status-pill ${config.className} ${className}`}>
      <Icon className="h-3 w-3" />
      {config.text}
    </span>
  );
};

export default StatusPill;