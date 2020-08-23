import React, { FunctionComponent } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const AppBarComponent: FunctionComponent<any> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Maintain X
          </Typography>
          <Button
            data-test-id="work-orders-link"
            color="inherit"
            onClick={() => props.history.push("/workorders")}
          >
            Work Orders
          </Button>
          <Button
            data-test-id="create-work-order-link"
            color="inherit"
            onClick={() => props.history.push("/workorders/new")}
          >
            Create Work Order
          </Button>
          <Button
            data-test-id="productivity-link"
            color="inherit"
            onClick={() => props.history.push("/productivity")}
          >
            Productivity
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(AppBarComponent);
