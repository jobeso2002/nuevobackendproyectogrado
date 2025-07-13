import { Request } from "express";

export interface Request_user extends Request {
    user: {
        id: number;
        email: string;
        username: string; 
        role: {
            id: number;
            name: string;
        };
        permisos: string[];
    }
}