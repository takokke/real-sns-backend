import express from "express"
// // routing
import userRouter from "./routes/users.js"
import authRouter from "./routes/auth.js"
import postRouter from "./routes/posts.js"

import mongoose from "mongoose"
// dotenv導入
import "dotenv/config"

declare const process: {
    env: {
        MONGOURL: string
    }
}

const app = express()
const PORT = 3000

// データベース接続
mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
        console.log("DB connect")
    }).catch((err) => {
        console.log(err)
    })

// ミドルウェアの設定
// ここでいうミドルウェアは、リクエストオブジェクトとレスポンスオブジェクトを処理する関数
// あらゆるHTTPリクエストに対して、共通の処理ができるようになる
app.use(express.json())
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

app.get("/", (req, res) => {
    res.send("ホーム画面")
})

app.listen(PORT, () => console.log("server start"))