import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {type:String, required: true},
        name: {type:String, required: true},
        email: {type:String, required: true, unique: true, lowercase: true, trim: true},
        password: {type:String, required: true, select: false},
        role: {type:String, enum: ['student', 'educator'], default: 'student'},
        imageUrl: {type:String, default: ''},
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
    }, {timestamps: true}
);

const User = mongoose.model('User', userSchema)

export default User;
