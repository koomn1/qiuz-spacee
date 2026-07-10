import * as dotenv from 'dotenv';
dotenv.config();

console.log("ENV Key starts with:", process.env.GEMINI_API_KEY?.substring(0, 8));
