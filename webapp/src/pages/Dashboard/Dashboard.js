import { useCallback, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import { useHistory } from "react-router-dom";

import DashboardRouter from "./DashboardRouter";
import styles from "./Dashboard.module.scss";

import AddTickerModal from "../../components/AddTickerModal/AddTickerModal";
import Navbar from "../../components/Navbar/Navbar";
import { fetchWatchedTickers, removeTicker } from "../../services/tickerService";

function Dashboard({ match }) {
  const { url } = match;
  const [tickers, setTickers] = useState([]);
  const [showNavBar, setShowNavBar] = useState(true);
  const [showAddTickerModal, setShowAddTickerModal] = useState(false);
  const history = useHistory();

  const fetchTickers = useCallback(() => {
    const tickers = fetchWatchedTickers();
    setTickers(tickers);
  }, []);

  const onCloseNav = useCallback(() => {
    setShowNavBar(!showNavBar);
  }, [showNavBar, setShowNavBar]);

  const onClickAddTickerModal = useCallback(() => {
    setShowAddTickerModal(!showAddTickerModal);
  }, [showAddTickerModal]);

  const deleteTicker = (tickerSymbol) => {
    try {
      removeTicker(tickerSymbol);
      const tickers = fetchWatchedTickers();
      for (const ticker of tickers) {
        if (ticker.symbol !== tickerSymbol) {
          history.push(ticker.path);
          break;
        }
      }
      setTickers(tickers);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTickers(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.container}>
      {showAddTickerModal && (
        <AddTickerModal
          onClose={onClickAddTickerModal}
          refreshTickers={fetchTickers}
        />
      )}
      {showNavBar && (
        <Navbar
          navData={tickers}
          path={url}
          onCloseNav={onCloseNav}
          onClickAddTickerModal={onClickAddTickerModal}
        />
      )}
      {!showNavBar && (
        <MenuIcon className={styles.hamburgerButton} alt="menu" onClick={onCloseNav} fontSize="large" />
      )}
      {showNavBar && <Divider orientation="vertical" />}
      <div className={styles.view}>
        <DashboardRouter deleteTicker={deleteTicker}/>
      </div>
    </main>
  );
}

export default Dashboard;
