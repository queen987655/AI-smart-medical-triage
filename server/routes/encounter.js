//Encounter API Router，處理醫師對 AI 建議的決策
import express from "express";

const router = express.Router();

//接收醫師是否採納 AI 建議
router.post("/accept-ai", async(req,res) => {
    const{patientId, accepted, summary, detail}=req.body;           //取得 Request Body
    console.log({
        patientId, accepted, summary, detail                        //印出醫師決策
    }); 
    res.json({                                                      ////回傳成功
        success:true,
        message: accepted
                ? "醫師已接受 AI 建議"
                : "醫師已忽略 AI 建議"
    });                                       
});

export default router;