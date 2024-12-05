export interface Model {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  creator: string;
  downloads: number;
  likes: number;
  tags: string[];
  createdAt: string;
  version: string;
  baseModel: string;
  images: string[];
  downloadUrl?: string;
  triggerWords?: string[];
}