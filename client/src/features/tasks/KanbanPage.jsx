import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, isPast, startOfToday } from 'date-fns'
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, GripVertical, LayoutList, LoaderCircle, Pencil, Plus, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createBoardList, getBoardLists, moveBoardCard, renameBoardList } from '../../services/boardService'
import { createTask, getTasks, updateTask } from '../../services/taskService'
import TaskFormModal from './TaskFormModal'

const priorityStyles = { low: 'border-slate-400', medium: 'border-blue-500', high: 'border-amber-500', critical: 'border-rose-500' }

function refreshConnectedViews(queryClient) {
  ;['tasks', 'dashboard', 'analytics', 'board-lists'].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
}

export default function KanbanPage() {
  const queryClient = useQueryClient()
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [activeListId, setActiveListId] = useState(null)
  const [createForList, setCreateForList] = useState(null)
  const [editingCard, setEditingCard] = useState(null)
  const [showListForm, setShowListForm] = useState(false)
  const [editingListId, setEditingListId] = useState(null)
  const [editingListName, setEditingListName] = useState('')
  const [listName, setListName] = useState('')
  const [listStatus, setListStatus] = useState('todo')
  const { data: taskResponse, isLoading: tasksLoading, isError: tasksError } = useQuery({ queryKey: ['tasks'], queryFn: () => getTasks({ limit: 100 }) })
  const { data: lists = [], isLoading: listsLoading, isError: listsError } = useQuery({ queryKey: ['board-lists'], queryFn: getBoardLists })
  const moveTask = useMutation({ mutationFn: moveBoardCard, onSuccess: () => refreshConnectedViews(queryClient) })
  const createCard = useMutation({ mutationFn: createTask, onSuccess: () => { refreshConnectedViews(queryClient); setCreateForList(null) } })
  const updateCard = useMutation({ mutationFn: updateTask, onSuccess: () => { refreshConnectedViews(queryClient); setEditingCard(null) } })
  const createList = useMutation({ mutationFn: createBoardList, onSuccess: () => { refreshConnectedViews(queryClient); setListName(''); setListStatus('todo'); setShowListForm(false) } })
  const renameList = useMutation({ mutationFn: renameBoardList, onSuccess: () => { refreshConnectedViews(queryClient); setEditingListId(null); setEditingListName('') } })
  const tasks = useMemo(() => taskResponse?.data || [], [taskResponse])
  const fallbackListByStatus = useMemo(() => new Map(lists.filter((list) => !lists.some((other) => other.status === list.status && other.position < list.position)).map((list) => [list.status, list._id])), [lists])

  function cardsForList(list) { return tasks.filter((task) => task.boardList?._id === list._id || (!task.boardList && fallbackListByStatus.get(task.status) === list._id)) }
  function handleDrop(event, listId) { event.preventDefault(); const taskId = event.dataTransfer.getData('text/task-id') || draggedTaskId; if (taskId) moveTask.mutate({ taskId, listId }); setDraggedTaskId(null); setActiveListId(null) }
  function submitCard(values) { createCard.mutate({ ...values, boardList: createForList._id, status: createForList.status }) }
  function submitList(event) { event.preventDefault(); const name = listName.trim(); if (name) createList.mutate({ name, status: listStatus }) }
  function submitListName(event, listId) { event.preventDefault(); const name = editingListName.trim(); if (name) renameList.mutate({ listId, name }) }
  const loading = tasksLoading || listsLoading
  const error = tasksError || listsError || moveTask.isError || createCard.isError || updateCard.isError || createList.isError

  useEffect(() => {
    const openCard = (event) => {
      if (event.target.closest('button, input, select, textarea')) return
      const card = event.target.closest('article[draggable]')
      const title = card?.querySelector('p')?.textContent
      const task = tasks.find((item) => item.title === title)
      if (task) setEditingCard(task)
    }
    document.addEventListener('click', openCard)
    return () => document.removeEventListener('click', openCard)
  }, [tasks])

  useEffect(() => {
    document.querySelectorAll('section.w-72.shrink-0 > div:last-child').forEach((list) => {
      list.style.maxHeight = 'calc(100vh - 300px)'
      list.style.overflowY = 'auto'
      list.style.scrollbarWidth = 'none'
      list.classList.add('kanban-list-scroll')
      list.style.display = 'flex'
      list.style.flexDirection = 'column'
      const addCardButton = list.querySelector('button')
      if (addCardButton) addCardButton.style.order = '-1'
    })
  }, [lists, tasks])

  function scrollBoard(direction) {
    document.querySelector('[class*="overflow-x-auto"]')?.scrollBy({ left: direction * 420, behavior: 'smooth' })
  }
  function saveCard(values) { updateCard.mutate({ taskId: editingCard._id, payload: values }) }

  return <div className="mx-auto max-w-[1500px]">
    <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">Work management</p><h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Tasks board</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create cards, organize them into lists, and track progress as work moves forward.</p></div><button onClick={() => setShowListForm(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><LayoutList size={17} />Add list</button></section>
    {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">Couldn&apos;t save that board change. Please try again.</div>}
    {!loading && <><style>{'.kanban-list-scroll::-webkit-scrollbar { display: none; }'}</style><div className="mb-3 flex items-center justify-end gap-2"><button onClick={() => scrollBoard(-1)} aria-label="Scroll board left" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><ChevronLeft size={18} /></button><button onClick={() => scrollBoard(1)} aria-label="Scroll board right" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"><ChevronRight size={18} /></button></div></>}
    {loading ? <div className="grid min-h-80 place-items-center text-slate-400"><LoaderCircle className="animate-spin" /></div> : <div className="flex gap-4 overflow-x-auto pb-5">{lists.map((list) => { const cards = cardsForList(list); const isDoneList = list.status === 'completed'; return <section key={list._id} className="w-72 shrink-0"><div className="mb-3 flex items-center justify-between px-1"><div className="min-w-0 flex-1">{editingListId === list._id ? <form onSubmit={(event) => submitListName(event, list._id)} className="flex gap-1"><input autoFocus value={editingListName} onChange={(event) => setEditingListName(event.target.value)} onBlur={() => { if (editingListName.trim()) renameList.mutate({ listId: list._id, name: editingListName.trim() }); else setEditingListId(null) }} className="min-w-0 flex-1 rounded-md border border-blue-400 bg-white px-2 py-1 text-sm font-semibold text-slate-800 outline-none dark:bg-slate-800 dark:text-white" /><button className="sr-only">Save</button></form> : <div className="flex items-center gap-1"><h2 className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{list.name}</h2><button onClick={() => { setEditingListId(list._id); setEditingListName(list.name) }} aria-label={`Rename ${list.name}`} className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-blue-600 dark:hover:bg-slate-800"><Pencil size={13} /></button></div>}<p className={`mt-0.5 flex items-center gap-1 text-[10px] capitalize ${isDoneList ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{isDoneList && <CheckCircle2 size={12} />} {isDoneList ? 'Done — counts as completed' : `Tracks as ${list.status.replace('-', ' ')}`}</p></div><span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800">{cards.length}</span></div><div onDragOver={(event) => { event.preventDefault(); setActiveListId(list._id) }} onDragLeave={() => setActiveListId(null)} onDrop={(event) => handleDrop(event, list._id)} className={`min-h-52 space-y-3 rounded-2xl p-2 transition ${isDoneList ? 'bg-emerald-50/70 dark:bg-emerald-500/5' : activeListId === list._id ? 'bg-blue-100 ring-2 ring-blue-500/40 dark:bg-blue-500/10' : 'bg-slate-100/80 dark:bg-slate-900/70'}`}>{cards.map((task) => { const overdue = task.dueDate && task.status !== 'completed' && isPast(new Date(task.dueDate)) && new Date(task.dueDate) < startOfToday(); return <article key={task._id} draggable={!moveTask.isPending} onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/task-id', task._id); setDraggedTaskId(task._id) }} onDragEnd={() => { setDraggedTaskId(null); setActiveListId(null) }} className={`cursor-grab rounded-xl border-l-4 ${isDoneList ? 'border-emerald-500' : priorityStyles[task.priority]} bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:bg-slate-800`}><div className="flex items-start gap-2">{isDoneList ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> : <GripVertical size={16} className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600" />}<div className="min-w-0 flex-1"><p className={`text-sm font-semibold ${isDoneList ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</p>{task.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>}</div></div><div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500"><span className="capitalize">{task.priority} priority</span>{task.dueDate && <span className={`inline-flex items-center gap-1 ${overdue ? 'text-rose-600 dark:text-rose-400' : ''}`}><CalendarDays size={12} />{format(new Date(task.dueDate), 'MMM d')}</span>}</div><p className="mt-2 truncate text-[11px] text-slate-400">{task.project?.name || 'No project'}</p></article> })}{cards.length === 0 && <p className="px-2 py-4 text-center text-xs text-slate-400">Drop a card here</p>}<button onClick={() => setCreateForList(list)} className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:hover:bg-blue-500/10"><Plus size={15} />Add card</button></div></section> })}</div>}
    {createForList && <TaskFormModal isSubmitting={createCard.isPending} onClose={() => setCreateForList(null)} onSubmit={submitCard} />}
    {editingCard && <TaskFormModal task={editingCard} isSubmitting={updateCard.isPending} onClose={() => setEditingCard(null)} onSubmit={saveCard} />}
    {showListForm && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={() => setShowListForm(false)}><form onSubmit={submitList} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold dark:text-white">Create list</h2><p className="mt-1 text-xs text-slate-500">Choose how cards in this list affect progress.</p></div><button type="button" onClick={() => setShowListForm(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={19} /></button></div><label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-200">List name<input autoFocus value={listName} onChange={(event) => setListName(event.target.value)} placeholder="e.g. Ready for QA" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></label><label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">Progress status<select value={listStatus} onChange={(event) => setListStatus(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option value="backlog">Backlog</option><option value="todo">To do</option><option value="in-progress">In progress</option><option value="waiting">Waiting</option><option value="review">Review</option><option value="completed">Completed</option></select></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowListForm(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Cancel</button><button disabled={createList.isPending || !listName.trim()} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Create list</button></div></form></div>}
  </div>
}
