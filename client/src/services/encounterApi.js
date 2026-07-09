//Encounter API Service
//負責醫師端 (Doctor EHR)與 Express Backend 的 Encounter API 通訊
//當醫師閱讀 AI 預診結果後，可選擇接受或忽略 AI 建議，本 Service 負責將醫師的決策送至後端
import axios from "axios";

const api = axios.create({baseURL: "http://localhost:3000"});

//將醫師對 AI 建議的決策送至後端
export async function acceptAI(data){
    return api.post("/api/encounter/accept-ai", data);
}