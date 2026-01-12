import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "./NavButton.css";

interface Props {
  children: ReactNode;
  link: string;
}

const NavButton = ({ children, link }: Props) => {
  return (
    <NavLink
      to={link}
      end
      className={({ isActive }) => (isActive ? "btn btn-active" : "btn")}
    >
      {children}
    </NavLink>
  );
};

export default NavButton;
