import type { User } from "@workspace/db";

export function toStaffUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
  };
}
