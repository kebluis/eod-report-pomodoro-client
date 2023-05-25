import React, { createContext, useReducer } from "react";
import UserReducer from "./reducer";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialState = {
    userInfo: null,
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const setUserInfo = (data) => {
    dispatch({
      type: "set_user_info",
      payload: data,
    });
  };

  return (
    <UserContext.Provider
      value={{  userInfo: state.userInfo, setUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};
