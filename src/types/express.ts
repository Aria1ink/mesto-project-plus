import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface RequestAuth {
  _id: string | JwtPayload;
}
export interface RequestData {
  body: {
    [key: string]: string;
  };
}