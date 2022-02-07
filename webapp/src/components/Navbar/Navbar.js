import { useHistory } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import themeContext from "../../themeContext";
import styles from "./Navbar.module.scss";
import { useContext } from "react";

function Navbar({ path, navData, onCloseNav, onClickAddTickerModal }) {
  const { mode, setMode } = useContext(themeContext);
  const history = useHistory();

  const renderNavData = navData.map((data, index) => {
    return (
      <ListItem key={index}>
        <ListItemButton
          selected={path === data.path}
          onClick={() => history.push(data.path)}
        >
          <ListItemText primary={data.symbol} />
        </ListItemButton>
      </ListItem>
    );
  });

  function onClickMode() {
    setMode();
  }

  return (
    <div className={styles.sidebar}>
      <span>
        <CloseIcon alt="Close" onClick={onCloseNav} fontSize="large" />
      </span>
      <Divider />
      <nav
        className={styles.nav}
        aria-label="navigation sidebar of ticker symbols"
      >
        <List>
          <ListItem index="Home">
            <ListItemButton
              selected={path === "/"}
              onClick={() => history.push("/")}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          {renderNavData}
        </List>
      </nav>
      <Divider />
      <div className={styles.bottomNav}>
        <div className={styles.buttons}>
          <Button variant="outlined" onClick={onClickAddTickerModal} fullWidth>
            Add Ticker
          </Button>
        </div>
        <div>
          {mode === "dark" && (
            <IconButton onClick={onClickMode}>
              <LightModeIcon />
            </IconButton>
          )}
          {mode === "light" && (
            <IconButton onClick={onClickMode}>
              <DarkModeIcon />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
