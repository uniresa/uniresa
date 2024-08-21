export interface Photo {
  id: string;
  image: string;
}

export interface Room {
  id: string;
  name: string;
  size: number;
  refundable: string;
  payment: string;
  bed: string;
}

export interface Property {
  id: string;
  name: string;
  propertyImage: string;
  rating: number;
  address: string;
  oldPrice: number;
  newPrice: number;
  latitude: string;
  longitude: string;
  photos: Photo[];
  rooms: Room[];
  registrationDate: string;
  distanceToPoint: string;
  propertyType: string;
  reviews: number;
  reviewsRating: number;
  description?: string;
}

export interface Place {
  id: string;
  place: string;
  placeImage: string;
  shortDescription: string;
  properties: Property[];
}
