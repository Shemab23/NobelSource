import type { NextFunction,Response } from "express";
import type { AuthRequest } from "../types/request";

export const adminGuard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const isAdmin = req.userContext?.isAdmin;
  // console.log(req.userContext);

  if (!isAdmin) {
    return res.status(403).json({ msg: "Admin rights required", ans: null });
  }

  next();
};

