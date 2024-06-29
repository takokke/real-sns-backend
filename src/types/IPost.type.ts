import mongoose, {Document} from "mongoose";

interface IPost extends Document {
    userId: string;
    desc: string;
    img: string;
    likes: mongoose.Types.Array<mongoose.Types.ObjectId>;
}

export { IPost }