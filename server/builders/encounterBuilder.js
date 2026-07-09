//FHIR Encounter Builder
//建立 FHIR Encounter Resource，用來記錄病人一次 AI 預診事件
export function buildEncounter(patientId) {
    return {
        resourceType: "Encounter",                                           //FHIR Resource Type
        status: "finished",                                                  //Encounter 狀態
        class: {                                                             //Encounter 類型
            system:                
            "http://terminology.hl7.org/CodeSystem/v3-ActCode",              //採用 HL7 ActCode
            code: "AMB",                                                     //AMB = Ambulatory
            display: "Ambulatory"
        },
        subject: {                                                           // 病人參照
            reference:
            `Patient/${patientId}`
        },
        period: {                                                            //Encounter 時間
            start:                                                           //AI 預診開始時間，使用 ISO 8601 格式
            new Date().toISOString()
        }
    };
}