import NavButton from '../components/NavButton';
import "./ErrorPage.css";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>Error 404. Page Not Found.</h1>
      <NavButton link="/">Return Home</NavButton>
    </div>
  )
}

export default ErrorPage;