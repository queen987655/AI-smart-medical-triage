//FHIR Service，負責與 HAPI FHIR Server 溝通，是後端所有 FHIR 資料寫入與查詢的核心
import axios from "axios";
import dotenv from "dotenv";
import {buildObservation, buildEncounter, buildProvenance, buildBundle} from "../builders/index.js";

dotenv.config();     // 載入 .env 環境變數，例如 FHIR_BASE_URL

//建立 FHIR Axios Instance
const fhir = axios.create({
    baseURL: process.env.FHIR_BASE_URL,
    headers: {"Content-Type": "application/fhir+json",},      //傳送與接收的資料格式為 FHIR JSON
});

//儲存 AI 預診結果: 將 AI 分析結果轉換成多個 FHIR Resource，並透過 Transaction Bundle 一次寫入 HAPI FHIR Server
export async function saveAITriage(patientId, aiResult) {
    const observation = buildObservation({patientId, aiResult});              //AI 分析結果與 urgency_score
    const encounter = buildEncounter(patientId);              //本次 AI 預診事件
    const provenance = buildProvenance();                     //紀錄資料來源為 Google Gemini
    const bundle = buildBundle([observation, encounter, provenance]);         //將多個 Resource 包裝成 Transaction Bundle
    const response = await fhir.post("/", bundle);                            // 將 Bundle POST 到 FHIR Server
    return response.data;
}

//取得病人最新 AI Observation: 查詢指定病人最新一筆 AI 預診 Observation。
export async function getLatestObservation(patientId) {
    const response = await fhir.get(`/Observation?patient=${patientId}&code=80615-8&_sort=-date&_count=1`);
    if (!response.data.entry) {
        return null;                       // 若查無資料，回傳 null
    }
    return response.data.entry[0].resource;           //回傳最新一筆 Observation
}

//取得病人 AI Observation 歷史紀錄: 查詢指定病人的所有 AI 預診 Observation，並依日期由新到舊排序
export async function getObservationHistory(patientId) {
    const response = await fhir.get(`/Observation?patient=${patientId}&code=80615-8&_sort=-date`);
    return response.data;
}