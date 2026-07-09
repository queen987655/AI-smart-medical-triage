<!-- 顯示 FHIR Patient Resource 的基本資料 -->
<script setup>
// 定義元件 Props patient：從 DoctorView 傳入的 FHIR Patient Resource，若尚未取得病人資料，預設為 null
defineProps({
    patient: {
        type: Object,              // Props 型別為 Object
        default: null              // 預設沒有病人資料
    } 
});
</script>

<template>
    <section class="patient-card">
        <h3>病人資料</h3>
        <div v-if="patient" class="info-grid">
            <div>
                <span>病人 ID</span>
                <strong>{{ patient.id }}</strong>
            </div>
            <div>
                <span>姓名</span>
                <strong>{{ patient.name?.[0]?.text || "-" }}</strong>
            </div>
            <div>
                <span>性別</span>
                <strong>{{ patient.gender || "-" }}</strong>
            </div>
            <div>
                <span>出生</span>
                <strong>{{ patient.birthDate || "-" }}</strong>
            </div>
        </div>
        <p v-else class="empty">尚未載入病人資料</p>
    </section>
</template>

<style scoped>
.patient-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}
h3 {
    margin: 0 0 18px;
}
.info-grid {
    display: grid;
    /* 一列兩欄 */
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
}
/* 每一筆病人資訊 */
.info-grid div {
    background: #f8fafc;
    border-radius: 14px;
    padding: 16px;
    border: 1px solid #e2e8f0;
}
/* 欄位名稱 */
span {
    display: block;
    color: #64748b;
    font-size: 13px;
    margin-bottom: 6px;
}
/* 欄位內容 */
strong {
    color: #0f172a;
}
.empty {
    color: #94a3b8;
}
</style>