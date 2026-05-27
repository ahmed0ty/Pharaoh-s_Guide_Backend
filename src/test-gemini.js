import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ⚠️ استخدم هذا الموديل (الأكثر توافقًا عالميًا)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

async function run() {
  try {
    const result = await model.generateContent("Hello from Egypt 🇪🇬");
    const text = result.response.text();

    console.log("SUCCESS ✅:", text);
  } catch (err) {
    console.error("ERROR ❌:", err.message);
  }
}

run();