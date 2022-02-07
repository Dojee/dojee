import { createContext } from "react";

const themeContext = createContext({
  mode: "light",
  setMode: (mode: "light" | "dark") => {},
});

export default themeContext;
