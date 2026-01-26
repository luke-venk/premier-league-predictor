import type { ReactNode } from "react";
import "./Button.css";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: "blue" | "green";
  size?: "small" | "large";
  className?: string;
}

const Button = ({
  children,
  onClick,
  disabled,
  color = "green",
  size = "large",
  className,
}: Props) => {
  return (
    <button
      className={`btn btn-${color} btn-${size} ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
