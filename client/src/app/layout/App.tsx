import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./header";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingComponent from "./LoadingComponent";
import SideBar from "./SideBar";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {

      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());

    } catch (error: any) {
      console.log(error)
    }
  }, [dispatch]);

  //Using callback from above in useEffect will initialize function only once
  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);


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

  if (loading) return <LoadingComponent message="Initializing component..." />

  const drawerWidth = 240;

  //Master page will contain all the elements of children page
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <SideBar />
      <Header onDarkMode={changeTheme} darkMode={darkMode} />
      <Container sx={{ ml: `${drawerWidth}px`, mb: 4 }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
