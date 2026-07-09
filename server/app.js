//AI Triage System Backend Server
//整個 AI Triage System 的後端入口，負責建立 Express Server、載入 Middleware、註冊 API Router，並啟動 HTTP 服務
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//每個 Router 負責一組 API
import healthRouter from "./routes/health.js";                      //Health Check API
import triageRouter from "./routes/triage.js";                      // AI 預診 API
import cdsRouter from "./routes/CDSHhooks.js";                      // CDS Hooks API
import patientRouter from "./routes/patient.js";                    // Patient API
import dashboardRouter from "./routes/dashboard.js";                // Dashboard API
import encounterRouter from "./routes/encounter.js";                // Encounter API

dotenv.config();

const app = express();                                              //建立 Express Application

app.use(cors());                                                    //Middleware，啟用 CORS，允許 Vue Frontend呼叫 Express API
app.use(express.json());                                            //啟用 JSON Parser，將 Request Body自動轉成 JavaScript Object

//API Router
app.use("/api/health", healthRouter);
app.use("/api/triage", triageRouter);
app.use("/api/cds-services", cdsRouter);
app.use("/api/patient", patientRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/encounter", encounterRouter);

//啟動 Server
const PORT = process.env.PORT || 3000;

//啟動 HTTP Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});