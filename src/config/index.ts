import dotenv from "dotenv";
import Path from "path";

dotenv.config({
  path: Path.join(process.cwd(), ".env"),
});

const config = {
  connection_String: process.env.DATABASE_URL as string,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET as string,
};

export default config;
