import { Request, Response } from 'express';
import { User } from './entities';
interface cookiesStore {
    token?: string;
}
export type MyContext = {
    req: Request & { cookies: cookiesStore };
    res: Response;
    user: User;
};

export type TokenDecoded = {
    userId: number;
};
