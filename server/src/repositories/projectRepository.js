import Project from '../models/Project.js'

export const projectRepository = {
  create: (data) => Project.create(data),
  findAccessible: (userId, filter = {}) => Project.find({ ...filter, $or: [{ owner: userId }, { members: userId }] }).sort({ updatedAt: -1 }).populate('owner', 'name avatar').populate('members', 'name avatar'),
  findAccessibleById: (projectId, userId) => Project.findOne({ _id: projectId, $or: [{ owner: userId }, { members: userId }] }).populate('owner', 'name avatar').populate('members', 'name avatar'),
  save: (project) => project.save(),
}
