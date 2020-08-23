import { Controller, Get, Route } from "tsoa";
import { IUser } from "./user";
import { UsersService } from "./users_service";

@Route("api/users")
export class UsersController extends Controller {
  @Get()
  public async getUser(): Promise<IUser[]> {
    return await new UsersService().getUsers();
  }
}
