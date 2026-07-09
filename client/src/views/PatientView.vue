<!-- 病人資料建立、AI 主訴分析、FHIR Observation 結果顯示 -->
<script setup>
import { ref, onMounted } from "vue";                              // 匯入 Vue 的 ref，用來建立可響應式資料
import { analyzeComplaint } from "../services/triageApi";          // 匯入病人主訴 AI 分析 API
import { createPatient } from "../services/patientApi";            // 匯入建立 / 查詢 Patient 的 API

const complaint = ref("");                         //病人輸入的主訴內容
const result = ref(null);                          // 儲存 AI 分析完成後的結果
const loading = ref(false);                        // 控制「AI 分析中」的 loading 狀態
const error = ref("");                             // 儲存錯誤訊息
const patientId = ref("");                         // 儲存 HAPI FHIR 真正回傳的 Patient Resource ID
const patientIdentifier = ref("");                 // 使用者輸入的病人識別碼，例如身分證或病歷號
const patientName = ref("");                       // 使用者輸入的病人姓名 
const patientGender = ref("male");                 // 使用者選擇的性別，預設為 male
const patientBirthDate = ref("");                  // 使用者輸入的生日
const patientReady = ref(false);                   // 判斷病人是否已成功建立或載入
const observationId = ref("");                     // 儲存 AI 分析結果寫入 FHIR 後產生的 Observation ID


// 建立或載入病人資料，後端會先用 identifier 查詢是否已有 Patient
const registerPatient = async () => {
  error.value = "";
  try {
    const response = await createPatient({
      identifier: patientIdentifier.value,
      name: patientName.value || "測試病人",
      gender: patientGender.value,
      birthDate: patientBirthDate.value || "1990-01-01"
    });
    patientId.value = response.data.id;            // 儲存 HAPI FHIR 回傳的真正 Patient ID
    patientReady.value = true;                     // 標記病人已建立完成，AI 分析按鈕才可使用
  } catch (err) {
    error.value = "建立或載入病人失敗";
    console.error(err);
  }
};

// 送出病人主訴，呼叫後端 AI 預診 API
// 後端流程：呼叫 Gemini 分析主訴，將 AI 結果轉為 FHIR Observation，寫入 HAPI FHIR，回傳分析結果與 Observation 資訊
const submitComplaint = async () => {
  if (!patientReady.value) {                 // 若尚未建立病人，不允許進行 AI 分析
    error.value = "請先建立病人資料";
    return; 
  }
    loading.value = true;
    error.value = "";
    try {
        if (!patientId.value) {error.value = "病人尚未建立完成";                  // 再次確認是否已有真正的 FHIR Patient ID
        return;
        }
        const response = await analyzeComplaint(patientId.value, complaint.value);
        result.value = response.data.analysis;                                   // 儲存 AI 分析結果
        // Transaction Bundle 回傳時，Observation ID 可能在不同位置，因此做防呆處理
        observationId.value = response.data.observation?.id || response.data.observation?.entry?.[0]?.response?.location || "";
    }catch (err) {
        error.value = "AI分析失敗";
        console.error(err);
    }finally {
        loading.value = false;
    }
};
</script>


<template>
    <main class="patient-page">
        <!-- 頁面標題區 -->
        <section class="hero-card">                      
            <div>
                <p class="eyebrow">AI Triage System</p>
                <h1>病人 AI 預診</h1>
                <p class="subtitle">請描述目前不舒服的症狀，系統會進行 AI 初步分流並寫入 FHIR。</p>
            </div>
            <!-- 顯示目前使用中的 FHIR Patient ID -->
            <div class="patient-id-box">
                <span>FHIR Patient ID</span>
                <strong v-if="patientId">{{ patientId }}</strong>
                <strong v-else>建立中...</strong>
            </div>
        </section>
        <!-- 病人資料輸入區 -->
        <section class="patient-form-card">
          <div class="form-header">
            <div>
              <p class="step-label"></p>
              <h2>建立 / 載入病人資料</h2>
              <p>請輸入病人識別資料，系統會自動查詢或建立 FHIR Patient。</p>
            </div>
            <div class="form-icon">👤</div>
          </div>
          <div class="form-grid">
            <div class="form-field full">
              <label>病人識別碼 / 身分證 / 病歷號</label>
              <input v-model="patientIdentifier" placeholder="例如：A123456789 或 P001"/>
            </div>
            <div class="form-field">
              <label>姓名</label>
              <input v-model="patientName" placeholder="例如：王小明"/>
            </div>
            <div class="form-field">
              <label>性別</label>
              <select v-model="patientGender">
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="unknown">未知</option>
              </select>
            </div>
            <div class="form-field">
              <label>生日</label>
              <input type="date" v-model="patientBirthDate"/>
            </div>
          </div>
          <!-- 沒有輸入病人識別碼時，按鈕不可使用 -->
          <button class="create-patient-btn" @click="registerPatient" :disabled="!patientIdentifier">建立 / 載入病人</button>
            <!-- 病人建立成功後顯示 -->
          <div v-if="patientReady" class="success-box">
            <strong>✅ 病人已就緒</strong>
            <p>FHIR Patient ID：{{ patientId }}</p>
          </div>
        </section>
          <!-- 主訴輸入區 -->
        <section class="input-card">
            <label>請描述目前症狀</label>
            <textarea v-model="complaint" rows="6" placeholder="例如：我胸口很痛、呼吸困難、冒冷汗"/>
            <!-- 必須有 patientId 與 complaint 才能按下 AI 分析 -->
            <button @click="submitComplaint" :disabled="loading || !patientId || !complaint">{{ loading ? "AI 分析中..." : "開始 AI 分析" }}</button>
            <p v-if="!patientReady" class="hint">請先建立病人資料後才能開始 AI 預診</p>
            <p v-if="error" class="error-message">{{ error }}</p>
        </section>
         <!-- AI 分析結果區 -->
        <section v-if="result" class="result-card" :class="result.urgency_score >= 5 ? 'danger' : 'normal'">
            <div class="result-header">
                <h2>{{ result.urgency_score >= 5 ? "🚨 高風險預警" : "✅ 初步低風險" }}</h2>
                <div class="score-badge">{{ result.urgency_score }}</div>
            </div>
            <div class="result-grid">
                <div>
                    <span>情緒分析</span>
                    <strong>{{ result.emotion }}</strong>
                </div>
                <div>
                    <span>分流等級</span>
                    <strong>{{ result.triage_level || "-" }}</strong>
                </div>
                <div>
                    <span>建議科別</span>
                    <strong>{{ result.recommended_department || "-" }}</strong>
                </div>
                <div>
                    <span>Observation</span>
                    <strong>{{ observationId || "-" }}</strong>
                </div>
            </div>
            <div class="summary-box">
                <span>AI 摘要</span>
                <p>{{ result.summary }}</p>
            </div>
            <div class="analysis-status">🤖 AI 分析完成，結果已寫入 FHIR Observation。</div>
        </section>
    </main>
