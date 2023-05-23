import axios from "axios";
import getEnvVars from "../../environment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { apiUrl } = getEnvVars();

const api = (token) =>
  axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const get = async (path) => {
  const token = await AsyncStorage.getItem("@token");
  const { data } = await api(token).get(path);
  return data;
};
