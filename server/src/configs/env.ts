export const port = Number(process.env.PORT) || 7000
export const nodeEnv = process.env.NODE_ENV
export const dbUrl = process.env.DB_URL
export const languageDefault = process.env.LOCALE
export const secretKey: string = process.env.SECRET_KEY || 'secretKey'
