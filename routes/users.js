//const router = require("express").Router()
import express from "express"
import User from "../models/User.js"
import bcrypt from "bcrypt"

const router = express.Router()

// ユーザ更新
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 10)
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("ユーザー情報が更新されました")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます")
    }
})

// アカウント削除
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("アカウントが削除されました")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけアカウントを削除できます")
    }
})

// ユーザ情報を取得
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // 分割代入
        const { password, updatedAt, ...other } = user._doc //_docはmongooseで取得したデータのプロパティ
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err)
    }
   
})

// router.get("/", (req, res) => {
//     res.send("users router")
//     return res.status(200).json(res)
// })

// module.exports = router
// デフォルトエクスポートは、importする際に任意で名前をつけられる。
// 名前付きエクスポートとは異なる
export default router