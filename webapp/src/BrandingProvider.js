import * as React from "react";
import { deepmerge } from "@mui/utils";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getDesignTokens, getThemedComponents } from "./theme";
import themeContext from "./themeContext";
import { useContext } from "react";

export default function BrandingProvider({ children }) {
  const { mode } = useContext(themeContext);
  const theme = React.useMemo(() => {
    const designTokens = getDesignTokens(mode);
    let newTheme = createTheme(designTokens);
    newTheme = deepmerge(newTheme, getThemedComponents(newTheme));
    return newTheme;
  }, [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
