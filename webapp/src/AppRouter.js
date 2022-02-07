import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";

function AppRouter() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path="*" component={Dashboard} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default AppRouter;
