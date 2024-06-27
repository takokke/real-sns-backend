//const router = require("express").Router()
import express from "express"

const router = express.Router()



// router.get("/", (req, res) => {
//     res.send("users router")
//     return res.status(200).json(res)
// })

// module.exports = router
// デフォルトエクスポートは、importする際に任意で名前をつけられる。
// 名前付きエクスポートとは異なる
export default router