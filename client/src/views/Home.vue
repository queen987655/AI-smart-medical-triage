<!-- AI Medical Triage System 首頁 -->
<!-- 作為整個系統的入口首頁，顯示系統介紹，提供病人端與醫師端入口，檢查 Express Server 是否正常運作 -->
<script setup>
import { ref, onMounted } from "vue";

// Server 狀態，用來儲存後端健康檢查 API 回傳結果
const serverStatus = ref("");

// 當首頁載入時，呼叫後端 Health Check API，驗證 Express Server 是否正常，更新首頁狀態
onMounted(async () => {
    try {
        const response = await fetch("http://localhost:3000/api/health");
        const data = await response.json();
        serverStatus.value = data.message;
    } catch (err) {
        serverStatus.value = "Server 無法連線";
    }
    });
</script>

<template>
    <main class="home-page">
        <section class="hero">
            <div class="hero-content">
                <p class="eyebrow">AI Triage System</p>
                <h1>智慧醫療預診系統</h1>
                <p class="subtitle">結合 Google Gemini、FHIR Observation 與 CDS Hooks，協助病人完成初步預診，並讓醫師快速掌握高風險警示。</p>
                <div class="action-group">
                    <RouterLink to="/patient" class="action-card patient">
                        <span class="icon">🧑‍⚕️</span>
                        <div>
                            <h2>病人端</h2>
                            <p>輸入主訴，進行 AI 預診分析。</p>
                        </div>
                    </RouterLink>
                    <RouterLink to="/doctor" class="action-card doctor">
                        <span class="icon">🏥</span>
                        <div>
                            <h2>醫師端</h2>
                            <p>查看病歷、AI 分析歷史與 CDS 警示。</p>
                        </div>
                    </RouterLink>
                    <RouterLink to="/dashboard" class="action-card">
                        <span class="icon">📊</span>
                        <div>
                            <h2>Dashboard</h2>
                            <p>查看 AI 預診統計資料。</p>
                        </div>
                    </RouterLink>
                </div>
            </div>
            <div class="hero-panel">
                <div class="status-card danger">
                    <span>Urgency Score</span>
                    <strong>9</strong>
                    <p>高風險胸痛警示</p>
                </div>
                <div class="status-card">
                    <span>FHIR Resource</span>
                    <strong>Observation</strong>
                    <p>AI 分析結果已標準化儲存</p>
                </div>
                <div class="status-card">
                    <span>CDS Hooks</span>
                    <strong>Alert Card</strong>
                    <p>醫師端即時提醒</p>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
.home-page {
    min-height: 100vh;
    padding: 48px 24px;
    background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 32%),
    linear-gradient(135deg, #f8fafc, #eef6ff);
    color: #0f172a;
}
/* Hero Layout 左右雙欄排版 */
.hero {
    max-width: 1180px;
    min-height: calc(100vh - 96px);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.4fr 0.9fr;
    gap: 36px;
    align-items: center;
}
.hero-content {
    background: white;
    border-radius: 28px;
    padding: 44px;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.1);
}
.eyebrow {
    margin: 0 0 12px;
    color: #2563eb;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}
h1 {
    margin: 0;
    font-size: 48px;
    line-height: 1.15;
}
.subtitle {
    max-width: 680px;
    margin-top: 18px;
    color: #64748b;
    font-size: 18px;
    line-height: 1.8;
}
.action-group {
    margin-top: 36px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
}
.action-card {
    text-decoration: none;
    color: inherit;
    border-radius: 22px;
    padding: 22px;
    display: flex;
    gap: 18px;
    align-items: flex-start;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    transition: 0.2s ease;
}
.action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
    border-color: #93c5fd;
}
.icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    font-size: 28px;
    background: white;
}
.action-card h2 {
    margin: 0 0 8px;
    font-size: 22px;
}
.action-card p {
    margin: 0;
    color: #64748b;
    line-height: 1.6;
}
.hero-panel {
    display: flex;
    flex-direction: column;
    gap: 18px;
}
.status-card {
    background: white;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
    border-left: 8px solid #2563eb;
}
.status-card.danger {
    border-left-color: #dc2626;
    background: #fff7f7;
}
.status-card span {
    color: #64748b;
    font-weight: 700;
}
.status-card strong {
    display: block;
    margin-top: 8px;
    font-size: 30px;
}
.status-card p {
    margin: 10px 0 0;
    color: #64748b;
}
@media (max-width: 900px) {
    .hero {
        grid-template-columns: 1fr;
    }
    h1 {
        font-size: 38px;
    }
    .action-group {
        grid-template-columns: 1fr;
    }
}
</style>
