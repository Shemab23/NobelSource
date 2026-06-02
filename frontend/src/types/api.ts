export type BodyProps = Login | Register | LoginResponse| RegisterResponse | FormData;

export type APIResponse<T> = {
  msg: string
  ans: T
}

export type Login = Pick<User, "email" | "password">
export type Logout = { msg: string, ans: string }
export type LoginResponse = APIResponse<{
  user: User
  token: string
}>

/**
 * User Meta & Profile Types
 */
export interface UserProfile {
  name: string;
  image: string;
  phone: string;
  country: string;
  currency: string;
  website: string;
}

export interface UserPermission {
  by: string;
  right: string;
  status: "authorised" | "pending" | "revoked";
  document: string;
}

export interface UserMetadata {
  rating: number;
  profile: UserProfile;
  permissions: UserPermission[];
}

/**
 * Main User Entity
 */
export interface User {
  id: string;
  email: string;
  password: string;
  registration_number: string;
  role: "user" | "admin" | "logistic"; // Add roles as needed
  metadata: UserMetadata;
  created_at: string; // ISO Date
  updated_at: string; // ISO Date
}

/**
 * Response Wrapper
 * Matches the API return: {"msg": "...", "room": {}, "user": {}}
 */
export interface Me {
  msg: string;
  room: Record<string, unknown>;
  user: User;
}


export type Register = Omit<
  User,
  "id" | "created_at" | "updated_at" | "role" | "metadata"
> & {
  metadata: {
    profile: {
      name: string
      phone?: string
      country?: string
      website?: string
      currency?: string
    }
    permissions: { right: string }[]
  }

  permission_keys: string[]
  display_image?: File | null
  permissions: File[]
}

export type RegisterResponse = APIResponse<{
  user: User
  token: string
}>

// posts

export type PostAll = {
    id: string,
    entity_id: string,
    content: {
  title: string;          // What is it? (e.g., "Need 5 Tons Potatoes")
  body: string;           // Detailed description or terms
  description?: string;   // Optional: longer description
  media?: string[];       // Photos of product or specifications
  category: string;
  type: "OFFER" | "WANT"; // Helps users distinguish Have vs Need
  price?: number;         // Optional: if they want to list a starting price
  unit: "kg" | "ton" | "unit" | "letter" | "item" | "hour" | "day";
  currency?: string;      // e.g., "USD"
  location: string;       // Where are you / where is the delivery needed?
  tags?: string[];        // e.g., ["Urgent", "Organic", "Bulk"]
    },
    status: string,
    created_at: Date,
    deleted_at: Date|null
  }
