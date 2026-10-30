import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}

const ai = new GoogleGenAI({
    apiKey,
});

export default ai;


// import {GoogleGenAI} from '@google/genai';
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: 'gemini-flash-latest',
//     contents: 'Why is the sky blue?',
//   });
//   console.log(response.text);
// }

// main();