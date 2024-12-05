import { getDB } from './index';
import { Image, imageSchema } from './schema';
import { generateId } from '../utils';

export const images = {
  async create(data: Omit<Image, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const image: Image = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const validated = imageSchema.parse(image);
    const db = await getDB();
    await db.add('images', validated);
    return validated;
  },

  async findByModelId(modelId: string) {
    const db = await getDB();
    const index = db.transaction('images').store.index('by-model');
    return index.getAll(modelId);
  },

  async delete(id: string) {
    const db = await getDB();
    await db.delete('images', id);
  },
};