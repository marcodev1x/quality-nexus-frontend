import React from "react";
import styled from "styled-components";
import { FiLoader } from "react-icons/fi";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends React.ComponentProps<"button"> {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button = styled.button<ButtonProps>`
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.5rem 1rem";
      case "medium":
        return "0.625rem 1.25rem";
      case "large":
        return "0.75rem 1.5rem";
      default:
        return "0.625rem 1.25rem";
    }
  }};
  font-size: ${(props) => {
    switch (props.size) {
      case "small":
        return "0.875rem";
      case "large":
        return "1.125rem";
      default:
        return "1rem";
    }
  }};
  border-radius: 0.375rem;
  border: none;
  font-weight: 600;
  cursor: ${(props) =>
    props.disabled || props.loading ? "not-allowed" : "pointer"};
  transition: all 0.2s ease;
  background-color: ${(props) => {
    switch (props.variant) {
      case "secondary":
        return props.disabled ? "#cbd5e0" : "#a0aec0";
      case "outline":
        return "transparent";
      default:
        return props.disabled ? "#cbd5e0" : "#2ecc71";
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case "secondary":
        return "#f7fafc";
      case "outline":
        return "#2ecc71";
      default:
        return "#f7fafc";
    }
  }};
  border: ${(props) => {
    switch (props.variant) {
      case "outline":
        return "2px solid #2ecc71";
      default:
        return "none";
    }
  }};

  &:hover {
    ${(props) => {
      if (props.disabled || props.loading) return;
      switch (props.variant) {
        case "secondary":
          return "background-color: #81a1c1;";
        case "outline":
          return "background-color: rgba(46, 204, 113, 0.1);";
        default:
          return "background-color: #27ae60;";
      }
    }}
  }

  &:active {
    ${(props) => {
      if (props.disabled || props.loading) return;
      return "transform: translateY(1px);";
    }}
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.3);
  }

  ${(props) => {
    if (props.loading) {
      return `
        opacity: 0.9;
        pointer-events: none;
      `;
    }
  }}

  ${(props) => {
    if (props.disabled) {
      return `
        opacity: 0.6;
        pointer-events: none;
      `;
    }
  }}
`;

const ComponentButton: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  loading = false,
  icon,
  type = "button",
  ...props
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <FiLoader className="animate-spin" />}
      {icon}
      {label}
    </Button>
  );
};

export default ComponentButton;
