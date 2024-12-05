import { db } from './index';
import { Comment, commentSchema } from './schema';
import { generateId } from '../utils';

export const comments = {
  create: (data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const comment: Comment = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const validated = commentSchema.parse(comment);

    const stmt = db.prepare(`
      INSERT INTO comments (id, text, userId, modelId, createdAt, updatedAt)
      VALUES (@id, @text, @userId, @modelId, @createdAt, @updatedAt)
    `);

    stmt.run(validated);
    return validated;
  },

  findByModelId: (modelId: string) => {
    const stmt = db.prepare(`
      SELECT c.*, u.username, u.avatarUrl
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.modelId = ?
      ORDER BY c.createdAt DESC
    `);
    return stmt.all(modelId) as (Comment & { username: string; avatarUrl?: string })[];
  },

  delete: (id: string) => {
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    stmt.run(id);
  },
};