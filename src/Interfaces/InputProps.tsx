import React from "react";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  name?: string;
  type?: string;
  labelColor?: string;
  value?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}
