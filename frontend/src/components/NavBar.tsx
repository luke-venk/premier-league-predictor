import { useSearchParams } from "react-router-dom";
import NavButton from "./NavButton";
import "./NavBar.css"

const NavBar = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  const suffix = search ? `?${search}` : "";

  return (
    <div className="navbar">
      <div className="button-group">
        <NavButton link={`/${suffix}`}>Home</NavButton>
        <NavButton link={`/matches${suffix}`}>Matches</NavButton>
        <NavButton link={`/table${suffix}`}>Table</NavButton>
        <NavButton link={`/about${suffix}`}>About</NavButton>
      </div>
    </div>
  );
};

export default NavBar;
