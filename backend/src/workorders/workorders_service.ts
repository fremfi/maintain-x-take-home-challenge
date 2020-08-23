import sql, { rawSql } from "../db";
import {
  IWorkOrder,
  IWorkOrderCreationRequestPayload,
  IWorkOrderUpdateRequestPayload,
} from "./workorder";

export class WorkOrdersService {
  public async getWorkOrders(): Promise<IWorkOrder[]> {
    return await sql(
      "SELECT * FROM work_orders ORDER BY CASE WHEN status = 'OPEN' THEN 1 WHEN status = 'CLOSED' THEN 2 END"
    );
  }

  public async getWorkOrderByID(id: number): Promise<IWorkOrder> {
    const response = await sql(
      "SELECT work_orders.id, work_orders.name, work_orders.status, users.id AS user_id, users.name AS user_name, users.email AS user_email FROM work_orders LEFT JOIN work_order_assignees ON work_order_assignees.work_order_id = work_orders.id LEFT JOIN users ON work_order_assignees.user_id = users.id WHERE work_orders.id = ? ",
      id
    );
    if (response.length == 0) {
      return {} as IWorkOrder;
    }
    let assignees: any = [];
    response.forEach((workOrder: any) => {
      if (workOrder.user_id == null) return;
      assignees.push({
        id: workOrder.user_id,
        name: workOrder.user_name,
        email: workOrder.user_email,
      });
    });
    return {
      id: response[0].id,
      name: response[0].name,
      status: response[0].status,
      assignees,
    };
  }

  public async createWorkOrder(payload: IWorkOrderCreationRequestPayload) {
    const response = await rawSql(
      `INSERT INTO work_orders (name, status) VALUES ("${payload.name}", "OPEN"); SELECT SCOPE_IDENTITY()`
    );

    payload.assignees_id.forEach(async (assigneeId: any) => {
      await sql(
        `INSERT INTO work_order_assignees (work_order_id, user_id) VALUES ("${response.lastID}","${assigneeId}")`
      );
    });
  }

  public async updateWorkOrderStatus(
    id: number,
    payload: IWorkOrderUpdateRequestPayload
  ) {
    return await sql(
      `UPDATE work_orders SET status = "${payload.status}" WHERE id = ?`,
      id
    );
  }
}
