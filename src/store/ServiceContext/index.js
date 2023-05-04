import React, { createContext, useReducer } from "react";
import ServiceReducer from "./reducer";
import { POMODORO } from "../../constants/global";

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const initialState = {
    serviceSelected: POMODORO,
  };

  const [state, dispatch] = useReducer(ServiceReducer, initialState);

  const changeService = (data) => {
    dispatch({
      type: "change_service",
      payload: data,
    });
  };

  return (
    <ServiceContext.Provider
      value={{ serviceSelected: state.serviceSelected, changeService }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
