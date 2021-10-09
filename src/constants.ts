export const __prod__ = process.env.NODE_ENV === 'production';
export const salt = '$2a$10$W7z7SlPE3UYSHUeu6JRzge';
export const RegularExpresssions = {
    email: /.+@.+\..+/,
    mobile: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
};
