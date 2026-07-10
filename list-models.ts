import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const aiClient = new GoogleGenAI({});
async function run() {
  try {
     const models = await aiClient.models.list();
     for await (const m of models) {
         console.log(m.name);
     }
  } catch (e: any) {
     console.error("Full error:", JSON.stringify(e, null, 2));
  }
}
run();
