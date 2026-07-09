//Dashboard API Router : 提供醫師 Dashboard 所需的統計資訊，方便首頁快速顯示 AI 預診分析結果
//從 HAPI FHIR Server 查詢 AI 預診 Observation，並統計目前病人的風險分布，提供 Dashboard 即時顯示
import express from "express";
import axios from "axios";

const router = express.Router();         // 建立 Express Router

//建立 FHIR Axios Client，與 HAPI FHIR Server 溝通
const fhir = axios.create({
    baseURL: process.env.FHIR_BASE_URL,
    headers: {
        "Content-Type": "application/fhir+json"
    }
});

//取得 Dashboard 統計資料
router.get("/statistics", async (req, res) => {
try {
    // 查詢所有 AI 預診 Observation
    const response = await fhir.get(
        "/Observation?code=80615-8&_sort=-date"
    );
    const entries = response.data.entry || [];                    //Observation Bundle
    //初始化統計變數
    let critical = 0;
    let warning = 0;
    let normal = 0;
    let emergency = 0;
    //統計 Observation
    entries.forEach((entry) => {
        const observation = entry.resource;                             //Observation Resource
        const score = observation.valueQuantity?.value || 0;            //AI Urgency Score
        const department = observation.component?.find(                 //AI 建議科別
            item => item.code?.text === "Department")?.valueString || "";
            // 風險等級統計
            if (score >= 8) {
                critical++;
            } else if (score >= 5) {
                warning++;
            } else {
                normal++;
            }
            if (department.includes("急診") || score >= 8) {emergency++;}      //建議急診:條件： AI 建議科別為急診或Urgency Score >= 8
        });
        res.json({                             //回傳 Dashboard 統計
            today: entries.length,             //今日 AI 預診總人數
            critical,                          //高風險病人
            warning,                           //中風險病人
            normal,                            //低風險病人
            emergency                          //建議急診人數
        });
    } catch (err) {
        console.error("Dashboard 即時統計失敗");
        console.error(err.response?.data || err.message);
        res.status(500).json({
            message: "Dashboard 即時統計失敗",
            error: err.response?.data || err.message
        });
    }
});

export default router;                          //匯出 Router