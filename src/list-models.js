import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const run = async () => {
  try {
    const models = await genAI.listModels();

    console.log("AVAILABLE MODELS:");
    models.forEach(m => console.log(m.name));
  } catch (err) {
    console.error("ERROR:", err);
  }
};

run();