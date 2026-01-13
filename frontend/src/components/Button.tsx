import type { ReactNode } from "react";
import "./Button.css";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, className, disabled }: Props) => {
  return (
    <button
      className={className ? `btn ${className}` : "btn"}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
