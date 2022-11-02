import React from "react";
import theme from "./App-styles";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import "./App.css";
import Popup from "./views/Popup/Popup";

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Popup />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
