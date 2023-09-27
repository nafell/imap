import { z } from "zod";

import { DishSchema } from "@/lib/zod";

export const validationErrorCode = 422;
export const validatedHeaderName = "validated";
const validatedHeader: [string, string][] = [[validatedHeaderName, "true"]];

//use zodios instead?
export async function useZodFetch<Tpayload>(
  path: RequestInfo | URL,
  init?: RequestInit,
  payloadSchema?: z.AnyZodObject,
  payload?: Tpayload
): Promise<Response> {
  if (payloadSchema && payload) {
    // ****do validation here****
    // if (!validationResult.success) {
    //   return validationResult.error;
    // }

    const newInit: RequestInit = {
      headers: validatedHeader,
    };

    return fetch(path, newInit);
  }

  //init === null OK?
  return fetch(path, init);
}

//
//server and client
//z.inferのパフォーマンスは？
//目当ての型とschemaが互換性あるかチェック：静的コード解析にやらせる？
export async function handleIncomingData(body: Request | Response, schema: z.AnyZodObject) {
  //if (header.validated) {skip validation} / header.validated === true
  const bodyjson = await body.json(); //eslint ignore this line

  const header = body.headers;
  if (header.has(validatedHeaderName)) {
    return schema.parse(body.json());
  }

  return schema.safeParse(bodyjson);
}

class HandleIncomingData {
  private data;
  private errorMessage;
  private validateSuccess: boolean = false;
  constructor(
    private body: Response | Request,
    schema: z.AnyZodObject
  ) {
    const bodyjson = await body.json();

    const header = body.headers;
    if (header.has(validatedHeaderName)) {
      this.data = schema.parse(bodyjson);
    }

    const validation = schema.safeParse(bodyjson);

    if (validation.success) {
      this.data = validation.data;
      this.validateSuccess = true;
    } else {
      this.errorMessage = validation.error;
      this.validateSuccess = false;
    }

    return this;
  }

  public success(func: (data) => void) {
    if (!this.validateSuccess) return this;

    func(this.data);

    return this;
  }

  public error(func: (message) => void) {
    if (this.validateSuccess) return this;

    func(this.errorMessage);

    return this;
  }
}

//fetch().then()みたいなやつを作りたい
//how to implement extention func?
//parameters are arbituary
export function validateFetchResponse(response: Response, responseSchema: z.AnyZodObject) {
  const validationResult = handleIncomingData(response, responseSchema);
}
//ここから.ok().ng()に繋げる

//
//
//
//
const sendDataFunctionInPage = async () => {
  const res = await fetch("/");
  const result = await handleIncomingData(res, DishSchema);

  if (!result.success) {
    console.log(result.error);
    //message error on UI
    return;
  }

  const { data: Dish } = result.data;

  //
};
