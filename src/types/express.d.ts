import { NextFunction, Request, Response } from 'express';
import { UserType } from './mongoose';

declare global {
  /**
   * Represents an extended Request object with additional properties.
   */
  export interface IReq extends Request {
    /**
     * Represents the user associated with the request.
     */
    user: UserType;
  }

  /**
   * Represents the response object in Express.js.
   */
  export interface IRes extends Response {}

  /**
   * Represents the next function in Express.js.
   */
  export interface INext extends NextFunction {}
}
