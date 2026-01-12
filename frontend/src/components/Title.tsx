import premierLeagueLogo from '../assets/premier-league.svg'
import { Link } from "react-router-dom";
import "./Title.css";

const Title = () => {
  return (
    <Link to="/">
      <div className='title'>
        <img src={premierLeagueLogo} className='logo' alt='Premier League logo'></img>
        <h1 className='title-text'>Predictor</h1>
      </div>
    </Link>
  )
}

export default Title