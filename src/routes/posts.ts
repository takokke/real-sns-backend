import express from "express"
import Post from "../models/Post.js"
import User from "../models/User.js"

const router = express.Router()

// 投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        return res.status(200).json(savedPost)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// 投稿を編集する
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post !== null && post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            })
            return res.status(200).json("投稿編集に成功しました")
        } else {
            return res.status(403).json("あなたは他の人の投稿を編集できません")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})

// 投稿を削除する
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post !== null) {
            if (post.userId === req.body.userId) {
                await post.deleteOne()
                return res.status(200).json("投稿削除に成功しました")
            } else {
                return res.status(403).json("あなたは他の人の投稿を削除できません")
            }
        } else {
            return res.status(404).json("投稿が見つかりませんでした")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})

// 特定の投稿を取得する
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post !== null) {
            return res.status(200).json(post)
        } else {
            return res.status(404).json("投稿が見つかりませんでした")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})

// 特定の投稿にいいねを押す、解除する
// パスパラメータの:idは、フォローされるユーザーのid
router.put("/:id/likes", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post !== null) {
            // まだ、投稿にいいねを押していなかったら
            if (!post.likes.includes(req.body.userId)) {

                await post.updateOne({
                    $push: {
                        likes: req.body.userId
                    }
                })
                return res.status(200).json("投稿にいいねを押しました")
            // すでにいいねを押していたら           
            } else {
                // いいねを解除する
                await post.updateOne({
                    $pull: {
                        likes: req.body.userId
                    }
                })
                return res.status(200).json("いいねを解除しました")
            }
        } else {
            return res.status(404).json("投稿が見つかりません")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})

// タイムラインに投稿を取得
router.get("/timeline/all", async (req, res) => {
    try {
        // 自分の投稿
        const currentUser = await User.findById(req.body.userId)
        if (currentUser !== null) {
            const userPosts = await Post.find({ userId: currentUser._id})
            // 自分がフォローしているユーザーの投稿
            // map内でawaitを使いたい場合 Promise.allを使う
            const friendPosts = await Promise.all(
                currentUser.followings.map((friendId) => {
                    // 配列になる
                    return Post.find({userId: friendId})
                })
            )
            // friendPostsは配列の配列になる
            return res.status(200).json(userPosts.concat(...friendPosts))
        } else {
            return res.status(404).json("ユーザーが見つかりません")
        }
    } catch (err) {
        res.status(500).json(err)
    }

})

export default router
