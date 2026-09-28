export type PropertyCategory = 
  | 'House for Sale'
  | 'Land for Sale'
  | 'Land for Development'
  | 'Flat for Sale'
  | 'Villa for Sale'
  | 'Commercial Property'
  | 'Plot for Sale'
  | 'Gated Apartment';

export type PropertyStatus = 'Published' | 'Draft' | 'Pending';

export type PriceUnit = 'Thousand' | 'Lakh' | 'Crore';

export type UploadedTimeframe = 'All' | '1 Week' | '1 Month' | '6 Months';

export interface PropertySpecs {
  bhk?: string;
  bathrooms?: number;
  areaSqFt: number;
  facing?: string;
  furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  possession?: 'Ready to Move' | 'Under Construction';
  reraApproved?: boolean;
}

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  price: string; // e.g. "₹1.85 Cr" or "₹92 Lakh"
  priceAmount: number; // numeric in Lakhs for precise filtering
  owner: string;
  phone: string;
  email?: string;
  location: string; // e.g. "Anna Nagar, Chennai"
  area: string; // "Anna Nagar"
  address: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
  images: string[];
  videoId: string; // YouTube mock ID e.g. "HS-YT-1082"
  videoDuration: string;
  videoTitle: string;
  videoViews?: string;
  description: string;
  specs: PropertySpecs;
  status: PropertyStatus;
  uploadedAt: string; // ISO date string
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface FilterState {
  categories: PropertyCategory[];
  minPrice: number; // In Lakhs
  maxPrice: number; // In Lakhs
  uploadedWithin: UploadedTimeframe;
  searchMobile: string;
}

export interface SellFormData {
  // Step 1: Location
  latitude: number;
  longitude: number;
  locationName: string;
  landmark: string;
  pincode: string;

  // Step 2: Video
  videoFile: File | null;
  videoFileName: string;
  videoFileSize: string;
  videoThumbnail: string;
  youtubeId: string;
  youtubeUrlInput?: string;

  // Step 3: Details
  title: string;
  category: PropertyCategory;
  priceValue: string;
  priceUnit: PriceUnit;
  negotiable?: boolean;
  ownerName: string;
  contactNumber: string;
  description: string;
  areaSqFt: string;
  bhk: string;
  bathrooms?: number;
  furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  facing?: string;
  propertyThumbnail: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}
