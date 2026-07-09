<!-- CDS Hooks 臨床決策支援警示元件 -->
<!-- 顯示 CDS Hooks 回傳的警示卡片 (Card)，提供醫師查看 AI 預診結果，並可選擇接受或忽略 AI 建議。 -->
<script setup>
// 接收 DoctorView 傳入的 CDS Hooks Cards。CDS Hooks API 回傳的警示卡片陣列。若沒有任何警示，預設為空陣列。
defineProps({cards: {
    type: Array,
    default: () => []
    }
});

// 定義元件可向父元件發出的事件
const emit = defineEmits(["accept", "dismiss"]);

function acceptCard(card){emit("accept", card);}           //接受 AI 建議: 將目前的 CDS Card 傳回 DoctorView，再由 DoctorView 呼叫後端 API 紀錄醫師決策
function dismissCard(card){emit("dismiss", card);}         //忽略 AI 建議:將目前的 CDS Card 傳回 DoctorView，DoctorView 可選擇將卡片移除，或通知後端紀錄醫師忽略此建議

</script>

<template>
    <section class="cds-panel">
        <h3>CDS Hooks 警示</h3>
        <p v-if="!cards.length" class="empty">目前沒有高風險提醒</p>
        <article v-for="card in cards" :key="card.summary" class="cds-card">
            <div class="alert-icon">🚨</div>
            <div>
                <h4>{{ card.summary }}</h4>
                <p class="detail">{{ card.detail }}</p>
                <div class="actions">
                    <button class="accept" @click="acceptCard(card)">接受建議</button>
                    <button class="dismiss" @click="dismissCard(card)">忽略</button>
                </div>
            </div>
        </article>
    </section>
</template>

<style scoped>
.cds-panel {
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
.cds-card {
    display: flex;
    gap: 16px;
    padding: 18px;
    border-radius: 18px;
    background: #fff1f2;
    border-left: 8px solid #dc2626;
}
.alert-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: white;
    font-size: 24px;
}
h4 {
    margin: 0 0 10px;
}
.detail {
    white-space: pre-line;
    line-height: 1.7;
    color: #374151;
}
.actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
}
button {
    border: none;
    border-radius: 999px;
    padding: 10px 14px;
    font-weight: 800;
    cursor: pointer;
}
.accept {
    background: #dc2626;
    color: white;
}
.dismiss {
    background: white;
    color: #64748b;
    border: 1px solid #cbd5e1;
}
</style>