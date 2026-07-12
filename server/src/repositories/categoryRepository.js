import Category from '../models/Category.js'
export const categoryRepository = { findAccessible: (userId) => Category.find({ $or: [{ isDefault: true }, { owner: userId }] }).sort({ isDefault: -1, name: 1 }), findById: (id) => Category.findById(id), create: (data) => Category.create(data), save: (category) => category.save() }
