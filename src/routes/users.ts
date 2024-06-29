import express from "express"
import User from "../models/User.js"
import bcrypt from "bcrypt"

const router = express.Router()

// 接続チェック
router.get("/", async (req, res) => {
    return res.send("usersのAPI11です")
})

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
        // パスワードと更新日を省く
        if (user !== null) {
            const { password, updatedAt, ...other } = user._doc //_docはmongooseで取得したデータのプロパティ
            res.status(200).json(other)
        }
       
    } catch (err) {
        return res.status(500).json(err)
    }
})

// ユーザーのフォロー
// パスパラメータの:idは、フォローされるユーザーのid
router.put("/:id/follow", async (req, res) => {
    // 自分自身はフォローできない
    if (req.body.userId !== req.params.id) {
        try {

            const followedUser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (followedUser !== null && currentUser !== null && !followedUser.followers.includes(req.body.userId)) {
                await followedUser.updateOne({
                    $push: {
                        followers: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id
                    }
                })
                return res.status(200).json("フォローに成功しました")
            } else {
                return res.status(403).json("あなたはすでにこのユーザーをフォローしています")
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("自分自身はフォローできません")
    }
})

// ユーザーのフォロー解除
router.put("/:id/unfollow", async (req, res) => {
    // 自分自身はフォロー解除できない
    if (req.body.userId !== req.params.id) {
        try {
            // フォロー解除されるユーザー
            const unfollowedUser = await User.findById(req.params.id)
            // フォローするユーザー
            const currentUser = await User.findById(req.body.userId)
            // フォロワーに存在したら
            if (unfollowedUser !== null && currentUser !== null && unfollowedUser.followers.includes(req.body.userId)) {
                await unfollowedUser.updateOne({
                    $pull: {
                        followers: req.body.userId
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id
                    }
                })
                return res.status(200).json("フォロー解除しました")
            } else {
                return res.status(403).json("このユーザーをフォロー解除できません")
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("自分自身はフォロー解除できません")
    }
})

// デフォルトエクスポートは、importする際に任意で名前をつけられる。
// 名前付きエクスポートとは異なる
export default router