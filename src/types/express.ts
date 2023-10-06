import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface RequestAuth extends Request {
  user: {
    _id: string | JwtPayload;
  };
}
export interface RequestData extends Request {
  body: {
    [key: string]: any;
  };
}