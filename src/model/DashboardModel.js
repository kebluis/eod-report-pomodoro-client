import { get } from "../axios/api"

export const getAllTasks = async (userId) => {
  const response = await get(`/task/tasks/${userId}`)
  return response
}

/**
 * @TODO: Determine correct parameter for create tasks
 **/
export const createTask = async (userId) => {
  const response = await post(`/task/tasks/${userId}`, {})
  return response
}