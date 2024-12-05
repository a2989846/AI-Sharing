export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  summary: string;
  images?: string[];
}

export interface Block {
  id: string;
  type: 'text' | 'image';
  content: string;
}