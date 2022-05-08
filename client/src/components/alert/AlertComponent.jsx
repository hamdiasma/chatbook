import React from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import Toast from "./Toast";
import { alertAction } from "../../redux/actions/alert";

const NotifyAlert = () => {
  const state = useSelector((state) => state);
  const { alert } = state;
  const dispatch = useDispatch();
  const handelShow = () => {
    dispatch(alertAction({}));
  };
  return (
    <div>
      {alert.loading && <Loading />}
      {alert.success && (
        <Toast
          msg={alert.success}
          handelSHow={handelShow}
          bgColor="bg-success"
        />
      )}
      {alert.error && (
        <Toast msg={alert.error} handelSHow={handelShow} bgColor="bg-danger" />
      )}
    </div>
  );
};

NotifyAlert.propTypes = {
  alert: PropTypes.object,
};

export default NotifyAlert;
