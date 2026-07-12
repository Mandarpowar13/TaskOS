import AppError from '../utils/AppError.js'
import { projectRepository } from '../repositories/projectRepository.js'
import { activityService } from './activityService.js'

export const projectService = {
  list: (user) => projectRepository.findAccessible(user.id, { status: { $ne: 'archived' } }),
  async get(user, projectId) { const project = await projectRepository.findAccessibleById(projectId, user.id); if (!project) throw new AppError('Project not found.', 404); return project },
  async create(user, payload) { const members = [...new Set([user.id, ...(payload.members || [])])]; const project = await projectRepository.create({ ...payload, owner: user.id, members }); await activityService.record({ actor: user.id, entityType: 'project', entityId: project.id, action: 'project_created', message: `Created project: ${project.name}` }); return project },
  async update(user, projectId, payload) { const project = await this.get(user, projectId); if (project.owner.id !== user.id && !['admin', 'manager', 'director'].includes(user.role)) throw new AppError('Only the project owner can update this project.', 403); Object.assign(project, payload); if (payload.members) project.members = [...new Set([project.owner.id, ...payload.members])]; await projectRepository.save(project); await activityService.record({ actor: user.id, entityType: 'project', entityId: project.id, action: 'project_updated', message: `Updated project: ${project.name}` }); return project },
  async archive(user, projectId) { const project = await this.get(user, projectId); if (project.owner.id !== user.id && !['admin', 'manager', 'director'].includes(user.role)) throw new AppError('Only the project owner can archive this project.', 403); project.status = 'archived'; await projectRepository.save(project); await activityService.record({ actor: user.id, entityType: 'project', entityId: project.id, action: 'project_archived', message: `Archived project: ${project.name}` }) },
}
