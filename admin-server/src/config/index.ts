export const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/godin-lowcode',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
  }
}; 