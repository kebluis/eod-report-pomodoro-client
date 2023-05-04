import React, { createContext, useReducer } from "react";
import ServiceReducer from "./reducer";
import { POMODORO } from "../../constants/global";

export const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const initialState = {
    serviceSelected: POMODORO,
    isCountdownStarted: false,
  };

  const [state, dispatch] = useReducer(ServiceReducer, initialState);

  const changeService = (payload) =>
    dispatch({
      type: "change_service",
      payload,
    });

  const toggleCountdown = (payload) =>
    dispatch({ type: "toggle_countdown", payload });

  return (
    <ServiceContext.Provider
      value={{
        serviceSelected: state.serviceSelected,
        isCountdownStarted: state.isCountdownStarted,
        changeService,
        toggleCountdown,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
