export interface Product {
  id: string;
  name: string;
  price: string;
  brand: string;
  thumbnail: string; // URL for the circular icon
  description: string; // Prompt for the AI
  category: 'shirt' | 'hoodie' | 'jacket' | 'polo' | 'pants' | 'skirt' | 'dress' | 'blouse';
  color: string;
}

export interface GeneratedResult {
  imageUrl: string;
  productId: string;
}