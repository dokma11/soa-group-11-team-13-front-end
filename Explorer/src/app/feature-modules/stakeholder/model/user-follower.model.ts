export interface UserFollower {
  ID: number;
  Username: string;
  Password: string;
  role: UserRole;
  ProfilePicture: string;
  IsActive: boolean;
}

export enum UserRole {
  Administrator = 0,
  Author = 1,
  Tourist = 2,
}