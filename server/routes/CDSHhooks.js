//CDS Hooks API Router，模擬 HL7 CDS Hooks Service，根據病人最新的 AI Observation，產生 Clinical Decision Support (CDS) 警示卡片，提供醫師於 EHR 中查看
import express from "express";
// 匯入 FHIR Service
// 用來取得病人最新的 AI Observation
import {getLatestObservation} from "../services/fhirService.js";

const router = express.Router();

//病人預診檢查，根據病人最新 Observation，產生 CDS Hooks Alert Card
router.post("/patient-triage-check", async (req, res) => {
    try {
        const { context } = req.body;                                       //取得 Request Body
        const patientId = context.patientId;
        const observation = await getLatestObservation(patientId);          //查詢最新 Observation
        if (!observation) {                                                 //若沒有 Observation直接回傳空 Card
            return res.json({cards: []});
        }
        const score = observation.valueQuantity?.value;                     //取得 Observation 資料
        const note = observation.note?.[0]?.text;
        let cards = [];                                                     //建立 CDS Cards
        if (score >= 5) {                                                   //Score >=5，顯示高風險提醒
            cards.push({
                summary: "🚨 高風險病人警示",
                indicator: "critical",
                detail:`Urgency Score：${score}AI摘要：${note}`,
                source: {
                    label: "AI Triage System"
                }
            });
        }
        res.json({ cards });                                                 //回傳 CDS Hooks Cards
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "CDS Hooks Error"
        });
    }
});

export default router;