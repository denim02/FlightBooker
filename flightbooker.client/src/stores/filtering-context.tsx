import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { RouteResultDTO } from "../models/DTOs/RouteResultDTO";
import { CabinClass } from "../models/CabinClass";

export type FilterOptions = {
  departureAirportCode: string;
  arrivalAirportCode: string;
  departureDate: Date; 
  returnDate?: Date;
  seats: number;
  isRoundTrip: boolean;
  directFlightsOnly: boolean;
  cabinClass: CabinClass | string;
};

export type SortingOption = {
  sortBy: "Price" | "DepartureTime" | "Duration";
  sortOrder: "asc" | "desc";
};

export const INITIAL_FILTERS: FilterOptions = {
  departureAirportCode: "",
  arrivalAirportCode: "",
  departureDate: new Date(),
  seats: 1,
  isRoundTrip: false,
  directFlightsOnly: false,
  cabinClass: "",
};

type FilterContextData = {
  filteredData: RouteResultDTO[];
  filters: FilterOptions;
  sortingOption: SortingOption;
  filtersChanged: boolean;
};

const INITIAL_STATE: FilterContextData = {
  filteredData: [],
  filters: INITIAL_FILTERS,
  sortingOption: {
    sortBy: "Price",
    sortOrder: "asc",
  },
  filtersChanged: false,
};

enum ActionType {
  SetFilters,
  ChangeSortingOption,
  SetFilteredData,
}

type Action = {
  type: ActionType;
  payload: FilterOptions | SortingOption | RouteResultDTO[];
};

const sortData = (data: RouteResultDTO[], sortingOption: SortingOption) => {
  return data.sort((a, b) => {
    if (sortingOption.sortBy === "Price") {
      return sortingOption.sortOrder === "asc"
        ? a.pricePerSeat - b.pricePerSeat
        : b.pricePerSeat - a.pricePerSeat;
    } else if (sortingOption.sortBy === "DepartureTime") {
      return sortingOption.sortOrder === "asc"
        ? new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
        : new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime();
    } else {
      return sortingOption.sortOrder === "asc"
        ? +a.duration - (+b.duration)
        : +b.duration - (+a.duration);
    }
  });
}

const reducer = (state: FilterContextData, action: Action) => {
  switch (action.type) {
    case ActionType.SetFilters:
      return { ...state, filters: action.payload as FilterOptions, filtersChanged: true};
    case ActionType.ChangeSortingOption: {
      const newSortingOption = action.payload as SortingOption;
      const sortedData = sortData(state.filteredData, newSortingOption);
      return {
        ...state,
        filteredData: sortedData,
        sortingOption: action.payload as SortingOption,
      };
    }
    case ActionType.SetFilteredData: {
      const data = action.payload as RouteResultDTO[];
      const sortedData = sortData(data, state.sortingOption);
      return { ...state, filteredData: sortedData};
    }
    default:
      return state;
  }
};

type FilteringContextType = {
  filteredData: RouteResultDTO[];
  filters: FilterOptions;
  filtersChanged: boolean;
  filtersSortingOption: SortingOption;
  setFilters: (newFilters: FilterOptions) => void;
  changeSortingOption: (newSortingOption: SortingOption) => void;
  setFilteredData: (newFilteredData: RouteResultDTO[]) => void;
};

const FilteringContext = createContext<FilteringContextType>(
  {} as FilteringContextType
);

const FilteringProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setFilters = useCallback((newFilters: FilterOptions) => {
    dispatch({ type: ActionType.SetFilters, payload: newFilters });
  }, []);

  const changeSortingOption = useCallback((newSortingOption: SortingOption) => {
    dispatch({
      type: ActionType.ChangeSortingOption,
      payload: newSortingOption,
    });
  }, []);

  const setFilteredData = useCallback((newFilteredData: RouteResultDTO[]) => {
    dispatch({ type: ActionType.SetFilteredData, payload: newFilteredData });
  }, []);

  const contextValue = useMemo(() => ({
    filters: state.filters,
    filteredData: state.filteredData,
    filtersChanged: state.filtersChanged,
    filtersSortingOption: state.sortingOption,
    setFilters,
    setFilteredData,
    changeSortingOption,
  }), [changeSortingOption, setFilteredData, setFilters, state.filteredData, state.filters, state.filtersChanged, state.sortingOption]);


  return (
    <FilteringContext.Provider
      value={contextValue}
    >
      {children}
    </FilteringContext.Provider>
  );
};

export default FilteringContext;
export { FilteringProvider };
