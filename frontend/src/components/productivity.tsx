import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import Api from "../services/api/";
import { IUser, IError } from "../services/api/api";
import ClipLoader from "react-spinners/ClipLoader";

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginTop: "20px",
      backgroundColor: "#0256af",
      "&:hover": {
        backgroundColor: "#025600",
      },
    },
    user: {
      marginRight: "5px",
      "&:hover": {
        cursor: "pointer",
      },
    },
  })
);

const Productivity: FunctionComponent<any> = () => {
  const [users, setUsers] = useState<IUser[]>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError>();
  const classes = useStyles();

  const getUnassignedUsers = useCallback(async () => {
    setLoading(true);
    const [usersResponse, errorResponse] = await Api.GetUnassignedUsers();
    if (errorResponse) {
      setError(errorResponse);
    } else {
      setUsers(usersResponse);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getUnassignedUsers();
  }, [getUnassignedUsers]);

  if (isLoading) {
    return <ClipLoader size={150} color={"#123abc"} loading={isLoading} />;
  }

  if (error?.message) {
    return <h1>Error...</h1>;
  }

  return (
    <div>
      <Typography variant="h6" component="h1">
        PRODUCTIVITY
      </Typography>
      {users && users.length > 0 ? (
        <>
          <Typography variant="caption" component="div">
            The following users aren't assigned to any work order
          </Typography>
          <Typography variant="h6" component="div">
            {users?.map((user) => (
              <Tooltip key={user.id} title={user.email}>
                <Chip
                  data-test-id="unassigned-users"
                  className={classes.user}
                  label={user.name}
                />
              </Tooltip>
            ))}
          </Typography>
        </>
      ) : (
        <Typography variant="caption" component="div">
          *There's no user that isn't currently assigned to an open work order
        </Typography>
      )}
    </div>
  );
};

export default Productivity;
