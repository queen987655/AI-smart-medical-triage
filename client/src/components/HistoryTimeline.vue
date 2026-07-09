<!-- AI 預診歷史時間軸 -->
<!-- 顯示病人的 AI 預診歷史紀錄，每一筆資料皆來自 FHIR Observation Resource。 -->
<script setup>
// DoctorView 傳入的 Observation Bundle
defineProps({observations: {
    type: Array,                 // 陣列型態
    default: () => []            // 預設空陣列
}
});

function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// 根據 Urgency Score，回傳不同的 CSS Class
const getRisk = (score) => {
    if(score >=8){return "critical";}
    if(score >=5){return "warning";}
    return "normal";
}
// 根據 Score，顯示不同風險等級
const getRiskText = (score) => {
    if(score >=8){return "Critical";}
    if(score >=5){return "Warning";}
    return "Normal";
}
</script>

<template>
    <section class="timeline">
        <h3>AI 分析歷史</h3>
        <p v-if="!observations.length" class="empty">目前沒有 AI 分析紀錄</p>
        <article v-for="item in observations" :key="item.resource?.id" class="timeline-card">
            <div class="timeline-header">
                <span class="risk-badge" :class="getRisk(item.resource?.valueQuantity?.value)">{{ getRiskText(item.resource?.valueQuantity?.value) }}</span>
                <time>{{ formatDate(item.resource?.effectiveDateTime) }}</time>
            </div>
            <p class="score">
                Urgency：{{ item.resource?.valueQuantity?.value ?? "-" }}
            </p>
            <div class="summary">{{ item.resource?.note?.[0]?.text || "-" }}</div>
        </article>
    </section>
</template>

<style scoped>
.timeline {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}
h3 {
    margin: 0 0 18px;
}
.empty {
    color: #94a3b8;
}
/* 每一筆 Observation */
.timeline-card {
    padding: 18px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    margin-bottom: 14px;
}
.timeline-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
}
.risk-badge {
    padding: 6px 12px;
    border-radius: 999px;
    color: white;
    font-weight: 800;
    font-size: 13px;
}
.critical {
    background: #dc2626;
}
.warning {
    background: #f59e0b;
}
.normal {
    background: #16a34a;
}
time {
    color: #64748b;
    font-size: 14px;
}
.score {
    font-weight: 800;
}
.summary {
    margin-top: 10px;
    padding: 14px;
    background: white;
    border-radius: 12px;
    line-height: 1.7;
}
</style>