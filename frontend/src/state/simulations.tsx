import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Simulation } from "../types/simulation";

// Define what lives inside the context for TypeScript.
type SimulationsContextValue = {
  simulations: Simulation[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<Simulation[]>;
  setSimulations: React.Dispatch<React.SetStateAction<Simulation[]>>;
};

// Initialize the simulations context to null.
const SimulationsContext = createContext<SimulationsContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refreshing should reload the list of simulations from the
  // /simulations endpoint.
  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/simulations");
      if (!res.ok) {
        throw new Error("Failed to fetch simulations");
      } else {
        const data: Simulation[] = await res.json();
        setSimulations(data);
        return data;
      }
    } catch (e: any) {
      setError(e.message ?? "Unknown error.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load once for the app.
  useEffect(() => {
    refresh();
  }, [refresh])

  // Only recreate this object if its contents actually change.
  const value = useMemo(
    () => ({ simulations, loading, error, refresh, setSimulations }),
    [simulations, loading, error, refresh]
  );

  return <SimulationsContext.Provider value={value}>{children}</SimulationsContext.Provider>;
}

export function useSimulations() {
  const ctx = useContext(SimulationsContext);
  if (!ctx) throw new Error("useSimulations must be used within SimulationsProvider");
  return ctx;
}