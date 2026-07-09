//Google Gemini AI 設定檔
//負責初始化 Google Gemini SDK，建立全域共用的 AI Client，提供整個系統呼叫 Gemini API
//系統中的 aiService.js會直接匯入本檔案，並透過 ai.models.generateContent()與 Google Gemini 溝通
import { GoogleGenAI } from "@google/genai";                 //匯入 Google Gemini SDK
import dotenv from "dotenv";                                 // 匯入 dotenv，用於讀取 .env 環境變數

dotenv.config();                                             //載入 .env 檔案

//建立 Google Gemini Client
//整個專案都可以共用此 AI Client，避免重複建立連線
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});                //Google Gemini API 金鑰:來源：process.env.GEMINI_API_KEY

export default ai;