require("dotenv").config();

module.exports = {
  serverPort: process.env.SERVER_PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  key_id: process.env.KEY_ID,
  app_key: process.env.APP_KEY,
  bucket: process.env.BUCKET,
  endpoint_s3: process.env.ENDPOINT_S3,
};
