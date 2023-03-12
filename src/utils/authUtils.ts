import jwt from "jsonwebtoken";

export const generateAuthToken = (userId: number): string => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET ?? '', { expiresIn: "1h" });
  return token;
};

export const verifyAuthToken = (token: string): { id: number } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number };
    return decoded;
  } catch (err) {
    console.error(err);
    return null;
  }
};
