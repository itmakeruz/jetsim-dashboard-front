import { Meta } from "./commonTypes";
export interface TransactionsListResponse {
  data: Transaction[];
  meta: Meta;
}
export interface TransactionOrder {
  id: string;
  publicId: string;
  pickupDate: string;
  optionalPickUpDate: string;
  arrivalDate: string | null;
  paymentType: string;
  senderNumber: string;
  recipientNumber: string;
  weight: string;
  cargoValue: string;
  orderTypeId: string;
  transportTypeId: string;
  distance: string;
  customerId: string;
  driverId: string;
  deliveryStatus: string;
  comment: string | null;
  fromPointId: string;
  toPointId: string;
  price: string;
  auction: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Transaction {
  id: string;
  bankTransactionId: string;
  referenceNumber: string | null;
  amount: string;
  transactionDate: string;
  status: string;
  transactionType: string;
  description: string | null;
  cardId: string;
  receiver: string | null;
  userId: string | null;
  orderId: string | null;
  requestData?: Record<string, unknown>;
  responseData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: unknown | null;
  order: TransactionOrder | null;
}

export interface TransactionsListResponse {
  data: Transaction[];
  meta: Meta;
}
