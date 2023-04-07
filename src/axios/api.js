import axios from "axios";
import getEnvVars from "../environment";

const { apiUrl, token } = getEnvVars();

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const get = async (path) => {
  const { data } = await api.get(path);
  return data;
};
