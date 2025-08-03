// Core types for Read Receipts application
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export type Stance = 'AGREE' | null;

export interface Receipt {
  userId: string;
  stance: Stance;
  respondedAt: string | null;
}

export interface Decision {
  id: string;
  title: string;
  detail: string;
  project: string;
  dueAt: string;
  createdAt: string;
  authorId: string;
  receipts: Receipt[];
}

export type DecisionStatus = 'Aligned' | 'Overdue' | 'Pending' | 'Deprioritized';

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface CreateDecisionRequest {
  title: string;
  detail: string;
  project: string;
  dueAt: string;
  teamMemberEmails: string[];
}

export interface UpdateReceiptRequest {
  decisionId: string;
  userId: string;
  stance: Stance;
}

// Environment types
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  FRONTEND_URL: string;
} 