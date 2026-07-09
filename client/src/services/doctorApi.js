//Doctor EHR API Service
//負責醫師端 (Doctor EHR) 與 Express Backend 的 API 通訊
import axios from "axios";

const api = axios.create({baseURL: "http://localhost:3000"});

//根據 FHIR Patient ID，取得病人的基本資料
export async function getPatient(patientId) {const response = await api.get(`/api/patient/${patientId}`);
return response.data;
}
//取得病人的 AI 預診歷史紀錄
export async function getObservationHistory(patientId) {const response = await api.get(`/api/patient/${patientId}/observations`);
return response.data;
}
//取得病人最近一次就診資訊
export async function getEncounter(patientId) {
    const response = await api.get(`/api/patient/${patientId}/encounter`);
    return response.data;
}
//呼叫 CDS Hooks Service，根據病人的最新 Observation，回傳 AI 臨床決策建議
export async function getCDSCard(patientId) {
    const response = await api.post("/api/cds-services/patient-triage-check",{
        context: {
            patientId
        }
    }
);
return response.data;
}