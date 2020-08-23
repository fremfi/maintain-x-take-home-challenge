import { Controller, Get, Route } from "tsoa";
import { IUser } from "../users/user";
import { ProductivityService } from "./productivity_service";

@Route("api/productivity")
export class ProductivityController extends Controller {
  @Get()
  public async getUsersNotAssignedToOpenWorkOrders(): Promise<IUser[]> {
    return await new ProductivityService().getUsersNotAssignedToOpenWorkOrders();
  }
}
