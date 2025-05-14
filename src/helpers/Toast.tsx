import React from "react";
import { ToastContainer, ToastPosition, toast } from "react-toastify";
import styled from "styled-components";

const ToastContainerStyle = styled(ToastContainer)`
  .Toastify__toast {
    min-width: 300px;
    max-width: 500px;
    padding: 16px;
    font-size: 16px;
    display: flex;
    gap: 16px;
  }
`;

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
      <ToastContainerStyle
        position={position}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        draggable={true}
        theme='colored'
      />
    </div>
  );
};

export default Toast;
