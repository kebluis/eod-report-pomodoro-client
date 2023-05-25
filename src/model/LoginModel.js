import { get } from "../axios/api"

export const getUserInfo = async () => {
  const response = await get(`/user`)
  return response
}