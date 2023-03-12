import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  message: string;
  statusCode: number;
}

const errorMiddleware = (
  err: Error | ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (typeof err === "object" && "statusCode" in err && "message" in err) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default errorMiddleware;
