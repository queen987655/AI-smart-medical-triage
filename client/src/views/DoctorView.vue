<!-- 醫師 EHR 模擬器主畫面 -->
<!-- 醫師輸入 FHIR Patient ID，呼叫 useDoctorRecord() 載入完整病歷資料，顯示 Patient 基本資料、Encounter 就診資料、AI 預診 Observation 歷史紀錄 、CDS Hooks 高風險警示卡片，醫師可接受或忽略 AI 建議。 -->
<script setup>
import { ref } from "vue";
import { useDoctorRecord }from "../composables/useDoctorRecord";      //匯入醫師端病歷資料讀取邏輯

import PatientCard from "../components/PatientCard.vue";
import EncounterCard from "../components/EncounterCard.vue";
import HistoryTimeline from "../components/HistoryTimeline.vue";
import CDSAlert from "../components/CDSAlert.vue";
import { acceptAI } from "../services/encounterApi";

// 從 useDoctorRecord composable 取得醫師端需要的資料與方法
const {patient, encounter, observations, cards, loading, error, loadRecord} = useDoctorRecord();
const patientId = ref("");

// 開啟病歷
// 使用醫師輸入的 patientId，呼叫 loadRecord()，後續由 useDoctorRecord 負責載入 Patient、Encounter、Observation History 與 CDS Hooks Cards。
async function openRecord() {await loadRecord(patientId.value);}
async function acceptSuggestion(card) {
    if (!card) return;
    // 接受 AI 建議，當醫師點擊 CDSAlert 中的「接受建議」按鈕時觸發，會將醫師接受 AI 建議的結果送到後端 API
    await acceptAI({
        patientId: patientId.value,
        accepted: true,
        summary: card.summary,
        detail: card.detail
    });
}
// 忽略 AI 建議，當醫師點擊 CDSAlert 元件中的「忽略」按鈕時觸發，目前做法是直接將該張 CDS card 從畫面移除
function dismissSuggestion(card) {
    if (!card) return;
    cards.value = cards.value.filter(c => c.summary !== card.summary);
}
</script>

<template>
    <main class="doctor-page">
        <!-- 頁首搜尋區：輸入 Patient ID 並開啟病歷 -->
        <section class="ehr-header">
            <div>
                <p class="eyebrow">Doctor EHR</p>
                <h1>醫師 EHR 模擬器</h1>
                <p class="subtitle">輸入 FHIR Patient ID，查看 AI 預診紀錄與 CDS 警示。</p>
            </div>
            <!-- Patient ID 查詢區 -->
            <div class="search-box">
                <label>FHIR Patient ID</label>
                <div class="search-row">
                    <input v-model="patientId" placeholder="例如：137060802" />
                    <!-- loading 或未輸入 patientId 時，按鈕不可使用 -->
                    <button @click="openRecord" :disabled="loading || !patientId">{{ loading ? "讀取中..." : "開啟病歷" }}</button>
                </div>
            </div>
        </section>
        <p v-if="error" class="error-message">{{ error }}</p>
        <!-- EHR 主要內容區：左側病歷、右側 CDS 警示 -->
        <section class="ehr-layout">
            <!-- 左側：病人資料、Encounter、AI Observation History -->
            <div class="left-panel">
                <PatientCard :patient="patient" />
                <EncounterCard :encounter="encounter" />
                <HistoryTimeline :observations="observations" />
            </div>
            <!-- 右側：CDS Hooks 警示卡 -->
            <aside class="right-panel">
                <CDSAlert :cards="cards" @accept="acceptSuggestion" @dismiss="dismissSuggestion"/>
            </aside>
        </section>
    </main>
</template>

<style scoped>
.doctor-page {
    min-height: 100vh;
    padding: 40px 24px;
    background: linear-gradient(135deg, #f8fafc, #eef6ff);
    color: #1f2937;
}
.ehr-header {
    max-width: 1180px;
    margin: 0 auto 24px;
    padding: 28px;
    background: white;
    border-radius: 22px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: center;
}
.eyebrow {
    color: #2563eb;
    font-weight: 800;
    margin: 0 0 8px;
}
h1 {
    margin: 0;
    font-size: 34px;
}
.subtitle {
    color: #64748b;
    margin-top: 12px;
}
.search-box {
    min-width: 360px;
}
.search-box label {
    display: block;
    font-weight: 700;
    margin-bottom: 8px;
}
.search-row {
    display: flex;
    gap: 10px;
}
input {
    flex: 1;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    font-size: 15px;
}

/* 輸入框 focus 效果 */
input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
button {
    border: none;
    border-radius: 999px;
    padding: 12px 18px;
    background: #2563eb;
    color: white;
    font-weight: 800;
    cursor: pointer;
}
button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
}
.error-message {
    max-width: 1180px;
    margin: 0 auto 20px;
    padding: 14px 18px;
    border-radius: 14px;
    background: #fee2e2;
    color: #b91c1c;
    font-weight: 700;
}
.ehr-layout {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
    gap: 24px;
    align-items: start;
}
.left-panel,
.right-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
/* 右側 CDS 警示固定在畫面上方，方便醫師查看 */ 
.right-panel {
    position: sticky;
    top: 24px;
}
/* RWD：小螢幕時改為單欄顯示 */
@media (max-width: 900px) {
    .ehr-header {
        flex-direction: column;
        align-items: stretch;
    }
    .search-box {
        min-width: 0;
    }
    .ehr-layout {
        grid-template-columns: 1fr;
    }
    .right-panel {
        position: static;
    }
}
</style>