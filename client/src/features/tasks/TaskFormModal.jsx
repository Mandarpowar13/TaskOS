import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../services/categoryService'
import { getProjects } from '../../services/projectService'

const taskSchema = z.object({
  title: z.string().trim().min(1, 'A task title is required.').max(160, 'Keep the title under 160 characters.'),
  description: z.string().max(5000, 'Keep the description under 5000 characters.').optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dueDate: z.string().optional(),
  category: z.string().max(80, 'Keep the category under 80 characters.').optional(),
  project: z.string().max(120, 'Keep the project name under 120 characters.').optional(),
})

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

export default function TaskFormModal({ task, isSubmitting, onClose, onSubmit }) {
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: getProjects })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', description: '', priority: 'medium', dueDate: '', category: '', project: '' },
  })

  useEffect(() => {
    reset(task ? { ...task, project: task.project?._id || task.project || '', category: task.category?._id || task.category || '', dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' } : { title: '', description: '', priority: 'medium', dueDate: '', category: '', project: '' })
  }, [task, reset])

  const submit = (values) => onSubmit({ ...values, dueDate: values.dueDate || null, description: values.description || '', category: values.category || '', project: values.project || '' })

  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="task-modal-title" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900" onMouseDown={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800"><div><h2 id="task-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">{task ? 'Edit task' : 'Create task'}</h2><p className="mt-1 text-xs text-slate-500">Keep your next action clear and focused.</p></div><button type="button" aria-label="Close task form" onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"><X size={20} /></button></div>
      <form onSubmit={handleSubmit(submit)} className="space-y-4 p-6"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Task title<input autoFocus {...register('title')} placeholder="What needs to be done?" className={inputClass} />{errors.title && <span className="mt-1 block text-xs text-rose-600">{errors.title.message}</span>}</label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Description<textarea {...register('description')} rows="3" placeholder="Add supporting context..." className={`${inputClass} resize-none`} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Priority<select {...register('priority')} className={inputClass}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Due date<input type="date" {...register('dueDate')} className={inputClass} /></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Project<select {...register('project')} className={inputClass}><option value="">No project</option>{projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}</select></label><label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Category<select {...register('category')} className={inputClass}><option value="">No category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label></div><div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button><button disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting && <LoaderCircle className="animate-spin" size={16} />}{task ? 'Save changes' : 'Create task'}</button></div></form>
    </section>
  </div>
}
