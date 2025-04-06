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
    const notify = () => toast.error(message);
    notify();
  }, [message]);

  return (
    <div>
      <ToastContainer
        position={position}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable={true}
        theme='dark'
      />
    </div>
  );
};

export default Toast;
