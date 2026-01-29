import plPredictorTitle from '../assets/pl-predictor-title.png'
import { Link } from "react-router-dom";
import "./Title.css";

const Title = () => {
  return (
    <Link to="/">
      <div className='title'>
        <img src={plPredictorTitle} className='logo' alt='Premier League logo'></img>
        <h1 className='title-text'>Predictor</h1>
      </div>
    </Link>
  )
}

export default Title