import React from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";

const Toast = ({
  message,
  position,
}: {
  message: string;
  position?: ToastPosition;
}) => {
  React.useEffect(() => {
    const notify = () => toast(message);
    notify();
  }, [message]);

  return (
    <div>
      <ToastContainer
        style={{ padding: "1rem" }}
        position={position}
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
    </div>
  );
};

export default Toast;
