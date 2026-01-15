import dotenv from 'dotenv'
dotenv.config()
export const config = {
  cors:{
    ALLOWED_ORIGIN:process.env.FRONTEND_URL
  },
  server: {
    PORT: process.env.PORT || 5000,
  },
  database:{
    URL:process.env.MONGO_URL||''
  },
  jwt:{
    ACCESS_SECRET_KEY:process.env.JWT_ACCESS_KEY || 'access-secret-key',
    ACCESS_EXPIRES_IN:process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    REFRESH_SECRET_KEY:process.env.JWT_REFRESH_KEY || 'refresh-secret-key',
    REFRESH_EXPIRES_IN:process.env.JWT_REFRESH_EXPIRES_IN || '14d',
    RESET_SECRET_KEY:process.env.JWT_RESET_SECRET_KEY || 'reset-secret-key',
    RESET_EXPIRES_IN:process.env.JWT_RESET_EXPIRES_IN || '5m'


  },
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
};
