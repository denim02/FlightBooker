import {
    createContext,
    useState,
    useMemo,
    PropsWithChildren,
} from "react";
import { Airline } from "../models/tables/Airline";

interface AirlineContextType {
    airline: Airline | null;
    setAirline: (airline: Airline | null) => void;
}

const AirlineContext = createContext<AirlineContextType>({} as AirlineContextType);

const AirlineProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [airline, setAirline] = useState<Airline | null>(null);

    const contextValue = useMemo(() => ({
        airline,
        setAirline
    }), [airline]);

    return (
        <AirlineContext.Provider value={contextValue}>
            {children}
        </AirlineContext.Provider>
    );
};

export default AirlineContext;
export { AirlineProvider };
