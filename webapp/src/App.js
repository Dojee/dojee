import { useState, Fragment } from "react";

import AppRouter from "./AppRouter";
import themeContext from "./themeContext";
import { getTheme, saveTheme } from "./theme";
import BrandingProvider from "./BrandingProvider";

function App() {
  const [themeMode, setThemeMode] = useState(getTheme());

  function toggleMode() {
    setThemeMode((prevMode) => {
      const nextMode = prevMode === "light" ? "dark" : "light";
      saveTheme(nextMode);
      return nextMode;
    });
  }

  return (
    <Fragment>
      <themeContext.Provider value={{ mode: themeMode, setMode: toggleMode }}>
        <BrandingProvider>
          <AppRouter />
        </BrandingProvider>
      </themeContext.Provider>
    </Fragment>
  );
}

export default App;
