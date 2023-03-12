import { Request } from "express";
import User from "../models/user";

export interface UserRequest extends Request {
    user?: User
}