import { Routes, Route } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { JobProvider } from "./state/JobProvider.tsx";
import { useSimulations } from "./state/SimulationProvider.tsx";
import Title from "./components/Title";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import MatchesPage from "./pages/MatchesPage";
import TablePage from "./pages/TablePage";
import AboutPage from "./pages/AboutPage";
import ErrorPage from "./pages/ErrorPage";
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/table" element={<TablePage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

function App() {
  // Function to update the simulation store.
  const { refresh } = useSimulations();

  // Function to update the search params when a simulation completes.
  const [searchParams, setSearchParams] = useSearchParams();
  const onSimComplete = (simId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("simulation", String(simId));
    setSearchParams(next);
  };

  return (
    <>
      <header className="header">
        <Title />
        <NavBar />
      </header>

      <JobProvider
        refreshSimulations={refresh}
        onSimulationCompleted={onSimComplete}
      >
        <AppRoutes />
      </JobProvider>
    </>
  );
}

export default App;
