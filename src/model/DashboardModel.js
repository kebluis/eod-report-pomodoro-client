import { get } from "../axios/api"

export const getAllTasks = async (userId) => {
  const response = await get(`/task/tasks/${userId}`)
  return response
}