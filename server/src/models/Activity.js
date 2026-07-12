import mongoose from 'mongoose'
const activitySchema = new mongoose.Schema({ actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, entityType: { type: String, enum: ['task', 'project', 'user', 'comment'], required: true }, entityId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true }, action: { type: String, required: true }, changes: { type: mongoose.Schema.Types.Mixed, default: {} }, message: { type: String, default: '' } }, { timestamps: true, versionKey: false })
activitySchema.index({ entityType: 1, entityId: 1, createdAt: -1 })
export default mongoose.model('Activity', activitySchema)
