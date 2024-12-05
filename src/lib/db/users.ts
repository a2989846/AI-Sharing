import { getDB } from './index';
import { User, userSchema } from './schema';
import { generateId } from '../utils';

export const users = {
  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const user: User = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const validated = userSchema.parse(user);
    const db = await getDB();
    await db.add('users', validated);
    return validated;
  },

  async findByUsername(username: string) {
    const db = await getDB();
    const users = await db.getAll('users');
    return users.find(user => user.username === username);
  },

  async findByEmail(email: string) {
    const db = await getDB();
    const users = await db.getAll('users');
    return users.find(user => user.email === email);
  },

  async findById(id: string) {
    const db = await getDB();
    return db.get('users', id);
  },

  async update(id: string, data: Partial<User>) {
    const db = await getDB();
    const user = await this.findById(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const validated = userSchema.parse(updatedUser);
    await db.put('users', validated);
    return validated;
  },
};