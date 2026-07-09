<!-- 顯示病人最近一次的就診資訊（FHIR Encounter Resource） -->
<!-- Encounter 在 FHIR 中代表一次醫療服務或就診事件，可用於記錄病人的門診、急診、住院等資訊 -->
<script setup>
// 接收 DoctorView 傳入的 Encounter Resource
defineProps({
    encounter: {
        type: Object,
        default: null
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
</script>

<template>
    <section class="encounter-card">
        <div class="card-header">
            <div>
                <h3>最近一次就診</h3>
                <p>Encounter</p>
            </div>
            <span v-if="encounter" class="status-badge">{{ encounter.status }}</span>
        </div>
        <div v-if="encounter" class="info-grid">
            <div>
                <span>Encounter ID</span>
                <strong>{{ encounter.id || "-" }}</strong>
            </div>
            <div>
                <span>就診類型</span>
                <strong>{{ encounter.class?.display || encounter.class?.code || "-" }}</strong>
            </div>
            <div>
                <span>開始時間</span>
                <strong>{{ formatDate(encounter.period?.start) }}</strong>
            </div>
            <div>
                <span>病人參照</span>
                <strong>{{ encounter.subject?.reference || "-" }}</strong>
            </div>
        </div>
        <p v-else class="empty">尚未載入 Encounter 資料</p>
    </section>
</template>

<style scoped>
.encounter-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
    border-left: 8px solid #2563eb;
}
.card-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 18px;
}
h3 {
    margin: 0;
}
.card-header p {
    margin: 6px 0 0;
    color: #64748b;
    font-size: 14px;
}
.status-badge {
    padding: 6px 12px;
    border-radius: 999px;
    background: #dbeafe;
    color: #1d4ed8;
    font-weight: 800;
    font-size: 13px;
}
.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
}

.info-grid div {
    background: #f8fafc;
    border-radius: 14px;
    padding: 16px;
    border: 1px solid #e2e8f0;
}
span {
    display: block;
    color: #64748b;
    font-size: 13px;
    margin-bottom: 6px;
}
strong {
    color: #0f172a;
    word-break: break-all;
}
.empty {
    color: #94a3b8;
}
@media (max-width: 700px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
}
</style>