export default () => ({
  environment: process.env.NODE_ENV || 'development',
  host: process.env.HOST,
  apiKey: process.env.API_KEY,
});
