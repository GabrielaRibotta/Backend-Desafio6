import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';

//PATH
export const __dirname = dirname(fileURLToPath(import.meta.url))

//BCRYPT
export const hashData = async (data) => {
    return bcrypt.hash(data, 10)
}

export const compareData = async (data) => {
    return bcrypt.compare(data, hashData)
}