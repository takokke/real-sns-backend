import mongoose from "mongoose"

// mongoDBを使う可能性は低いが、ログイン機能を一から手作りするので勉強になりそう
// DBスキーマをノートにとる

const UserSchema = new mongoose.Schema(
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
            type: Array,
            default: []
        },
          followings: {
            type: Array,
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