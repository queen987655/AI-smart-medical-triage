//FHIR Provenance Builder      Provenance 是 FHIR 中用來描述：資料由誰建立、建立時間、建立原因、建立工具
//建立 FHIR Provenance Resource，用來記錄 AI 預診資料的來源 (Data Provenance)
export function buildProvenance() {                        //建立一筆 FHIR Provenance，紀錄 AI 分析結果的來源
    return {
        resourceType: "Provenance",
        recorded: new Date().toISOString(),                //Provenance 建立時間，使用 ISO 8601 格式
        activity: {                                        //描述此次資料建立活動
            coding: [{
            system: "http://terminology.hl7.org/CodeSystem/v3-DataOperation",
            code: "CREATE",
            display: "Create"
            }],
            text: "AI Triage"
        },
        agent: [                                           //記錄此次資料來源
            {
                who: {
                    display: "Google Gemini"               //AI 系統名稱
                }
            }
        ]
    };
}