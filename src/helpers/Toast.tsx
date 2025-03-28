import React from "react";
import { ToastContainer, toast } from "react-toastify";

const Toast = ({ message }: { message: string }) => {
  React.useEffect(() => {
    const notify = () => toast(message);
    notify();
  }, [message]);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Toast;
