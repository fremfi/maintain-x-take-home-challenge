import sql, { rawSql } from "../db";

const getWorkOrders = async () => {
  return sql(
    "SELECT * FROM work_orders ORDER BY CASE WHEN status = 'OPEN' THEN 1 WHEN status = 'CLOSED' THEN 2 END"
  );
};

const getWorkOrderByID = async (id: number) => {
  return sql(
    "SELECT work_orders.id, work_orders.name, work_orders.status, users.id AS user_id, users.name AS user_name, users.email AS user_email FROM work_orders LEFT JOIN work_order_assignees ON work_order_assignees.work_order_id = work_orders.id LEFT JOIN users ON work_order_assignees.user_id = users.id WHERE work_orders.id = ? ",
    id
  );
};

const createWorkOrder = async (name: number, assigneesIds: number[]) => {
  const response = await rawSql(
    `INSERT INTO work_orders (name, status) VALUES ("${name}", "OPEN"); SELECT SCOPE_IDENTITY()`
  );

  assigneesIds.forEach(async (assigneeId: any) => {
    await sql(
      `INSERT INTO work_order_assignees (work_order_id, user_id) VALUES ("${response.lastID}","${assigneeId}")`
    );
  });

  return;
};

const getUsersNotAssignedToOpenWorkOrders = async () => {
  return sql(
    "SELECT * FROM users WHERE users.id NOT IN (SELECT work_order_assignees.user_id FROM work_order_assignees INNER JOIN work_orders ON work_orders.id = work_order_assignees.work_order_id WHERE work_orders.status = 'OPEN')"
  );
};

const updateWorkOrderStatusByID = async (id: number, status: string) => {
  return sql(`UPDATE work_orders SET status = "${status}" WHERE id = ?`, id);
};

const getUsers = async () => {
  return sql("SELECT * FROM users");
};

export default {
  getWorkOrders,
  getWorkOrderByID,
  createWorkOrder,
  getUsersNotAssignedToOpenWorkOrders,
  getUsers,
};
