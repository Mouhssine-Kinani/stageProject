import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV, MONGODB_URI, JWT_SECRET, JWT_EXPIRE_INS ,EMAIL_USER,EMAIL_PASSWORD , FRONT_END_URL} =
  process.env;
