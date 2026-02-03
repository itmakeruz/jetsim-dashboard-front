import { Meta } from "./commonTypes";

export interface User {
  id: number;
  name: string | null;
  email: string;
  phone_number: string | null;
  address: string | null;
  about: string | null;
  image: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsersListResponse {
  data: User[];
  meta: Meta;
}
