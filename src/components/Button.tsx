import React from "react";
import styled from "styled-components";
import { FiLoader } from "react-icons/fi";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends React.ComponentProps<"button"> {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #2ecc71;
  color: #f7fafc;

  &.small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &.large {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  &.secondary {
    background-color: #222;
    color: #f7fafc;
  }

  &.outline {
    background-color: transparent;
    color: #2ecc71;
    border: 2px solid #2ecc71;
  }

  &:hover:not(.disabled):not(.loading) {
    background-color: #27ae60;
  }

  &:active:not(.disabled):not(.loading) {
    transform: translateY(1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.3);
  }

  &.loading {
    opacity: 0.9;
    pointer-events: none;
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
    cursor: not-allowed;
  }
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
  const classNames = [
    size,
    variant,
    disabled ? "disabled" : "",
    loading ? "loading" : "",
  ].join(" ");

  return (
    <Button
      type={type}
      className={classNames}
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
