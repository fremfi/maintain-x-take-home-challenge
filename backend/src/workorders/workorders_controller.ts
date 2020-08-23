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
    return await new WorkOrdersService().getWorkOrderByID(workOrderId);
  }

  @SuccessResponse("201", "Created")
  @Post("/new")
  public async createUser(
    @Body() requestBody: IWorkOrderCreationRequestPayload
  ): Promise<IWorkOrderCreationResponsePayload> {
    this.setStatus(201);
    await new WorkOrdersService().createWorkOrder(requestBody);

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

    await new WorkOrdersService().updateWorkOrderStatus(
      workOrderId,
      requestBody
    );

    return {
      success: "OK",
    };
  }
}
