import apiClient from './apiClient'

export async function getBoardLists() { const { data } = await apiClient.get('/board/lists'); return data.data }
export async function createBoardList(payload) { const { data } = await apiClient.post('/board/lists', payload); return data.data }
export async function renameBoardList({ listId, name }) { const { data } = await apiClient.patch(`/board/lists/${listId}`, { name }); return data.data }
export async function moveBoardCard({ taskId, listId }) { const { data } = await apiClient.patch(`/board/cards/${taskId}/move`, { listId }); return data.data }
