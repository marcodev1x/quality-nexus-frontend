import React from "react";
import { ToastContainer, toast } from "react-toastify";

const ToastSuccess = ({ message }: { message: string }) => {
  React.useEffect(() => {
    const notify = () => toast.success(message);
    notify();
  }, [message]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        closeButton={false}
      />
    </div>
  );
};

export default ToastSuccess;
