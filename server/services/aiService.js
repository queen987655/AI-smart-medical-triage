//Google Gemini AI Service
//呼叫 Google Gemini，將病人的主訴文字進行 AI 分析，並回傳符合本系統需求的 JSON 結果
import ai from "../config/gemini.js";                    //匯出 AI Client

//AI 主訴分析，根據病人的主訴，呼叫 Google Gemini 進行 AI 預診分析。
export async function analyzeComplaint(complaint) {
    //建立 Prompt
    const prompt = `你是一位醫療預診AI。請根據病人的主訴分析。病人主訴：${complaint}請只回傳 JSON，不要加入 Markdown，不要加入說明。
    格式如下：{
    "emotion":"",
    "urgency_score":0,
    "summary":"",
    "triage_level":"",
    "recommended_department":"",
    "keywords": [],
    "timestamp": ""
    }
    請勿輸出 Markdown。`;
    //呼叫 Gemini API
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
    });
    const text = response.text                 //取得 AI 回傳內容
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
    //JSON Parse
    const result = JSON.parse(text);
        if (!result.timestamp) {                                         //補齊 timestamp，Gemini 未回傳 timestamp，系統自動補上目前時間。
            result.timestamp = new Date().toISOString();
        }
        if (!result.keywords) {                                          //補齊 keywords，若 Gemini 未回傳 keywords，避免後續 Builder 發生錯誤
            result.keywords = [];
        }
    return result;                              //回傳 AI 分析結果
}