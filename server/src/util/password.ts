import { hash, verify } from "argon2";

export const hashPassword = hash;
export const verifyPassword = verify;
