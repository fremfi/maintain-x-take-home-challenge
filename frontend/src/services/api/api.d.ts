export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IWorkOrder {
  id: number;
  name: string;
  status: string;
  assignees?: IUser[];
}

export interface IError {
  message?: string;
}

export interface IWorkOrderStatusUpdateResponse {
  success: string;
}

export interface IWorkOrderCreateResponse {
  success: string;
}
