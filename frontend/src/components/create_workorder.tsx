import React, { FunctionComponent } from "react";
import Typography from "@material-ui/core/Typography";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Api from "../services/api";
import { IUser, IError } from "../services/api/api";
import ClipLoader from "react-spinners/ClipLoader";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CssTextField = withStyles({
  root: {
    marginTop: "20px",
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& label": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "auto",
    },
    paper: {
      width: 300,
      height: 300,
      overflow: "auto",
    },
    button: {
      margin: theme.spacing(0.5, 0),
      marginTop: "20px",
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: "white",
      },
    },
    submitButton: {
      marginTop: "20px",
    },
  })
);

function not(a: IUser[], b: IUser[]) {
  return a.filter((value) => b.findIndex((i) => i.id === value.id) === -1);
}

function intersection(a: IUser[], b: IUser[]) {
  return a.filter((value) => b.findIndex((i) => i.id === value.id) !== -1);
}

const CreateWorkOrder: FunctionComponent = () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState<IUser[]>([]);
  const [left, setLeft] = React.useState<IUser[]>([]);
  const [right, setRight] = React.useState<IUser[]>([]);
  const [workOrderName, setWorkOrderName] = React.useState<string>("");
  const [isCreatingWorkOrder, setCreatingWorkOrder] = React.useState<boolean>(
    false
  );
  const [isLoadingUsers, setLoadingUsers] = React.useState<boolean>(false);
  const [error, setError] = React.useState<IError>();
  const [validationError, setValidationError] = React.useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState<boolean>(
    false
  );

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: IUser) => () => {
    const currentIndex = checked.findIndex((i) => i.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items: IUser[]) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value: IUser) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.findIndex((i) => i.id === value.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  const getUsers = React.useCallback(async () => {
    setLoadingUsers(true);
    const [usersResponse, errorResponse] = await Api.GetUsers();
    if (errorResponse) {
      setError(errorResponse);
    } else {
      if (usersResponse) setLeft(usersResponse);
    }
    setLoadingUsers(false);
  }, []);

  const createOrder = async () => {
    if (workOrderName === "") {
      setValidationError(true);
    } else {
      setCreatingWorkOrder(true);
      setValidationError(false);
      const assignees_id = right.map((user) => user.id);
      const [errorResponse] = await Api.CreateWorkOrder(
        workOrderName,
        assignees_id
      );
      if (errorResponse) {
        setError(errorResponse);
        setCreatingWorkOrder(false);
      } else {
        setWorkOrderName("");
        setShowSuccessMessage(true);
        setCreatingWorkOrder(false);
      }
    }
  };

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isLoadingUsers) {
    return <ClipLoader size={150} color={"#123abc"} loading={isLoadingUsers} />;
  }

  if (error?.message) {
    return <h1>Error...</h1>;
  }

  return (
    <>
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
      >
        <Alert severity="success">Work Order Created Successfully!</Alert>
      </Snackbar>
      <form noValidate autoComplete="off">
        <Typography variant="h6" component="h1">
          CREATE WORK ORDER
        </Typography>
        <CssTextField
          data-test-id="work-order-name"
          value={workOrderName}
          error={validationError}
          label="Name"
          variant="outlined"
          helperText={validationError ? "Please enter a work order name" : ""}
          onChange={(e) => setWorkOrderName(e.target.value)}
        />
        <Typography
          variant="body1"
          component="span"
          style={{ display: "flex", marginTop: "10px" }}
        >
          Select Assignees
        </Typography>
        <Grid
          container
          spacing={2}
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item>{customList(left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleAllRight}
                disabled={left.length === 0}
                aria-label="move all right"
              >
                ≫
              </Button>
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleAllLeft}
                disabled={right.length === 0}
                aria-label="move all left"
              >
                ≪
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList(right)}</Grid>
        </Grid>
        <Button
          variant="contained"
          data-test-id="create-work-order-button"
          size="large"
          color="secondary"
          className={classes.submitButton}
          onClick={createOrder}
        >
          {isCreatingWorkOrder ? (
            <span style={{ marginLeft: "20px" }}>CREATING WORK ORDER...</span>
          ) : (
            "CREATE WORK ORDER"
          )}
        </Button>
      </form>
    </>
  );
};

export default CreateWorkOrder;
