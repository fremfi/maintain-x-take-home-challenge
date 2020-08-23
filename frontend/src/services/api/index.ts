import { Http } from "../http";
import {
  IWorkOrder,
  IError,
  IUser,
  IWorkOrderCreateResponse,
  IWorkOrderStatusUpdateResponse,
} from "./api";
const Api = {
  GetWorkOrders: async (): Promise<[IWorkOrder[], IError | undefined]> => {
    let workOrdersResponse: IWorkOrder[] = [];
    let errorResponse: IError | undefined;

    try {
      workOrdersResponse = await Http.Request<IWorkOrder[]>(
        "GET",
        "/api/workorders"
      );
    } catch (error) {
      errorResponse = {
        message:
          error.message ||
          "Sorry, we are experiencing technical difficulties. Please try again later",
      };
    }

    return [workOrdersResponse, errorResponse];
  },
  GetWorkOrderByID: async (
    id: string
  ): Promise<[IWorkOrder | undefined, IError | undefined]> => {
    let workOrderResponse: IWorkOrder | undefined;
    let errorResponse: IError | undefined;

    try {
      workOrderResponse = await Http.Request<IWorkOrder>(
        "GET",
        `/api/workorders/${id}`
      );
    } catch (error) {
      errorResponse = {
        message:
          error.message ||
          "Sorry, we are experiencing technical difficulties. Please try again later",
      };
    }

    return [workOrderResponse, errorResponse];
  },
  UpdateWorkOrderStatus: async (
    id: string,
    status: string
  ): Promise<[IError | undefined]> => {
    let errorResponse: IError | undefined;

    try {
      await Http.Request<IWorkOrderStatusUpdateResponse>(
        "POST",
        `/api/workorders/${id}/status`,
        undefined,
        { status }
      );
    } catch (error) {
      console.log(error);
      errorResponse = {
        message:
          error.message ||
          "Sorry, we are experiencing technical difficulties. Please try again later",
      };
    }

    return [errorResponse];
  },
  GetUsers: async (): Promise<[IUser[] | undefined, IError | undefined]> => {
    let usersResponse: IUser[] | undefined;
    let errorResponse: IError | undefined;

    try {
      usersResponse = await Http.Request<IUser[]>("GET", "/api/users");
    } catch (error) {
      errorResponse = {
        message:
          error.message ||
          "Sorry, we are experiencing technical difficulties. Please try again later",
      };
    }

    return [usersResponse, errorResponse];
  },
  GetUnassignedUsers: async (): Promise<
    [IUser[] | undefined, IError | undefined]
  > => {
    let usersResponse: IUser[] | undefined;
    let errorResponse: IError | undefined;

    try {
      usersResponse = await Http.Request<IUser[]>("GET", "/api/productivity");
    } catch (error) {
      errorResponse = {
        message:
          error.message ||
          "Sorry, we are experiencing technical difficulties. Please try again later",
      };
    }

    return [usersResponse, errorResponse];
  },
  CreateWorkOrder: async (
    name: string,
    assignees_id: number[]
  ): Promise<[IError | undefined]> => {
    let errorResponse: IError | undefined;

    try {
      await Http.Request<IWorkOrderCreateResponse>(
        "POST",
        `/api/workorders/new`,
        undefined,
        {
          name,
          assignees_id,
        }
      );
    } catch (error) {
      errorResponse = {
        message:
          error.message ||
          "Sorry, we are experiencing technical difficulties. Please try again later",
      };
    }

    return [errorResponse];
  },
};

export default Api;
