import { Decision } from '../types';

export type Group = {
  id: string;
  name: string;
  decisions: Decision[];
};

// Function to update a decision in the mock data
export const updateDecision = (decisionId: string, updatedDecision: Decision) => {
  const group = mockGroups.find(g => g.id === 'work');
  if (group) {
    const decisionIndex = group.decisions.findIndex(d => d.id === decisionId);
    if (decisionIndex !== -1) {
      group.decisions[decisionIndex] = updatedDecision;
    }
  }
};

export const mockGroups: Group[] = [
  {
    id: 'work',
    name: 'Work',
    decisions: [
      {
        id: 'decision_1',
        title: 'Adopt TypeScript for new projects',
        detail: 'We should standardize on TypeScript for all new frontend projects to improve code quality and developer experience.',
        project: 'Frontend Infrastructure',
        dueAt: '2024-02-15T00:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        authorId: 'user_1',
        receipts: [
          { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-01-16T14:30:00Z' },
          { userId: 'user_3', stance: null, respondedAt: null }
        ]
      },
      {
        id: 'decision_2',
        title: 'Implement dark mode',
        detail: 'Add dark mode support to improve user experience and reduce eye strain.',
        project: 'UI/UX',
        dueAt: '2024-02-20T00:00:00Z',
        createdAt: '2024-01-20T11:00:00Z',
        authorId: 'user_2',
        receipts: [
          { userId: 'user_1', stance: 'AGREE', respondedAt: '2024-01-21T16:00:00Z' },
          { userId: 'user_3', stance: null, respondedAt: null }
        ]
      },
      {
        id: 'decision_3',
        title: 'Choose new office location',
        detail: 'We need to decide on a new office location that accommodates our growing team.',
        project: 'Operations',
        dueAt: '2024-03-01T00:00:00Z',
        createdAt: '2024-01-25T09:00:00Z',
        authorId: 'user_1',
        receipts: [
          { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-01-26T14:30:00Z' },
          { userId: 'user_3', stance: null, respondedAt: null }
        ]
      },
      {
        id: 'decision_4',
        title: 'Implement new CI/CD pipeline',
        detail: 'We should implement a new CI/CD pipeline to improve our deployment process.',
        project: 'DevOps',
        dueAt: '2024-02-28T00:00:00Z',
        createdAt: '2024-01-28T11:00:00Z',
        authorId: 'user_1',
        receipts: [
          { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-01-28T11:00:00Z' },
          { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-01-30T09:15:00Z' }
        ]
      },
      {
        id: 'decision_5',
        title: 'Choose new project management tool',
        detail: 'We need to decide between Jira, Linear, and ClickUp for our project management needs.',
        project: 'Product Management',
        dueAt: '2024-03-15T00:00:00Z',
        createdAt: '2024-02-01T14:30:00Z',
        authorId: 'user_2',
        receipts: [
          { userId: 'user_1', stance: null, respondedAt: null },
          { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-02-02T09:15:00Z' },
          { userId: 'user_4', stance: null, respondedAt: null }
        ]
      },
      {
        id: 'decision_6',
        title: 'Implement automated testing strategy',
        detail: 'We should establish a comprehensive automated testing strategy including unit, integration, and E2E tests.',
        project: 'Quality Assurance',
        dueAt: '2024-03-10T00:00:00Z',
        createdAt: '2024-02-05T11:00:00Z',
        authorId: 'user_3',
        receipts: [
          { userId: 'user_1', stance: null, respondedAt: null },
          { userId: 'user_2', stance: 'AGREE', respondedAt: '2024-02-06T16:45:00Z' }
        ]
      },
      {
        id: 'decision_7',
        title: 'Select new office location',
        detail: 'We need to choose between downtown, midtown, or the suburbs for our new office expansion.',
        project: 'Operations',
        dueAt: '2024-02-25T00:00:00Z',
        createdAt: '2024-02-10T08:00:00Z',
        authorId: 'user_4',
        receipts: [
          { userId: 'user_1', stance: 'AGREE', respondedAt: '2024-02-11T14:30:00Z' },
          { userId: 'user_2', stance: null, respondedAt: null },
          { userId: 'user_3', stance: null, respondedAt: null }
        ]
      },
      {
        id: 'decision_8',
        title: 'Implement dark mode',
        detail: 'Add dark mode support to improve user experience and reduce eye strain.',
        project: 'UI/UX',
        dueAt: '2024-02-20T00:00:00Z',
        createdAt: '2024-01-20T11:00:00Z',
        authorId: 'user_2',
        receipts: [
          { userId: 'user_1', stance: 'AGREE', respondedAt: '2024-01-21T16:00:00Z' },
          { userId: 'user_3', stance: 'AGREE', respondedAt: '2024-01-22T09:30:00Z' }
        ]
      }
    ]
  }
];

// Legacy export for backward compatibility
export const mockDecisions: Decision[] = [
  ...mockGroups[0].decisions
];