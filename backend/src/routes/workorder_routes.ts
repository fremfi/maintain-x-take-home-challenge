import { Router, Request, Response } from "express";
import Database from "../services/db";
const router = Router();

router.get("/workorders", async (req: Request, res: Response) => {
  try {
    const response = await Database.getWorkOrders();
    return res.json(response);
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.get("/workorders/:id", async (req: Request, res: Response) => {
  try {
    const response = await Database.getWorkOrderByID(Number(req.params.id));

    if (response.length == 0) {
      return res.sendStatus(404);
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
    return res.json({
      id: response[0].id,
      name: response[0].name,
      status: response[0].status,
      assignees,
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.post("/workorders/new", async (req: Request, res: Response) => {
  try {
    await Database.createWorkOrder(req.body.name, req.body.assignees_id);

    return res.status(201).send({ success: "OK" });
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.get("/productivity", async (req: Request, res: Response) => {
  try {
    const response = await Database.getUsersNotAssignedToOpenWorkOrders();
    return res.json(response);
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.patch("/workorders/:id/status", async (req: Request, res: Response) => {
  try {
    await Database.getUsersNotAssignedToOpenWorkOrders();
    return res.status(202).send({ success: "OK" });
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const response = await Database.getUsers();
    return res.send(response);
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
