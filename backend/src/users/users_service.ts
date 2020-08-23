import { IUser } from "./user";
import sql from "../db";

export class UsersService {
  public async getUsers(): Promise<IUser[]> {
    const response = await sql("SELECT * FROM users");
    return response;
  }
}
