export interface Meta {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
  totalPage: number;
  totalSize: number;
}
export interface GetParams {
  [key: string]: any;
  page?: number;
}
export interface Coordinates {
  lat: number;
  lng: number;
}
export interface Point {
  address: string;
  coordinates: Coordinates;
  comment: string | null;
}
export type UUID = string;
export type ISODateString = string;
export enum DeliveryStatus {
  UNASSIGNED = "UNASSIGNED", // Buyurtma yaratilgan lekin hali tasdiqlanmagan qoralama xolatda
  PENDING = "PENDING", // Buyurtma yaratilgan, lekin driver qabul qilmagan
  ON_THE_WAY = "ON_THE_WAY", // Driver yukni olishga bormoqda
  LOADING = "LOADING", // Driver yukni ortmoqda
  IN_PROGRESS = "IN_PROGRESS", // Driver yukni olib ketmoqda
  UNLOADING = "UNLOADING", // Driver yukni tushurmoqda
  COMPLETED = "COMPLETED", // Buyurtma yakunlandi
  CANCELLED = "CANCELLED", // Buyurtma bekor qilingan
  FAILED = "FAILED", // Buyurtma muvaffaqiyatsiz yakunlandi
}
export interface Rating {
  ratingCounts: {
    [key: number]: number;
  };
  averageRating: number;
  totalReviews: number;
  uniqueReviewers: number;
  satisfiedClients: number;
}
