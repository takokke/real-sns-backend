import mongoose, {Document, Schema} from "mongoose";
import { IPost } from "../types/IPost.type";

const PostSchema: Schema<IPost> = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            max: 200,
        },
        img: {
            type: String
        },
        likes: {
            type: [{type: mongoose.Types.ObjectId, ref: "user"}],
            default: [],
        },
    },
    { timestamps: true }
)

// スキーマをモデル化
export default mongoose.model('Post', PostSchema)