import { Request, Response } from 'express';
import { Decision, CreateDecisionRequest, UpdateReceiptRequest, ApiResponse } from '@read-receipts/shared';
import { createError } from '../middleware/errorHandler.js';

// Mock data - replace with database in production
let mockDecisions: Decision[] = [
  // COMPLETED (ALIGNED) - Akshat's decisions
  {
    id: 'decision_1',
    title: 'Choose real-time order tracking API provider',
    detail: 'We need to decide between Mapbox, Google Maps, and HERE Technologies for our real-time order tracking implementation. This affects customer experience and delivery accuracy.',
    project: 'Customer Experience',
    dueAt: '2024-02-28T00:00:00Z',
    createdAt: '2024-01-28T11:00:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-01-28T11:00:00Z' },
      { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-01-30T09:15:00Z' }
    ]
  },
  {
    id: 'decision_2',
    title: 'Select mobile app development framework',
    detail: 'We need to align on whether to use React Native, Flutter, or native iOS/Android for our mobile app development. This impacts development speed and code sharing.',
    project: 'Mobile Engineering',
    dueAt: '2024-02-15T00:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-01-16T14:30:00Z' },
      { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-01-17T09:45:00Z' }
    ]
  },
  {
    id: 'decision_3',
    title: 'Finalize restaurant onboarding flow design',
    detail: 'We need to align on the final restaurant onboarding flow design between Option A (guided wizard) and Option B (self-service). This affects merchant conversion rates.',
    project: 'Merchant Experience',
    dueAt: '2024-03-01T00:00:00Z',
    createdAt: '2024-01-25T09:00:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-01-26T14:30:00Z' },
      { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-01-27T11:20:00Z' }
    ]
  },

  // INCOMPLETE - OVERDUE (past due date)
  {
    id: 'decision_4',
    title: 'Choose driver app dark mode implementation',
    detail: 'We need to decide between Material Design dark theme and custom dark theme for the driver app. This affects driver experience during night shifts.',
    project: 'Driver Experience',
    dueAt: '2024-01-15T00:00:00Z', // Past due
    createdAt: '2024-01-10T11:00:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-01-11T16:00:00Z' },
      { userId: 'user_3', stance: null, respondedAt: null }
    ]
  },
  {
    id: 'decision_5',
    title: 'Select payment processing partner',
    detail: 'We need to align on whether to use Stripe, Square, or PayPal for our payment processing. This affects transaction fees and payment success rates.',
    project: 'Payments',
    dueAt: '2024-01-20T00:00:00Z', // Past due
    createdAt: '2024-01-05T14:30:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: null, respondedAt: null },
      { userId: 'user_3', stance: null, respondedAt: null }
    ]
  },

  // INCOMPLETE - PENDING (future due date)
  {
    id: 'decision_6',
    title: 'Choose delivery API testing framework',
    detail: 'We need to decide between Jest, Mocha, and Cypress for our delivery API testing strategy. This impacts code quality and deployment confidence.',
    project: 'Backend Engineering',
    dueAt: '2025-09-15T00:00:00Z', // Future (after Aug 5, 2025)
    createdAt: '2024-02-05T11:00:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-02-06T16:45:00Z' },
      { userId: 'user_3', stance: null, respondedAt: null }
    ]
  },
  {
    id: 'decision_7',
    title: 'Select customer analytics platform',
    detail: 'We need to align on whether to use Mixpanel, Amplitude, or Google Analytics for customer behavior tracking. This affects our data insights and product decisions.',
    project: 'Data & Analytics',
    dueAt: '2025-10-20T00:00:00Z', // Future (after Aug 5, 2025)
    createdAt: '2024-02-10T08:00:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: null, respondedAt: null },
      { userId: 'user_3', stance: null, respondedAt: null }
    ]
  },
  {
    id: 'decision_8',
    title: 'Choose driver verification security provider',
    detail: 'We need to decide between Onfido, Jumio, and ID.me for driver background verification. This affects security compliance and driver onboarding speed.',
    project: 'Security & Compliance',
    dueAt: '2025-11-25T00:00:00Z', // Future (after Aug 5, 2025)
    createdAt: '2024-02-15T09:30:00Z',
    authorId: 'user_1',
    receipts: [
      { userId: 'user_2', stance: null, respondedAt: null },
      { userId: 'user_3', stance: null, respondedAt: null },
      { userId: 'user_4', stance: null, respondedAt: null }
    ]
  },

  // MENTIONING ME - Decisions where others are requesting Akshat's alignment
  {
    id: 'decision_9',
    title: 'Choose customer support ticketing system',
    detail: 'We need to decide between Zendesk, Intercom, and Freshdesk for our customer support platform. This affects support team efficiency and customer satisfaction.',
    project: 'Customer Support',
    dueAt: '2025-08-30T00:00:00Z',
    createdAt: '2024-02-20T10:00:00Z',
    authorId: 'user_2', // Nate Lemeiux requesting alignment
    receipts: [
      { userId: 'user_1', stance: null, respondedAt: null }, // Akshat hasn't responded yet
      { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-02-21T14:30:00Z' },
      { userId: 'user_4', stance: 'AGREE', respondedAt: '2024-02-22T09:15:00Z' } // 2 out of 3 done
    ]
  },
  {
    id: 'decision_10',
    title: 'Select restaurant menu management platform',
    detail: 'We need to align on whether to use Toast, Square, or Lightspeed for restaurant menu management. This affects merchant onboarding and menu updates.',
    project: 'Merchant Tools',
    dueAt: '2025-09-10T00:00:00Z',
    createdAt: '2024-02-25T09:15:00Z',
    authorId: 'user_3', // Willa Zhang requesting alignment
    receipts: [
      { userId: 'user_1', stance: null, respondedAt: null }, // Akshat hasn't responded yet
      { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-02-26T11:20:00Z' },
      { userId: 'user_5', stance: 'AGREE', respondedAt: '2024-02-27T16:45:00Z' } // 2 out of 3 done
    ]
  },
  {
    id: 'decision_11',
    title: 'Choose driver incentive program structure',
    detail: 'We need to decide between flat rate bonuses, performance-based incentives, or hybrid model for driver compensation. This affects driver retention and delivery speed.',
    project: 'Driver Operations',
    dueAt: '2025-09-25T00:00:00Z',
    createdAt: '2024-03-01T13:45:00Z',
    authorId: 'user_4', // Olivia Xu requesting alignment
    receipts: [
      { userId: 'user_1', stance: 'AGREE', respondedAt: '2024-03-02T16:00:00Z' }, // Akshat has agreed
      { userId: 'user_2', stance: null, respondedAt: null },
      { userId: 'user_6', stance: null, respondedAt: null }
    ]
  },
  {
    id: 'decision_12',
    title: 'Select data warehouse solution',
    detail: 'We need to align on whether to use Snowflake, BigQuery, or Redshift for our data warehouse. This affects analytics capabilities and data processing speed.',
    project: 'Data Infrastructure',
    dueAt: '2025-10-05T00:00:00Z',
    createdAt: '2024-03-05T08:30:00Z',
    authorId: 'user_5', // Erin Butler requesting alignment
    receipts: [
      { userId: 'user_1', stance: null, respondedAt: null }, // Akshat hasn't responded yet
      { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-03-06T12:15:00Z' },
      { userId: 'user_7', stance: 'AGREE', respondedAt: '2024-03-07T10:30:00Z' } // 2 out of 3 done
    ]
  },
  {
    id: 'decision_13',
    title: 'Choose marketing automation platform',
    detail: 'We need to decide between HubSpot, Marketo, and Pardot for our marketing automation. This affects customer acquisition and retention campaigns.',
    project: 'Marketing',
    dueAt: '2025-10-15T00:00:00Z',
    createdAt: '2024-03-10T11:20:00Z',
    authorId: 'user_6', // Natalie Binns requesting alignment
    receipts: [
      { userId: 'user_1', stance: null, respondedAt: null }, // Akshat hasn't responded yet
      { userId: 'user_8', stance: null, respondedAt: null },
      { userId: 'user_9', stance: null, respondedAt: null }
    ]
  }
];

// Function to update a decision in the mock data
const updateDecision = (decisionId: string, updatedDecision: Decision) => {
  const decisionIndex = mockDecisions.findIndex(d => d.id === decisionId);
  if (decisionIndex !== -1) {
    mockDecisions[decisionIndex] = updatedDecision;
  }
};

export const getDecisions = async (req: Request, res: Response<ApiResponse<Decision[]>>) => {
  try {
    res.json({
      success: true,
      data: mockDecisions,
      message: 'Decisions retrieved successfully'
    });
  } catch (error) {
    throw createError('Failed to retrieve decisions', 500);
  }
};

export const getDecision = async (req: Request, res: Response<ApiResponse<Decision>>) => {
  try {
    const { id } = req.params;
    const decision = mockDecisions.find(d => d.id === id);

    if (!decision) {
      throw createError('Decision not found', 404);
    }

    res.json({
      success: true,
      data: decision,
      message: 'Decision retrieved successfully'
    });
  } catch (error) {
    throw error;
  }
};

export const createDecision = async (req: Request, res: Response<ApiResponse<Decision>>) => {
  try {
    const decisionData: CreateDecisionRequest = req.body;

    const newDecision: Decision = {
      id: `decision_${Date.now()}`,
      title: decisionData.title,
      detail: decisionData.detail,
      project: decisionData.project || 'General',
      dueAt: decisionData.dueAt,
      createdAt: new Date().toISOString(),
      authorId: 'user_1', // TODO: Get from auth
      receipts: decisionData.teamMemberEmails
        .filter(email => email !== 'user_1') // Exclude the author from receipts
        .map(email => ({
          userId: email, // TODO: Map email to user ID
          stance: null,
          respondedAt: null
        }))
    };

    mockDecisions.push(newDecision);

    res.status(201).json({
      success: true,
      data: newDecision,
      message: 'Decision created successfully'
    });
  } catch (error) {
    throw createError('Failed to create decision', 500);
  }
};

export const updateReceipt = async (req: Request, res: Response<ApiResponse<Decision>>) => {
  try {
    const { id } = req.params;
    const receiptData: UpdateReceiptRequest = req.body;

    const decision = mockDecisions.find(d => d.id === id);
    if (!decision) {
      throw createError('Decision not found', 404);
    }

    const receipt = decision.receipts.find(r => r.userId === receiptData.userId);
    if (!receipt) {
      throw createError('Receipt not found', 404);
    }

    // Update the receipt
    receipt.stance = receiptData.stance;
    receipt.respondedAt = new Date().toISOString();

    // Update the decision in the mock data
    updateDecision(id, decision);

    res.json({
      success: true,
      data: decision,
      message: 'Receipt updated successfully'
    });
  } catch (error) {
    throw error;
  }
}; 