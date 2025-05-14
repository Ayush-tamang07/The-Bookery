import React, { useEffect } from "react";
import { startSignalRConnection } from "./Notifaction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  useEffect(() => {
    startSignalRConnection((msg) => {
      // Show incoming message as toast
      toast.info(msg, {
        toastId: msg, // prevent duplicate toasts if message is the same
      });
    });
  }, []);

  return null; // no visible UI
};

export default Notification;
