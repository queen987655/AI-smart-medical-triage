<!-- AI Dashboard -->
<!-- 顯示 AI 預診統計資訊 -->
<script setup>
import { ref, onMounted } from "vue";
import { getStatistics } from "../services/dashboardApi";

const statistics = ref(null);                                     //Dashboard 統計資料
onMounted(async() => {statistics.value = await getStatistics();   //頁面載入完成，自動取得 Dashboard 統計。
});
</script>

<template>
    <main class="dashboard">
        <h1>AI Dashboard</h1>
        <div v-if="!statistics" class="loading">Loading...</div>
        <section v-else class="cards">
            <div class="card">
                <h3>今日分析</h3>
                <strong>{{ statistics.today }}</strong>
            </div>
            <div class="card">
                <h3>高風險</h3>
                <strong>{{ statistics.critical }}</strong>
            </div>
            <div class="card">
                <h3>中風險</h3>
                <strong>{{ statistics.warning }}</strong>
            </div>
            <div class="card">
                <h3>低風險</h3>
                <strong>{{ statistics.normal }}</strong>
            </div>
            <div class="card">
                <h3>建議急診</h3>
                <strong>{{ statistics.emergency }}</strong>
            </div>
        </section>
    </main>
</template>

<style scoped>
.dashboard{
    max-width:1200px;
    margin:auto;
    padding:40px;
}
.loading{
    font-size:20px;
    color:#64748b;
}
.cards{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:20px;
    margin-top:30px;
}
.card{
    background:white;
    padding:25px;
    border-radius:20px;
    box-shadow:0 10px 25px rgba(0,0,0,.08);
    text-align:center;
}
.card h3{
    margin-bottom:15px;
    color:#64748b;
}
.card strong{
    font-size:40px;
    color:#2563eb;
}
</style>