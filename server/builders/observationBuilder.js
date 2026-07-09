//FHIR Observation Builder
//將 Google Gemini AI 分析結果，轉換成符合 FHIR R4 規範的 Observation Resource
//每一次 AI 預診分析都會建立一筆新的 Observation，方便醫師於 EHR 查看 AI 歷史紀錄
export function buildObservation({ patientId, aiResult }) {
    return {
        resourceType: "Observation",
        status: "final",                                           //final：表示 AI 已完成分析，結果為最終版本
        code: {
            coding: [
                {
                    system: "http://loinc.org",
                    code: "80615-8",                               //使用 LOINC Code：80615-8表示 AI Triage Observation
                    display: "AI Triage"
                }
            ]
        },
        subject: {                                                 //指向此次 Observation 所屬病人
            reference: `Patient/${patientId}`
        },
        effectiveDateTime: new Date().toISOString(),               //AI 分析完成時間         
        valueQuantity: {
            value: aiResult.urgency_score || 0,                    //AI 評估病情嚴重程度
            unit: "score"
        },
        note: [                                                    //Gemini 對病情的摘要說明
            {
                text: aiResult.summary || ""
            }
        ],
        component: [                                               //儲存 AI 額外分析資訊
            {
                code: {
                    text: "Emotion"
                },
                valueString:
                aiResult.emotion || ""
            },
            {
                code: {
                    text: "Department"
                },
                valueString:
                aiResult.recommended_department || "未分類"
            },
            {
                code: {
                    text: "Keywords"
                },
                valueString:
                Array.isArray(aiResult.keywords)
                ? aiResult.keywords.join(",")
                : ""
            }
        ]
    };
}