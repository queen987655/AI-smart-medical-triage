//Patient API Router，負責處理與 FHIR Patient 相關的 API
import express from "express";
import axios from "axios";

const router = express.Router();
const BASE = process.env.FHIR_BASE_URL;

// 建立或載入 Patient，避免重複建立同一位病人
router.post("/", async (req, res) => {
    try {
        const identifier = req.body.identifier || "A123456789";
        // 1. 依 identifier 查詢 Patient 是否已存在
        const searchResponse = await axios.get(`${BASE}/Patient`, {
            params: {
                identifier: `https://www.mohw.gov.tw|${identifier}`
            }
        });
        // 2.若已存在，直接回傳既有 Patient
        const existingPatient = searchResponse.data.entry?.[0]?.resource;
        if (existingPatient) {
            return res.json(existingPatient);
        }
        // 3.若不存在，建立新的 Patient Resource
        const patient = {
            resourceType: "Patient",
            identifier: [
                {
                    system: "https://www.mohw.gov.tw",
                    value: identifier
                }
            ],
            active: true,
            name: [
                {
                    use: "official",
                    text: req.body.name || "測試病人"
                }
            ],
            gender: req.body.gender || "male",
            birthDate: req.body.birthDate || "1990-01-01"
        };
        const response = await axios.post(`${BASE}/Patient`, patient,
            {
                headers: {
                    "Content-Type": "application/fhir+json"
                }
            }
        );
        res.json(response.data);
    } catch (err) {
        console.error("建立或查詢 Patient 失敗");
        console.error(err.response?.data || err.message);
        res.status(500).json({
            message: "建立或查詢 Patient 失敗",
            error: err.response?.data || err.message
        });
    }
});

//依照 FHIR Patient ID 查詢 Patient Resourc
router.get("/:id", async (req, res) => {
    try{
        const result = await axios.get(`${BASE}/Patient/${req.params.id}`);
        res.json(result.data);
    }catch(err){
        res.status(500).json({
            message:"Patient取得失敗"
        });
    }
});

//查詢病人的 AI 預診 Observation 歷史紀錄
router.get("/:id/observations", async (req,res) => {
    const response=await axios.get(`${BASE}/Observation?patient=${req.params.id}&code=80615-8&_sort=-date`);
    res.json(response.data);
});

//查詢病人最近一次 Encounter
router.get("/:id/encounter", async (req,res) => {
    const response=await axios.get(`${BASE}/Encounter?patient=${req.params.id}&_sort=-date&_count=1`);                    //_sort = -date，依日期倒序排序
    if(response.data.entry){
        res.json(response.data.entry[0].resource);
    }else{
        res.json(null);
    }
});

export default router;