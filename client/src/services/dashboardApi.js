//Dashboard API Service
//負責 Dashboard 頁面與 Express Backend之間的 API 通訊
import axios from "axios";

//建立 Dashboard API 共用的 Axios Client。若未來後端網址變更，僅需修改 baseURL
const api = axios.create({baseURL: "http://localhost:3000"});

//取得 Dashboard 統計資料
export async function getStatistics(){
    const response = await api.get("/api/dashboard/statistics");              //呼叫 Dashboard API
    return response.data;                                                     //回傳統計資料
}