export interface UserFollower {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  profilePicture: string;
  isActive: boolean;
}

export enum UserRole {
  Administrator = 0,
  Author = 1,
  Tourist = 2,
}