import { getDB } from './index';
import { Model, modelSchema } from './schema';
import { generateId } from '../utils';

export const models = {
  async create(data: Omit<Model, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'likes'>) {
    const now = new Date().toISOString();
    const model: Model = {
      id: generateId(),
      ...data,
      downloads: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    };

    const validated = modelSchema.parse(model);
    const db = await getDB();
    await db.add('models', validated);
    return validated;
  },

  async findById(id: string) {
    const db = await getDB();
    const model = await db.get('models', id);
    return model || null;
  },

  async findAll() {
    const db = await getDB();
    return db.getAll('models');
  },

  async update(id: string, data: Partial<Model>) {
    const db = await getDB();
    const existingModel = await this.findById(id);
    if (!existingModel) {
      throw new Error('Model not found');
    }

    const updatedModel = {
      ...existingModel,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const validated = modelSchema.parse(updatedModel);
    await db.put('models', validated);
    return validated;
  },

  async delete(id: string) {
    const db = await getDB();
    await db.delete('models', id);
  }
};