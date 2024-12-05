import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().optional(),
  isAdmin: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const modelSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  downloadUrl: z.string().url().optional(),
  creator: z.string(),
  downloads: z.number().default(0),
  likes: z.number().default(0),
  tags: z.array(z.string()),
  version: z.string(),
  baseModel: z.string(),
  images: z.array(z.string().url()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const articleSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  content: z.string(),
  author: z.string(),
  createdAt: z.string(),
  summary: z.string(),
  images: z.array(z.string()).default([]),
});

export type User = z.infer<typeof userSchema>;
export type Model = z.infer<typeof modelSchema>;
export type Article = z.infer<typeof articleSchema>;