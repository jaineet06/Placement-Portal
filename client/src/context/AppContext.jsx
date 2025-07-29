import { createContext, useContext } from "react";
import axios from "axios";

export const AppContext = createContext();

//Base url
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContextProvider = (props) => {
  const values = {
    axios,
  };

  return (
    <AppContext.Provider value={values}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