</template>

<style scoped>
/*  Base / Theme */
.patient-page {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --danger: #dc2626;
  --success: #16a34a;
  --success-bg: #ecfdf5;
  --text-main: #0f172a;
  --text-soft: #64748b;
  --border: #e2e8f0;
  --card-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  min-height: 100vh;
  padding: 48px 20px;
  color: var(--text-main);
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 32%),
    linear-gradient(135deg, #f4f8ff, #eef6f4);
}
/* Shared Card */
.hero-card,
.patient-form-card,
.input-card,
.result-card {
  max-width: 900px;
  margin: 0 auto 24px;
  padding: 30px;
  background: #ffffff;
  border-radius: 22px;
  box-shadow: var(--card-shadow);
}
/* Hero*/
.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}
.eyebrow,
.step-label {
  margin: 0 0 8px;
  color: var(--primary);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.2;
}
.subtitle,
.form-header p {
  margin-top: 12px;
  color: var(--text-soft);
  line-height: 1.7;
}
.patient-id-box {
  min-width: 230px;
  padding: 18px;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 18px;
}
.patient-id-box span,
.result-grid span,
.summary-box span {
  display: block;
  margin-bottom: 6px;
  color: var(--text-soft);
  font-size: 14px;
}
.patient-id-box strong {
  font-size: 20px;
  color: var(--text-main);
  word-break: break-all;
}
/*Patient Form*/
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}
.form-header h2 {
  margin: 0;
  font-size: 26px;
}
.form-icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 18px;
  background: #eff6ff;
  font-size: 30px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-field.full {
  grid-column: 1 / -1;
}
.form-field label,
.input-card label {
  font-weight: 800;
  color: #334155;
}
/* Inputs*/
input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #ffffff;
  color: var(--text-main);
  font-size: 15px;
}
textarea {
  min-height: 150px;
  resize: vertical;
  line-height: 1.7;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
/* Buttons */
button {
  border: none;
  border-radius: 999px;
  padding: 13px 22px;
  background: var(--primary);
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
  transition: 0.18s ease;
}
button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--primary-dark);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.24);
}
button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}
.create-patient-btn {
  width: 100%;
  margin-top: 22px;
}
.input-card button {
  margin-top: 16px;
}
/* Status Messages*/
.success-box {
  margin-top: 18px;
  padding: 16px 18px;
  border-left: 6px solid #10b981;
  border-radius: 14px;
  background: var(--success-bg);
  color: #065f46;
}
.success-box p {
  margin: 8px 0 0;
  word-break: break-all;
}
.hint {
  margin-top: 12px;
  color: var(--danger);
  font-size: 14px;
  font-weight: 800;
}
.error-message {
  margin-top: 14px;
  color: var(--danger);
  font-weight: 800;
}
.analysis-status {
  margin-bottom: 20px;
  padding: 15px;
  border-left: 6px solid var(--primary);
  border-radius: 10px;
  background: #eff6ff;
  color: var(--primary-dark);
  font-weight: 800;
}
/* Result Card */
.result-card.danger {
  border-left: 8px solid var(--danger);
  background: #fff7f7;
}
.result-card.normal {
  border-left: 8px solid var(--success);
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.result-header h2 {
  margin: 0;
}
.score-badge {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--danger);
  color: #ffffff;
  font-size: 32px;
  font-weight: 900;
}
.result-card.normal .score-badge {
  background: var(--success);
}
.result-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
}
.result-grid div,
.summary-box {
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}
.result-grid strong {
  display: block;
  color: var(--text-main);
  word-break: break-all;
}
.summary-box {
  margin-top: 20px;
}
.summary-box p {
  margin: 0;
  line-height: 1.8;
}
/* Responsive手機與小螢幕顯示調整 */
@media (max-width: 768px) {
  .patient-page {
    padding: 28px 14px;
  }
  .hero-card,
  .form-header {
    flex-direction: column;
    align-items: stretch;
  }
  h1 {
    font-size: 32px;
  }
  .form-grid,
  .result-grid {
    grid-template-columns: 1fr;
  }
  .result-header {
    align-items: flex-start;
  }
}
</style>