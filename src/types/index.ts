import { Permission } from "src/entities/permission.entity";

declare module 'express' {
  interface Request {
    user: JwtUserData
  }


  interface JwtUserData {
    userId: number;
    username: string;
    email: string;
    roles: string[];
    permissions: Permission[]
  }
}