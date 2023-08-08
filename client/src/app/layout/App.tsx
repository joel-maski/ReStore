import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import getCookie from "../utils/utils";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import SideBar from "./SideBar";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if (buyerId) {
      agent.Basket.get()
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

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
