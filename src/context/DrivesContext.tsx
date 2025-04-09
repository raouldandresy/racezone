import { createContext, ReactNode } from 'react';
import { Driver } from '../types/Driver';
import useFetch from '../hooks/useFetch';

interface DriversContextType {
  data: Driver[];
  loading: boolean;
  error: string | null;
}

interface DriversProviderProps {
  children: ReactNode;
}

export const DriversContext = createContext<DriversContextType | undefined>(undefined);

export const DriversProvider: React.FC<DriversProviderProps> = ({ children }) => {

  const { data, loading, error } = useFetch('https://api.openf1.org/v1/drivers?session_key=latest');

  return (
    <DriversContext.Provider value={{ data, loading, error }}>
      {children}
    </DriversContext.Provider>
  );
};
