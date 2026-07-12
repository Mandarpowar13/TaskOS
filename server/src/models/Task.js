import mongoose from 'mongoose'
import { TASK_PRIORITIES, TASK_STATUSES } from '../constants/task.js'

const subtaskSchema = new mongoose.Schema({ title: { type: String, required: true, trim: true }, completed: { type: Boolean, default: false }, completedAt: { type: Date, default: null } }, { _id: true })
const attachmentSchema = new mongoose.Schema({ name: String, url: String, mimeType: String, size: Number, uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }, { timestamps: true })
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 }, description: { type: String, trim: true, maxlength: 5000, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true }, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
  priority: { type: String, enum: TASK_PRIORITIES, default: 'medium', index: true }, status: { type: String, enum: TASK_STATUSES, default: 'todo', index: true },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  dueDate: { type: Date, default: null, index: true }, reminderDate: { type: Date, default: null, index: true }, estimatedTime: { type: Number, min: 0, default: null }, actualTime: { type: Number, min: 0, default: null },
  tags: [{ type: String, trim: true, maxlength: 40 }], attachments: [attachmentSchema], subtasks: [subtaskSchema], completionDate: { type: Date, default: null }, archived: { type: Boolean, default: false, index: true },
}, { timestamps: true, versionKey: false })
taskSchema.index({ assignedUser: 1, status: 1, dueDate: 1 })
taskSchema.index({ title: 'text', description: 'text', tags: 'text' })
export default mongoose.model('Task', taskSchema)
