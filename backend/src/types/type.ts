import type { User } from "../dataBase/schema";

export type LoginResponse = {
  user: User;
  token: string;
};
