import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  password: { type: String, required: true, select: false, minlength: 8 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'manager', 'employee', 'director'], default: 'employee', index: true },
  department: { type: String, trim: true, default: '' },
  timezone: { type: String, default: 'UTC' },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  notificationPreferences: { desktop: { type: Boolean, default: true }, email: { type: Boolean, default: false }, dailySummary: { type: Boolean, default: true }, weeklySummary: { type: Boolean, default: true } },
  refreshTokenHash: { type: String, select: false },
  lastLogin: { type: Date },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
}, { timestamps: true, versionKey: false })

userSchema.pre('save', async function hashPassword(next) { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12); next() })
userSchema.methods.comparePassword = function comparePassword(candidate) { return bcrypt.compare(candidate, this.password) }
userSchema.methods.toJSON = function toJSON() { const object = this.toObject(); delete object.password; delete object.refreshTokenHash; return object }

export default mongoose.model('User', userSchema)
