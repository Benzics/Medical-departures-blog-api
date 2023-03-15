export class User {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}