export const TASK_STATUSES = ['backlog', 'todo', 'in-progress', 'waiting', 'review', 'completed', 'cancelled']
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical']
export const ACTIVE_TASK_STATUSES = TASK_STATUSES.filter((status) => !['completed', 'cancelled'].includes(status))
