import { Model } from '../types/model';

export const models: Model[] = [
  {
    id: '1',
    name: 'Realistic Portrait v2.0',
    description: 'A highly detailed model for creating realistic human portraits with enhanced facial features and natural lighting. Perfect for professional headshots and character creation.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    creator: 'ArtificialMuse',
    downloads: 12453,
    likes: 3242,
    tags: ['portrait', 'realistic', 'face', 'photography'],
    createdAt: '2024-03-15',
    version: '2.0.0',
    baseModel: 'SD XL 1.0',
    samples: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    ],
    triggerWords: ['portrait', 'realistic lighting', 'detailed face']
  },
  {
    id: '2',
    name: 'Anime Style Generator',
    description: 'Create beautiful anime-style illustrations with this specialized model. Perfect for character designs and scenes.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477',
    creator: 'AnimeArtist',
    downloads: 8976,
    likes: 2654,
    tags: ['anime', 'illustration', 'character', 'cartoon'],
    createdAt: '2024-03-14',
    version: '1.5.0',
    baseModel: 'SD 1.5',
    samples: [
      'https://images.unsplash.com/photo-1578632292335-df3abbb0d586',
      'https://images.unsplash.com/photo-1578632767061-24496a0b8929'
    ],
    triggerWords: ['anime style', 'vibrant colors', 'clean lines']
  },
  {
    id: '3',
    name: 'Landscape Dreams',
    description: 'Generate stunning landscape images with dramatic lighting and atmospheric effects.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    creator: 'NatureCraft',
    downloads: 6543,
    likes: 1897,
    tags: ['landscape', 'nature', 'scenery', 'outdoor'],
    createdAt: '2024-03-13',
    version: '1.0.1',
    baseModel: 'SD XL Turbo',
    samples: [
      'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716'
    ],
    triggerWords: ['landscape', 'dramatic lighting', 'nature']
  }
];