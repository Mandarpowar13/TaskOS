import User from '../models/User.js'
export const userRepository = { findByEmail: (email, withPassword = false) => User.findOne({ email }).select(withPassword ? '+password +refreshTokenHash' : ''), findById: (id) => User.findById(id), create: (data) => User.create(data), updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true }) }
