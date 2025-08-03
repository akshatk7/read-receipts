import { User } from '../types';

// alignment.ai employees
export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Akshat Khandelwal',
    email: 'akshat@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_2',
    name: 'Sarah Chen',
    email: 'sarah@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_3',
    name: 'Michael Rodriguez',
    email: 'michael@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_4',
    name: 'Emily Johnson',
    email: 'emily@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_5',
    name: 'David Kim',
    email: 'david@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_6',
    name: 'Lisa Thompson',
    email: 'lisa@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_7',
    name: 'James Wilson',
    email: 'james@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_8',
    name: 'Rachel Green',
    email: 'rachel@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-7e378215f2c8?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_9',
    name: 'Alex Martinez',
    email: 'alex@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_10',
    name: 'Sophie Williams',
    email: 'sophie@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_11',
    name: 'Ryan Davis',
    email: 'ryan@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_12',
    name: 'Maria Garcia',
    email: 'maria@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_13',
    name: 'Kevin Brown',
    email: 'kevin@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
];

export const getCurrentUser = (): User => {
  return mockUsers[0]; // Akshat Khandelwal as current user
};