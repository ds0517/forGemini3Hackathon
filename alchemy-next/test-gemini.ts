import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testGemini() {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API Key not found in .env.local");
        return;
    }

    console.log("Testing Gemini API with key (length:", apiKey.length, ")");
    const ai = new GoogleGenAI({ apiKey });

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: "Hello, respond with OK" }] }]
        });
        console.log("Response:", result.text);
        console.log("Gemini API is working!");
    } catch (err) {
        console.error("Gemini API Test Failed:", err);
    }
}

testGemini();
