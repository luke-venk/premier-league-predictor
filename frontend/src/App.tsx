import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Title from "./components/Title";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import MatchesPage from "./pages/MatchesPage";
import TablePage from "./pages/TablePage";
import AboutPage from "./pages/AboutPage";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <header className="header">
          <Title />
          <NavBar />
        </header>
        
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/table" element={<TablePage />} />
        
          <Route path="/matches" element={<MatchesPage />} />
        
          <Route path="/about" element={<AboutPage />} />
        
          <Route path="*" element={<ErrorPage />} />
        </Routes>

      </Router>
    </>
  );
}

export default App;
