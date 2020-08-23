import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import {
  IWorkOrder,
  IWorkOrderCreationRequestPayload,
  IWorkOrderUpdateRequestPayload,
  IWorkOrderCreationResponsePayload,
  IWorkOrderUpdateResponsePayload,
} from "./workorder";
import { WorkOrdersService } from "./workorders_service";
import { ResourceNotFoundError, DatabaseError } from "../error";

@Route("api/workorders")
export class WorkOrdersController extends Controller {
  @Get()
  public async getUser(): Promise<IWorkOrder[]> {
    return await new WorkOrdersService().getWorkOrders();
  }

  @Get("{workOrderId}")
  public async getWorkOrderByID(
    @Path() workOrderId: number
  ): Promise<IWorkOrder> {
    const workOrder = await new WorkOrdersService().getWorkOrderByID(
      workOrderId
    );
    if (Object.keys(workOrder).length === 0) {
      throw new ResourceNotFoundError(
        `The work order with id: ${workOrderId} does not exist`
      );
    }
    return workOrder;
  }

  @SuccessResponse("201", "Created")
  @Post("/new")
  public async createUser(
    @Body() requestBody: IWorkOrderCreationRequestPayload
  ): Promise<IWorkOrderCreationResponsePayload> {
    this.setStatus(201);
    try {
      await new WorkOrdersService().createWorkOrder(requestBody);
    } catch (e) {
      throw new DatabaseError();
    }
    return {
      success: "OK",
    };
  }

  @SuccessResponse("202", "Accepted")
  @Post("/{workOrderId}/status")
  public async updateWorkOrderStatus(
    @Body() requestBody: IWorkOrderUpdateRequestPayload,
    @Path() workOrderId: number
  ): Promise<IWorkOrderUpdateResponsePayload> {
    this.setStatus(202);
    try {
      await new WorkOrdersService().updateWorkOrderStatus(
        workOrderId,
        requestBody
      );
    } catch (e) {
      throw new DatabaseError();
    }
    return {
      success: "OK",
    };
  }
}
