//Health Check API Router，提供系統健康檢查 (Health Check) API，用於確認 AI Triage Server 是否正常運作
//通常於：1. 系統首頁(Home.vue)初始化時呼叫。2. 前端確認後端服務是否可連線。3. 雲端部署後作為服務監控(Health Probe)。
import express from "express";

const router = express.Router();

//回傳目前 AI Triage Server 的運作狀態，用來確認 Express Server 是否正常啟動
router.get("/", (req, res) => {
    res.json({
        success: true,                                       //API 執行成功
        message: "AI Triage Server is running",              //Server 狀態訊息
        timestamp: new Date().toISOString()                  //回傳目前伺服器時間
    });
});

export default router;