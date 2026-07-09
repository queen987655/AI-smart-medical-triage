//FHIR Builder Barrel Export
// Builder 模組的統一匯出入口（Barrel Export），負責集中匯出所有 FHIR Resource Builder，方便其他模組使用
export * from "./observationBuilder.js";           //建立 FHIR Observation Resource，用來儲存 AI 預診分析結果   
export * from "./encounterBuilder.js";             //建立 FHIR Encounter Resource，記錄一次 AI 預診事件
export * from "./provenanceBuilder.js";            //建立 FHIR Provenance Resource，紀錄 AI 分析來源（Google Gemini）
export * from "./bundleBuilder.js";                //將 Observation、Encounter、Provenance 等 Resource組成 FHIR Transaction Bundle，一次寫入 HAPI FHIR Server
