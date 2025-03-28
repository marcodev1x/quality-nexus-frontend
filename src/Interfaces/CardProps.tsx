import React from "react";

export interface CardProps extends React.ComponentProps<"div"> {
  title: string;
  to: string;
  icon: React.ReactNode;
  description: string;
  button: React.ReactNode;
}

