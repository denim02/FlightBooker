import { useCallback, useContext, useEffect, useState } from "react";
import FilteringContext, { FilterOptions } from "../stores/filtering-context";
import axiosInstance from "../utils/axios";

const useFilteredRoutes = (apiUrl: string) => {
  const {
    filteredData,
    filters,
    filtersChanged,
    filtersSortingOption,
    setFilters,
    changeSortingOption,
    setFilteredData,
  } = useContext(FilteringContext);
  const [isFetching, setIsFetching] = useState(false);

  const fetchFilteredData = useCallback(
    async (filters: FilterOptions) => {
      try {
        // Construct query parameters based on filter options
        const queryParams = new URLSearchParams({
          departureAirportCode: filters.departureAirportCode,
          arrivalAirportCode: filters.arrivalAirportCode,
          departureDate: filters.departureDate.toLocaleString(),
          returnDate: filters.returnDate?.toLocaleString() || "",
          seats: filters.seats.toString(),
          isRoundTrip: filters.isRoundTrip.toString(),
          directFlightsOnly: filters.directFlightsOnly.toString(),
          cabinClass: filters.cabinClass ? filters.cabinClass.toString() : "",
        });

        const response = await axiosInstance.get(`${apiUrl}?${queryParams}`);

        return response.data;
      } catch (error) {
        if (error instanceof Error)
          throw new Error("Failed to fetch filtered data: " + error.message);
      }
    },
    [apiUrl]
  );

  const setNewFilters = useCallback((filters: FilterOptions) => {
    setFilters(filters);
  }, [setFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const data = await fetchFilteredData(filters);
        setFilteredData(data); // Update context with new filtered data
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
      finally {
        setIsFetching(false);
      }
    };

    if (filtersChanged)
      fetchData();
  }, [fetchFilteredData, filtersChanged, filters, setFilteredData]);

  return {
    isFetching,
    filteredData,
    filters,
    filtersSortingOption,
    filtersChanged,
    setFilters: setNewFilters,
    changeSortingOption,
  };
};

export default useFilteredRoutes;
