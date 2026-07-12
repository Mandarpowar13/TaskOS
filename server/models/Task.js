import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Task title is required.'], trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 5000, default: '' },
    status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium', index: true },
    dueDate: { type: Date, default: null, index: true },
    category: { type: String, trim: true, maxlength: 80, default: '' },
    project: { type: String, trim: true, maxlength: 120, default: '' },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
)

taskSchema.index({ status: 1, dueDate: 1 })

export default mongoose.model('Task', taskSchema)
