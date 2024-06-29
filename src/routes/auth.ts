import express from "express"
import User from "../models/User.js"
import bcrypt from "bcrypt"

const router = express.Router()

// 新規ユーザ登録
router.post("/register", async (req, res) => {
    try {
        // 新しいインスタンス（ドキュメント）を生成
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        // データベースに保存する saveメソッドは非同期メソッドのため、awaitでPromiseが解決するまで待機する
        const user = await newUser.save()
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// ログイン
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) return res.status(404).send("ユーザが見つかりません")
        
        const vailedPassword = bcrypt.compareSync(req.body.password, user.password)
        if(!vailedPassword) return res.status(400).json("パスワードが違います")
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json(err)
    }
})

export default router
