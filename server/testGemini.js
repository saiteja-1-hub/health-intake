import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    console.log("Testing Gemini...");

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: "Say hello in one sentence.",
      });

    console.log("Gemini response:");
    console.log(response.text);

  } catch (error) {
    console.error("Gemini failed");

    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);
  }
}

testGemini();