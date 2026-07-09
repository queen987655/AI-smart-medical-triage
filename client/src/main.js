//Vue 前端專案的入口，負責建立 Vue 應用程式，載入 Router，並將 App 掛載至 index.html
import { createApp } from "vue";            //匯入 Vue 建立應用程式的方法
import App from "./App.vue";                //根元件 (Root Component)，所有頁面都會由 App.vue 開始渲染
import router from "./router";              //管理整個系統的頁面切換

createApp(App)                              //建立 Vue Application
.use(router)                                //註冊 Vue Router，讓整個 Vue App可以使用：<RouterView />、<RouterLink />、router.push()
.mount("#app");                             //掛載 Vue App，將 App.vue掛載到 index.html