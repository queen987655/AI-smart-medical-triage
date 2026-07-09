// FHIR Transaction Bundle Builder
//將多個 FHIR Resource包裝成一個 Transaction Bundle，讓 HAPI FHIR Server 一次完成所有 Resource 的建立
export function buildBundle(resources) {
    return {
        resourceType: "Bundle",
        type: "transaction",                        //所有 Resource 必須一次成功，若其中一個 Resource 建立失敗，整個 Bundle 都會 Rollback，不會留下部分資料
        entry:                                      //每一筆 Resource都會建立一個 Entry
        resources.map(resource => ({
            resource,
            request: {
                method: "POST",
                url: resource.resourceType
            }
        }))
    };
}