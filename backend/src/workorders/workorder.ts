import { IUser } from "../users/user";
export interface IWorkOrder {
  id: number;
  name: string;
  status: string;
  assignees?: IUser[];
}

export interface IWorkOrderCreationRequestPayload {
  name: string;
  assignees_id: number[];
}

export interface IWorkOrderUpdateRequestPayload {
  name?: string;
  status?: string;
}

export interface IWorkOrderUpdateResponsePayload {
  success: string;
}

export interface IWorkOrderCreationResponsePayload {
  success: string;
}
