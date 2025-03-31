import React from "react";

interface ButtonProps extends React.ComponentProps<"button"> {
  size?: string;
  label?: string;
  variant?: string;
}

export default ButtonProps;
