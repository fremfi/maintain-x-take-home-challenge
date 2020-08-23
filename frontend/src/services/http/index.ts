import "isomorphic-unfetch";
import { stringify } from "query-string";
import { HttpModel } from "./http";

const BaseUrl = `http://localhost:4000`;

export const Http = {
  Request: async <A>(
    methodType: string,
    url: string,
    params?: HttpModel.IRequestQueryPayload,
    payload?: HttpModel.IRequestPayload
  ): Promise<A> => {
    return new Promise((resolve, reject) => {
      const query = params ? `?${stringify({ ...params })}` : "";

      fetch(`${BaseUrl}${url}${query}`, {
        body: JSON.stringify(payload),
        cache: "no-cache",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: `${methodType}`,
      })
        .then(async (response) => {
          if (
            response.status === 200 ||
            response.status === 201 ||
            response.status === 202
          ) {
            return response.json().then(resolve);
          }
          return response.json().then(reject);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
