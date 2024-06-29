import mongoose,{ Document, Schema } from "mongoose"

// mongoDBを使う可能性は低いが、ログイン機能を一から手作りするので勉強になりそう
// DBスキーマをノートにとる

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    coverPicture?: string;
    followers: mongoose.Types.ObjectId[];
    followings: mongoose.Types.ObjectId[];
    isAdmin?: boolean;
    desc?: string;
    city?: string;
    createdAt?: Date;
    updatedAt?: Date;
    _doc?: any; // _docプロパティを追加
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 25,
            unique: true
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 50
        },
        profilePicture: {
            type: String,
            default: ""
        },
        coverPicture: {
            type: String,
            default: ""
        },
        followers: {
            type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
            default: []
        },
        followings: {
            type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
            default: []
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        desc: {
            type: String,
            max: 50
        },
        city: {
            type: String,
            max: 50
        },
    },

    {timestamps: true}
)

export default mongoose.model('User', UserSchema)