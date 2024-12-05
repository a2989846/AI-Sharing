import { generateId } from '../utils';

class ImageService {
  private static instance: ImageService;
  private imageStorage: Map<string, string>;

  private constructor() {
    this.imageStorage = new Map();
    // Try to load saved images from localStorage
    try {
      const savedImages = localStorage.getItem('imageStorage');
      if (savedImages) {
        this.imageStorage = new Map(JSON.parse(savedImages));
      }
    } catch (error) {
      console.error('Error loading saved images:', error);
    }
  }

  static getInstance(): ImageService {
    if (!this.instance) {
      this.instance = new ImageService();
    }
    return this.instance;
  }

  private saveToStorage() {
    try {
      localStorage.setItem('imageStorage', 
        JSON.stringify(Array.from(this.imageStorage.entries()))
      );
    } catch (error) {
      console.error('Error saving images:', error);
    }
  }

  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const imageId = generateId();
      
      reader.onloadend = () => {
        try {
          const dataUrl = reader.result as string;
          this.imageStorage.set(imageId, dataUrl);
          this.saveToStorage();
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  getImage(id: string): string | undefined {
    return this.imageStorage.get(id);
  }

  getAllImages(): string[] {
    return Array.from(this.imageStorage.values());
  }
}

export const imageService = ImageService.getInstance();