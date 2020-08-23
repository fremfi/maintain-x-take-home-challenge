import { IUser } from "./user";
import sql from "../db";
import { DatabaseError } from "../error";

export class UsersService {
  public async getUsers(): Promise<IUser[]> {
    try {
      return await sql("SELECT * FROM users");
    } catch (e) {
      throw new DatabaseError();
    }
  }
}
