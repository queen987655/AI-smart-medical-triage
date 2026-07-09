//Patient API Service
//病人於 PatientView 輸入基本資料後，透過本 Service 呼叫後端建立或查詢 FHIR Patient Resource
import axios from "axios";

const api = axios.create({baseURL: "http://localhost:3000"});

//將病人基本資料送至後端
// 後端會先依據 identifier 查詢：若病人已存在→ 回傳既有 Patient；若病人不存在 → 建立新的 Patient Resource
export function createPatient(data) {return api.post("/api/patient", data);}    