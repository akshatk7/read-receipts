import { Decision } from '../types';

// Function to update a decision in the mock data (if needed for local updates)
export const updateDecision = (decisionId: string, updatedDecision: Decision) => {
  // This function is kept for potential local updates, but we're now using backend API
  console.log('Local decision update:', decisionId, updatedDecision);
};