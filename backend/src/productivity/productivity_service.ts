import { IUser } from "../users/user";
import sql from "../db";
import { DatabaseError } from "../error";

export class ProductivityService {
  public async getUsersNotAssignedToOpenWorkOrders(): Promise<IUser[]> {
    try {
      return await sql(
        "SELECT * FROM users WHERE users.id NOT IN (SELECT work_order_assignees.user_id FROM work_order_assignees INNER JOIN work_orders ON work_orders.id = work_order_assignees.work_order_id WHERE work_orders.status = 'OPEN')"
      );
    } catch (e) {
      throw new DatabaseError();
    }
  }
}
