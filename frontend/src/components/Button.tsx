import type { ReactNode } from "react";
import "./Button.css"

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

const Button = ({ children, onClick }: Props) => {
  return <button className="btn" onClick={onClick}>{children}</button>;
};

export default Button;
