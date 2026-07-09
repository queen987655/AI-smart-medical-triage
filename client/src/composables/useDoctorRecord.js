// 醫師端病歷資料管理
// 集中管理醫師端 EHR 所需的資料，並提供載入病歷的方法，讓 DoctorView 可以快速取得Patient、Encounter、Observation 及 CDS Hooks 資訊
import { ref } from "vue";
import {getPatient, getEncounter, getObservationHistory, getCDSCard} from "../services/doctorApi";          // 匯入醫師端 API

export function useDoctorRecord() {
    const patient=ref(null);
    const encounter=ref(null);
    const observations=ref([]);                          //FHIR Observation Bundle，儲存病人的 AI 預診歷史紀錄。
    const cards=ref([]);                                 // CDS Hooks Cards，儲存 CDS Hooks 回傳的警示卡片。
    const loading=ref(false);                            //是否正在讀取病歷
    const error=ref("");
    
    // 載入完整病歷，根據 FHIR Patient ID，一次取得醫師端所需的所有資料。
    async function loadRecord(patientId){loading.value=true;error.value="";      // loading.value=true ： 顯示 Loading 狀態    // error.value="" : 清除上一筆錯誤
        try {
            console.log("載入 Patient");              //讀取 Patient Resource
            patient.value = await getPatient(patientId);
            
            console.log("載入 Observations");         //讀取 Observation Timeline
            const historyData = await getObservationHistory(patientId);
            observations.value = historyData.entry || [];
            
            console.log("載入 Encounter");            //讀取 Encounter
            encounter.value = await getEncounter(patientId);
            
            console.log("載入 CDS");                  //呼叫 CDS Hooks
            const cdsData = await getCDSCard(patientId);
            cards.value = cdsData.cards || [];
        } catch (err) {                               //API 發生錯誤
            console.error("讀取病歷失敗：", err);
            console.error("Response：", err.response?.data);
            error.value = err.response?.data?.message || "讀取病歷失敗";
        } finally {
            loading.value = false;                    //無論成功或失敗，都關閉 Loading
        }
    }
    return {patient, encounter, observations, cards, loading,error, loadRecord};          //回傳給 DoctorView 使用
}