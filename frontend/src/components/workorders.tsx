import React, { FunctionComponent, useEffect, useState } from "react";
import WorkOrderTable from "./workorder_table";
import Typography from "@material-ui/core/Typography";
import Api from "../services/api";
import { IWorkOrder, IError } from "../services/api/api";
import { withRouter } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const WorkOrders: FunctionComponent<any> = (props) => {
  const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<IError>();

  const getWorkOrders = async () => {
    const [workOrdersReponse, errorResponse] = await Api.GetWorkOrders();
    if (errorResponse) {
      setError(errorResponse);
    } else {
      setWorkOrders(workOrdersReponse);
    }
    setLoading(false);
  };

  const goToDetails = (id: number) => {
    props.history.push(`/workorders/${id}`);
  };

  useEffect(() => {
    getWorkOrders();
  }, []);

  if (isLoading) {
    return <ClipLoader size={150} color={"#123abc"} loading={isLoading} />;
  }

  if (error?.message) {
    return <h1>Error...</h1>;
  }

  return (
    <div style={{ paddingBottom: "150px" }}>
      <Typography variant="h6" component="h1">
        WORK ORDERS
      </Typography>
      <WorkOrderTable data={workOrders} onRowClick={goToDetails} />
    </div>
  );
};

export default withRouter(WorkOrders);
