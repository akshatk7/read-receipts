import { Request, Response } from 'express';
import { User, ApiResponse } from '@read-receipts/shared';
import { createError } from '../middleware/errorHandler.js';

// Mock data - replace with database in production
const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Akshat Khandelwal',
    email: 'akshat@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_2',
    name: 'Nate Lemeiux',
    email: 'nate@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_3',
    name: 'Willa Zhang',
    email: 'willa@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_4',
    name: 'Olivia Xu',
    email: 'olivia@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_5',
    name: 'Erin Butler',
    email: 'erin@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_6',
    name: 'Natalie Binns',
    email: 'natalie@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_7',
    name: 'Don Lee',
    email: 'don@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_8',
    name: 'Stephen Kent',
    email: 'stephen@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-7e378215f2c8?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_9',
    name: 'Lambie Lanman',
    email: 'lambie@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_10',
    name: 'Kun Hu',
    email: 'kun@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_11',
    name: 'Charlie Furrer',
    email: 'charlie@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_12',
    name: 'Peng Zhai',
    email: 'peng@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_13',
    name: 'Xin Chen',
    email: 'xin@doordash.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
];

export const getUsers = async (req: Request, res: Response<ApiResponse<User[]>>) => {
  try {
    res.json({
      success: true,
      data: mockUsers,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    throw createError('Failed to retrieve users', 500);
  }
};

export const getUser = async (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    throw error;
  }
}; 