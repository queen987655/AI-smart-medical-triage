//Vue Router 設定檔，設定整個 Vue 前端的路由 (Routing)，讓使用者可以在不同頁面之間切換，並將網址對應到不同的 Vue Component
import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";                         //首頁
import PatientView from "../views/PatientView.vue";           // 病人端 AI 預診頁面
import DoctorView from "../views/DoctorView.vue";             // 醫師端 EHR 模擬器
import Dashboard from "../views/Dashboard.vue";

//建立 Vue Router
const router = createRouter({
    history: createWebHistory(),                              //使用 HTML5 History Mode
    routes: [
        {
            path: "/",                                        //http://localhost:5173/
            component: Home
        },
        {
            path: "/patient",                                 //http://localhost:5173/patient
            component: PatientView
        },
        {
            path: "/doctor",                                  //http://localhost:5173/doctor
            component: DoctorView
        },
        {
            path: "/dashboard",
            component: Dashboard
        }
    ]
});

export default router;                                         //匯出 Router