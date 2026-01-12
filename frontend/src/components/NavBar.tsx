import NavButton from "./NavButton";
import "./NavBar.css"

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="button-group">
        <NavButton link="/">Home</NavButton>
        <NavButton link="/matches">Matches</NavButton>
        <NavButton link="/table">Table</NavButton>
        <NavButton link="/about">About</NavButton>
      </div>
    </div>
  );
};

export default NavBar;
