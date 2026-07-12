import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema({ name: { type: String, required: true, trim: true, maxlength: 80 }, color: { type: String, default: '#2563eb' }, owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, isDefault: { type: Boolean, default: false } }, { timestamps: true, versionKey: false })
categorySchema.index({ name: 1, owner: 1 }, { unique: true })
export default mongoose.model('Category', categorySchema)
