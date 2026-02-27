export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  PENDING: "pending",
  ACTIVE: "active",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
