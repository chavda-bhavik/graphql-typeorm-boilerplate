import { CookieOptions } from 'express';

export const __prod__ = process.env.NODE_ENV === 'production';
export const RegularExpresssions = {
    email: /.+@.+\..+/,
    mobile: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
};
export const cookieConfig: CookieOptions = {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'none',
};
