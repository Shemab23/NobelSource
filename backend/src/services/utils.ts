import { IDs, type IdTypes } from "../dataBase/schema";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

import type { Response } from "express";

type CookieOptions = {
  maxAge?: number;
};

export const generateId = (tName: IdTypes): string => {
  const year = new Date().getFullYear().toString();
  const suffix = crypto.randomBytes(8).toString("hex");
  return `${IDs[tName]}${year}${suffix}`;
};

export const hashPassword = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, 10);
};


export const comparePassword = async (
  raw: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(raw, hashed);
};

export const Tables = [
  "user",
  "admin_action",
  "profile",
  "document",
  "notice",
  "interaction",
  "communicate",
  "room",
  "room_member",
  "engagement",
  "shipment",
  "shipment_access"
] as const;


// Cookie utils

export const setSessionCookie = (
  res: Response,
  token: string,
  expiresAt?: Date,
  options?: CookieOptions
) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("session_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: expiresAt ? new Date(expiresAt) : undefined,
    maxAge: expiresAt ? undefined : (options?.maxAge ?? 1000 * 60 * 60 * 24),
    path: "/"
  });
};

export const clearSessionCookie = (res: Response) => {
  res.clearCookie("session_token", {
    path: "/"
  });
};
