import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
    { title: 'catalog', path: '/catalog' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' }
];

const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' }
];

const navStyles = {
    color: 'inherit',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    },
    textDecoration: 'none'
};

interface Props {
    darkMode: boolean;
    onDarkMode: () => void
}

//Contains all the elements located on the App Bar fixed on top of the web page.
export default function Header({ darkMode, onDarkMode }: Props) {
    const { basket } = useAppSelector(s => s.basket);
    const { user } = useAppSelector(s => s.account);

    //'reduce' is javascript function to iterate through array, add logic and return output.
    //'sum' will contain the final output
    //'item' will contain each item object in an array
    //below example loops through array and counting the quantity per item
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);
    const drawerWidth = 240;

    return (
        <AppBar position="static" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, mb: 4 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

                <Box display='flex' alignItems='center'>
                    <Typography variant="h6"
                        component={NavLink}
                        to='/'
                        sx={navStyles}>
                        RE-STORE
                    </Typography>
                    <Switch onChange={onDarkMode} checked={darkMode} />
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}>
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size="large" edge='start' color="inherit" sx={{ mr: 2 }}>
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart></ShoppingCart>
                        </Badge>
                    </IconButton>
                    {
                        user ? (
                            <SignedInMenu />
                        )
                            :
                            (
                                <List sx={{ display: 'flex' }}>
                                    {rightLinks.map(({ title, path }) => (
                                        <ListItem
                                            component={NavLink}
                                            to={path}
                                            key={path}
                                            sx={navStyles}>
                                            {title.toUpperCase()}
                                        </ListItem>
                                    ))}
                                </List>
                            )
                    }
                </Box>
            </Toolbar>
        </AppBar>
    )
}