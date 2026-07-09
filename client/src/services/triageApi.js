//AI 預診 API Service
//負責病人端與 Express 後端之間的 API 溝通。病人於 PatientView 輸入主訴後，會透過本 Service 呼叫後端 AI 預診 API
import axios from "axios";             //建立 Axios 共用物件

const api = axios.create({baseURL: "http://localhost:3000"});

//將病人的主訴送至後端 AI 預診服務
export function analyzeComplaint(patientId, complaint) {
    return api.post("/api/triage/analyze", {patientId, complaint});
}