import { useCallback } from "react";
import { Switch, Route } from "react-router-dom";

import HomeView from "./Home/HomeView";
import TickerView from "./Ticker/TickerView";

function DashboardRouter({deleteTicker}) {
  const renderHome = useCallback((props) => {
    return <HomeView />;
  }, []);

  const renderTicker = useCallback((props) => {
    return <TickerView {...props} deleteTicker={deleteTicker}/>;
  }, []);

  return (
    <Switch>
      <Route exact path={"/"} render={renderHome} />
      <Route path={"/:ticker"} render={renderTicker} />
    </Switch>
  );
}

export default DashboardRouter;
