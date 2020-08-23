import React, { FunctionComponent } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import WorkOrders from "./components/workorders";
import WorkOrder from "./components/workorder";
import CreateWorkOrder from "./components/create_workorder";
import Productivity from "./components/productivity";
import AppBar from "./components/appbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    secondary: { main: "#011E40" },
  },
});

const App: FunctionComponent<any> = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar />
        <div className="app">
          {/* <img src={logo} className="app-logo" alt="logo" /> */}
          <div className="app-body">
            <Switch>
              <Route exact path="/workorders" component={WorkOrders} />
              <Route exact path="/workorders/new" component={CreateWorkOrder} />
              <Route exact path="/workorders/:id" component={WorkOrder} />
              <Route exact path="/productivity" component={Productivity} />
            </Switch>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
