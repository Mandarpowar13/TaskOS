import mongoose from 'mongoose'
import { TASK_STATUSES } from '../constants/task.js'

const boardListSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: TASK_STATUSES, default: 'todo' },
  position: { type: Number, required: true, min: 0 },
}, { timestamps: true, versionKey: false })

boardListSchema.index({ owner: 1, position: 1 })
export default mongoose.model('BoardList', boardListSchema)
