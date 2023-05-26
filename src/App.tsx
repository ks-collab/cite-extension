import React from "react";
import theme from "./App-styles";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import Popup from "./views/Popup/Popup";

const App:React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Popup />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
