import mongoose from 'mongoose'
const commentSchema = new mongoose.Schema({ task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, index: true }, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, message: { type: String, required: true, trim: true, maxlength: 3000 }, editedAt: { type: Date, default: null } }, { timestamps: true, versionKey: false })
export default mongoose.model('Comment', commentSchema)
