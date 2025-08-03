import { Decision } from '../types';
import { mockDecisions } from '../mock/decisions';
import { getCurrentUser } from '../mock/users';
import { getDecisionStatus } from '../components/StatusPill';

const currentUser = getCurrentUser();

// Get decisions authored by the current user
export const getMyDecisions = (decisions: Decision[] = mockDecisions): Decision[] => {
  return decisions.filter(decision => decision.authorId === currentUser.id);
};

// Get decisions where current user is mentioned in receipts (but not the author)
export const getMentioningMe = (decisions: Decision[] = mockDecisions): Decision[] => {
  return decisions.filter(decision => 
    decision.authorId !== currentUser.id && 
    decision.receipts.some(receipt => receipt.userId === currentUser.id)
  );
};

// Get all decisions (unchanged)
export const getAllDecisions = (): Decision[] => {
  return mockDecisions;
};

// KPI calculations
export const getOutstandingCount = (): number => {
  const myDecisions = getMyDecisions();
  const now = new Date();
  
  return myDecisions.filter(decision => {
    const status = getDecisionStatus(decision);
    const dueDate = new Date(decision.dueAt);
    return status !== 'Aligned' && dueDate >= now;
  }).length;
};

export const getNeedsMyInputCount = (): number => {
  const mentioningMe = getMentioningMe();
  const now = new Date();
  
  return mentioningMe.filter(decision => {
    const dueDate = new Date(decision.dueAt);
    const myReceipt = decision.receipts.find(r => r.userId === currentUser.id);
    return myReceipt?.stance === null && dueDate >= now;
  }).length;
};

export const getOverdueCount = (): number => {
  const now = new Date();
  
  return mockDecisions.filter(decision => {
    const dueDate = new Date(decision.dueAt);
    if (dueDate >= now) return false; // Not overdue
    
    const isAuthor = decision.authorId === currentUser.id;
    const myReceipt = decision.receipts.find(r => r.userId === currentUser.id);
    const isMentioned = !!myReceipt;
    
    if (isAuthor) {
      const status = getDecisionStatus(decision);
      return status !== 'Aligned';
    } else if (isMentioned) {
      return myReceipt.stance === null;
    }
    
    return false;
  }).length;
};
