import { NextFunction, Request, Response } from 'express';
import { UserType } from './mongoose';
import { Document, InferSchemaType } from 'mongoose';
import User from '@models/User';
import Mentor from '@models/Mentor';

declare global {
  /**
   * Represents an extended Request object with additional properties.
   */
  export interface IReq extends Request {
    user?: InferSchemaType<typeof User.schema> &
      InferSchemaType<typeof Mentor.schema>;
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
