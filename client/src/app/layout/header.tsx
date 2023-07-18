import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
    darkMode: boolean;
    onDarkMode: () => void
}

export default function Header({ darkMode, onDarkMode }: Props) {
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6">
                    RE-STORE <Switch onChange={onDarkMode} checked={darkMode} />
                </Typography>
            </Toolbar>
        </AppBar>
    )
}