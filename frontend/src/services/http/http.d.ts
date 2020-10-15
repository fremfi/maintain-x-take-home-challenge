declare namespace HttpModel {
  export interface IRequestPayload {
    [key: string]: {};
  }

  export interface IRequestQueryPayload {
    [key: string]: string;
  }
}

export { HttpModel };
