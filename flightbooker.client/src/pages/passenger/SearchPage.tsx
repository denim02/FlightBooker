import { useLocation, useNavigate } from "react-router-dom";
import useFilteredRoutes from "../../hooks/use-filtered-routes";
import { useCallback, useEffect, useState } from "react";
import RouteResultCard from "../../components/passengers/RouteResultCard";
import {
  Button,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import { FilterOptions, SortingOption } from "../../stores/filtering-context";
import * as yup from "yup";
import RouteFiltersDesktop from "../../components/passengers/RouteFiltersDesktop";
import RouteFiltersMobile from "../../components/passengers/RouteFiltersMobile";
import { useAuth } from "../../hooks/use-auth";

const validationSchema = yup.object().shape({
  departureAirportCode: yup
    .string()
    .required("Departure airport is required")
    .test(
      "is-not-equal",
      "Departure airport and arrival airport must be different.",
      function (value, context) {
        return value !== context.parent.arrivalAirportCode;
      }
    ),
  arrivalAirportCode: yup
    .string()
    .required("Arrival airport is required")
    .test(
      "is-not-equal",
      "Departure airport and arrival airport must be different.",
      function (value, context) {
        return value !== context.parent.departureAirportCode;
      }
    ),
  departureDate: yup.date().required("Departure date is required"),
  isRoundTrip: yup.boolean().optional(),
  returnDate: yup
    .date()
    .optional()
    .test(
      "is-present-if-round-trip",
      "Return date is required for round trip",
      function (value, context) {
        return context.parent.isRoundTrip ? Boolean(value) : true;
      }
    )
    .test(
      "is-after",
      "Return date must be equal to or after the departure date.",
      function (value, context) {
        return context.parent.isRoundTrip
          ? value !== undefined
            ? value >= context.parent.departureDate
            : false
          : true;
      }
    ),
  seats: yup
    .number()
    .required("Number of passengers is required")
    .min(1, "At least 1 passenger is required"),
});

const SearchPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { filters, filtersChanged, setFilters, filteredData, isFetching, filtersSortingOption, changeSortingOption } =
    useFilteredRoutes("/routes/search");
  const [isMobileFiltersModalOpen, setIsMobileFiltersModalOpen] =
    useState(false);
  const [sortingOption, setSortingOption] = useState<SortingOption>({sortBy: "Price", sortOrder: "asc"});

  useEffect(() => {
    const params = new URLSearchParams(search);

    // Parse query parameters into a FilterOptions object
    const departureAirportCode = params.get("departureAirportCode");
    const arrivalAirportCode = params.get("arrivalAirportCode");
    const departureDate = params.get("departureDate");
    const isRoundTrip = params.get("isRoundTrip");
    const returnDate = params.get("returnDate");

    const seats = params.get("seats");
    const cabinClass = params.get("cabinClass");
    const sortBy = params.get("sortBy");
    const sortOrder = params.get("sortOrder");
    const directFlightsOnly = params.get("directFlightsOnly");

    setFilters({
      departureAirportCode: departureAirportCode || "",
      arrivalAirportCode: arrivalAirportCode || "",
      departureDate: new Date(departureDate || ""),
      returnDate: returnDate ? new Date(returnDate) : undefined,
      seats: seats ? parseInt(seats) : 1,
      isRoundTrip: isRoundTrip === "true",
      directFlightsOnly: directFlightsOnly === "true",
      cabinClass: cabinClass ? +cabinClass : "",
    });

    changeSortingOption({sortBy: sortBy as "Price" | "DepartureTime" | "Duration", sortOrder: sortOrder as "asc" | "desc"});
  }, [changeSortingOption, navigate, search, setFilters]);

  useEffect(() => {
    if(sortingOption != filtersSortingOption) {
      changeSortingOption(sortingOption);
    }
  }, [sortingOption, changeSortingOption, filtersSortingOption]);

  const formik = useFormik<FilterOptions>({
    initialValues: filters,
    validationSchema,
    onSubmit: async (values) => {
      const queryParams = new URLSearchParams({
        departureAirportCode: values.departureAirportCode,
        arrivalAirportCode: values.arrivalAirportCode,
        departureDate: values.departureDate.toLocaleDateString(),
        returnDate: values.returnDate?.toLocaleDateString() || "",
        seats: values.seats.toString(),
        isRoundTrip: values.isRoundTrip.toString(),
        directFlightsOnly: values.directFlightsOnly.toString(),
        cabinClass: values.cabinClass.toString() || "",
        sortBy: sortingOption.sortBy,
        sortOrder: sortingOption.sortOrder,
      });

      navigate({ pathname: "/search", search: queryParams.toString() });
    },
  });

  useEffect(() => {
    if (filtersChanged) formik.setValues(filters);
  }, [filtersChanged, filters]);

  const handleReserve = useCallback((routeId: number) => {
    if (!isAuthenticated()) 
      return navigate("/login", { state: { from: `/book/${routeId}` } });
    else
      navigate(`/book/${routeId}`);
  }, [isAuthenticated, navigate]);

  return (
    <Container className="mx-auto w-full">
      <Typography variant="h3" className="my-4 font-thin text-background">
        Search For Flights
      </Typography>
      <Divider />
      <Grid container className="py-5">
        <RouteFiltersDesktop formik={formik} />
        <RouteFiltersMobile
          formik={formik}
          open={isMobileFiltersModalOpen}
          onClose={() => setIsMobileFiltersModalOpen(false)}
        />
        <Grid item xs={12} className="block lg:hidden my-5">
          <Button
            className="w-full bg-primary h-16 text-xl"
            variant="contained"
            onClick={() => setIsMobileFiltersModalOpen(true)}
          >
            Show Filters
          </Button>
        </Grid>
        <Grid item className="space-y-4 mx-auto" lg={7}>
          {/* Sorting options */}
          <Select
            className="w-48"
            value={sortingOption.sortBy}
            onChange={(e) => {
              setSortingOption((prevState) => {
                return {...prevState, sortBy: e.target.value as "Price" | "DepartureTime" | "Duration"};
              })
            }
            }
            >
            <MenuItem value="Price">Price</MenuItem>
            <MenuItem value="DepartureTime">Departure Time</MenuItem>
            <MenuItem value="Duration">In-Flight Duration</MenuItem>
            </Select>
          <Select
            className="w-48"
            value={sortingOption.sortOrder}
            onChange={(e) => {
              setSortingOption((prevState) => {
                return {...prevState, sortOrder: e.target.value as "asc" | "desc"};
              })
            }
            }
            >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
            </Select>
          {isFetching ? (
            <Container className="max-w-2xl w-full h-full">
              <CircularProgress className="block" />
            </Container>
          ) : filteredData.length === 0 ? (
            <Typography variant="h5">No results found.</Typography>
          ) : (
            filteredData.map((routeResult) => (
              <RouteResultCard
                route={routeResult}
                key={routeResult.id}
                hasChosenCabinClass={filters.cabinClass != ""}
                onReserve={handleReserve}
              />
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;
