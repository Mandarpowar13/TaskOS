import 'dotenv/config'
import fs from 'node:fs/promises'
import mongoose from 'mongoose'
import User from '../src/models/User.js'
import Task from '../src/models/Task.js'
import BoardList from '../src/models/BoardList.js'

const [, , exportPath, userEmail, ...options] = process.argv
const apply = options.includes('--apply')
const force = options.includes('--force')

if (!exportPath || !userEmail) {
  throw new Error('Usage: node scripts/importTrello.js <trello-export.json> <user-email> [--apply] [--force]')
}

const statusByListName = new Map([
  ['in pipeline', 'backlog'], ['ticket raised', 'todo'], ['bugs raised', 'todo'],
  ['wip', 'in-progress'], ['pending from synargics', 'waiting'], ['under review', 'review'], ['done', 'completed'],
])

function statusForList(name) {
  return statusByListName.get(name.trim().toLowerCase()) || 'todo'
}

const board = JSON.parse(await fs.readFile(exportPath, 'utf8'))
const activeLists = (board.lists || []).filter((list) => !list.closed)
const activeListById = new Map(activeLists.map((list) => [list.id, list]))
const cards = (board.cards || []).filter((card) => !card.closed && activeListById.has(card.idList))

await mongoose.connect(process.env.MONGODB_URI)
try {
  const user = await User.findOne({ email: userEmail.toLowerCase() })
  if (!user) throw new Error(`No user found for ${userEmail}.`)

  const existingTasks = await Task.find({ $or: [{ createdBy: user._id }, { assignedUser: user._id }], archived: false }).select('title')
  const existingTitles = new Set(existingTasks.map((task) => task.title.trim().toLowerCase()))
  const cardsToImport = force ? cards : cards.filter((card) => !existingTitles.has(card.name.trim().toLowerCase()))
  const skippedCards = force ? [] : cards.filter((card) => existingTitles.has(card.name.trim().toLowerCase()))

  const summary = {
    board: board.name,
    lists: activeLists.map((list) => ({ name: list.name, status: statusForList(list.name) })),
    cardsToImport: cardsToImport.length,
    skippedDuplicates: skippedCards.map((card) => card.name),
  }

  if (!apply) {
    console.log(JSON.stringify({ mode: 'dry-run', ...summary }, null, 2))
    process.exitCode = 0
  } else {
    const currentLists = await BoardList.find({ owner: user._id }).sort({ position: 1 })
    const listByName = new Map(currentLists.map((list) => [list.name.trim().toLowerCase(), list]))
    let position = currentLists.length

    for (const sourceList of activeLists) {
      const key = sourceList.name.trim().toLowerCase()
      if (!listByName.has(key)) {
        const list = await BoardList.create({ name: sourceList.name.trim(), status: statusForList(sourceList.name), position: position++, owner: user._id })
        listByName.set(key, list)
      }
    }

    const tasks = cardsToImport.map((card) => {
      const sourceList = activeListById.get(card.idList)
      const list = listByName.get(sourceList.name.trim().toLowerCase())
      const completed = list.status === 'completed'
      let title = card.name.trim()
      if (force && existingTitles.has(title.toLowerCase())) title = `${title} [trello:${card.idShort || card.id.slice(0, 6)}]`
      return {
        title,
        description: (card.desc || '').trim(),
        priority: card.labels?.length ? 'high' : 'medium',
        status: list.status,
        boardList: list._id,
        dueDate: card.due ? new Date(card.due) : null,
        completionDate: completed ? (card.dateLastActivity ? new Date(card.dateLastActivity) : new Date()) : null,
        tags: (card.labels || []).map((label) => label.name).filter(Boolean).slice(0, 20),
        createdBy: user._id,
        assignedUser: user._id,
      }
    })
    if (tasks.length) await Task.insertMany(tasks)
    console.log(JSON.stringify({ mode: 'imported', ...summary, imported: tasks.length }, null, 2))
  }
} finally {
  await mongoose.disconnect()
}
