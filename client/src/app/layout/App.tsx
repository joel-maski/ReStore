import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./header";
import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const PaletteType = darkMode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: PaletteType,
      background: {
        default: PaletteType === 'light' ? '#eaeaea' : '#143323'
      }
    }
  });

  function changeTheme() {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header onDarkMode={changeTheme} darkMode={darkMode} />
      <Container>
        <Catalog />
      </Container>
    </ThemeProvider>
  );
}

export default App;
