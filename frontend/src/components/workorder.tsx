import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import Api from "../services/api";
import { IWorkOrder, IError } from "../services/api/api";
import ClipLoader from "react-spinners/ClipLoader";
import { RouteComponentProps } from "react-router-dom";

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginTop: "20px",
      backgroundColor: "#0256af",
      "&:hover": {
        backgroundColor: "#025600",
      },
    },
    assignee: {
      marginRight: "5px",
      "&:hover": {
        cursor: "pointer",
      },
    },
  })
);
interface MatchParams {
  id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}

const WorkOrders: FunctionComponent<IProps> = ({
  match: {
    params: { id },
  },
}) => {
  const [workOrder, setWorkOrder] = useState<IWorkOrder>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isUpdatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [error, setError] = useState<IError>();
  const classes = useStyles();

  const getWorkOrderByID = useCallback(async () => {
    setLoading(true);
    const [workOrderReponse, errorResponse] = await Api.GetWorkOrderByID(id);
    if (errorResponse) {
      setError(errorResponse);
    } else {
      setWorkOrder(workOrderReponse);
    }
    setLoading(false);
  }, [id]);

  const updateWorkOrderStatusByID = async () => {
    setUpdatingStatus(true);
    const newStatus = workOrder?.status === "CLOSED" ? "OPEN" : "CLOSED";
    const [errorResponse] = await Api.UpdateWorkOrderStatus(id, newStatus);
    if (errorResponse) {
      setError(errorResponse);
    } else {
      if (workOrder) {
        setWorkOrder({
          id: workOrder.id,
          name: workOrder.name,
          assignees: workOrder.assignees,
          status: workOrder.status === "CLOSED" ? "OPEN" : "CLOSED",
        });
      }
    }
    setUpdatingStatus(false);
  };

  useEffect(() => {
    getWorkOrderByID();
  }, [getWorkOrderByID]);

  if (isLoading) {
    return <ClipLoader size={150} color={"#123abc"} loading={isLoading} />;
  }

  if (error?.message) {
    return <h1>Error...</h1>;
  }

  return (
    <div>
      <Typography variant="h6" component="h1">
        WORK ORDER DETAILS
      </Typography>
      <Typography variant="h6" component="div">
        Name: {workOrder?.name}
      </Typography>
      <Typography variant="h6" component="div">
        Status: {workOrder?.status.toUpperCase()}
      </Typography>
      {workOrder && workOrder.assignees && workOrder.assignees.length > 0 ? (
        <Typography variant="h6" component="div">
          Assignees:{" "}
          {workOrder?.assignees?.map((assignee) => (
            <Tooltip key={assignee.id} title={assignee.email}>
              <Chip className={classes.assignee} label={assignee.name} />
            </Tooltip>
          ))}
        </Typography>
      ) : (
        <Typography variant="caption" component="div">
          *No one is assigneed to this work order
        </Typography>
      )}
      <Button
        data-test-id="toggle-work-order-status"
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        onClick={updateWorkOrderStatusByID}
      >
        {workOrder?.status === "CLOSED"
          ? "OPEN WORK ORDER"
          : "CLOSE WORK ORDER"}
        <span style={{ marginLeft: "10px" }}>
          <ClipLoader size={30} color={"#123abc"} loading={isUpdatingStatus} />
        </span>
      </Button>
    </div>
  );
};

export default WorkOrders;
