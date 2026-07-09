//AI 預診 API Router
//病人輸入主訴後，前端會呼叫本 API
import express from "express";
import { analyzeComplaint } from "../services/aiService.js";             // AI 分析服務
import {saveAITriage} from "../services/fhirService.js";                 // FHIR Transaction Bundle Service

const router = express.Router();                                         // 建立 Express Router

//AI 預診分析
router.post("/analyze", async (req, res) => {
    try {
        const { complaint, patientId } = req.body;                       //取得 Request Body
        if (!complaint) {                                                //驗證主訴是否存在
            return res.status(400).json({
                message: "請輸入主訴"
            });
        }
        if (!patientId) {                                                 //驗證 Patient ID
            return res.status(400).json({
                message: "缺少 patientId"});
        }
        const aiResult = await analyzeComplaint(complaint);               //呼叫 Google Gemini，開始 AI 分析
        const observation = await saveAITriage(patientId, aiResult);      //儲存至 FHIR，寫入 FHIR
        res.json({                                                        //回傳結果
            success: true,
            analysis: aiResult,
            observation
        });
    }catch (err) {                                                         //發生錯誤，印出：Message、Stack、FHIR Response，方便除錯。
        console.error("========== TRIAGE ERROR ==========");
        console.error(err);
        console.error("Message:");
        console.error(err.message);
        console.error("Stack:");
        console.error(err.stack);
        if (err.response) {                                                //若錯誤來自 HAPI FHIR Server，額外印出 HTTP Status 與OperationOutcome。
            console.error("Status:");
            console.error(err.response.status);
            console.error("FHIR Response:");
            console.error(JSON.stringify(err.response.data, null, 2));
        }
        res.status(500).json({message: err.message});                       //回傳 HTTP 500
}
});

export default router;                                                      // 匯出 Router