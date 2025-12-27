export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  profilePic: string | null;
  lastLogin?: number;
  createdAt?: number;
}
