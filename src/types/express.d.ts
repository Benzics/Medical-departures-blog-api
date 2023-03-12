import { User } from '../models/user';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: User;
  }
}