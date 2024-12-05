import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { User, Model, Image, Comment } from './schema';

interface ModelShareDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-username': string; 'by-email': string };
  };
  models: {
    key: string;
    value: Model;
    indexes: { 'by-creator': string };
  };
  images: {
    key: string;
    value: Image;
    indexes: { 'by-model': string };
  };
  comments: {
    key: string;
    value: Comment;
    indexes: { 'by-model': string; 'by-user': string };
  };
}

let dbPromise: Promise<IDBPDatabase<ModelShareDB>>;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ModelShareDB>('modelshare', 1, {
      upgrade(db) {
        // Users store
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-username', 'username', { unique: true });
        userStore.createIndex('by-email', 'email', { unique: true });

        // Models store
        const modelStore = db.createObjectStore('models', { keyPath: 'id' });
        modelStore.createIndex('by-creator', 'creator');

        // Images store
        const imageStore = db.createObjectStore('images', { keyPath: 'id' });
        imageStore.createIndex('by-model', 'modelId');

        // Comments store
        const commentStore = db.createObjectStore('comments', { keyPath: 'id' });
        commentStore.createIndex('by-model', 'modelId');
        commentStore.createIndex('by-user', 'userId');
      },
    });
  }
  return dbPromise;
}