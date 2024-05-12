import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { FilterOptions } from "../../stores/filtering-context";
import AsyncSelect from "../core/AsyncSelect";
import ComplexTextField from "../core/ComplexTextField";
import { FormikProps } from "formik";
import { fetchAirports } from "../../pages/passenger/api";
import { CabinClass } from "../../models/CabinClass";

type RouteFiltersDesktopProps = {
  formik: FormikProps<FilterOptions>;
};

const RouteFiltersDesktop = ({ formik }: RouteFiltersDesktopProps) => {
  const {
    values,
    touched,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  return (
    <Grid
      item
      lg={4}
      className="hidden lg:block w-full bg-gray-100 border border-solid border-primary drop-shadow-md py-5"
    >
      <Box>
        <form onSubmit={handleSubmit} className="space-y-5 grid justify-center">
          <AsyncSelect<FilterOptions>
            errors={errors}
            touched={touched}
            fetchOptions={fetchAirports}
            name="departureAirportCode"
            label="Departure Airport"
            value={values.departureAirportCode}
            handleChange={(newValue: string | number | null) => {
              setFieldValue("departureAirportCode", newValue);
            }}
          />
          <AsyncSelect<FilterOptions>
            errors={errors}
            touched={touched}
            fetchOptions={fetchAirports}
            name="arrivalAirportCode"
            label="Arrival Airport"
            value={values.arrivalAirportCode}
            handleChange={(newValue: string | number | null) => {
              setFieldValue("arrivalAirportCode", newValue);
            }}
          />
          <DatePicker
            label="Departure Date"
            value={dayjs(values.departureDate)}
            name="departureDate"
            onChange={(date) => {
              setFieldValue("departureDate", date?.toDate());
            }}
            slots={{
              textField: (params) => (
                <ComplexTextField
                  {...params}
                  className="bg-white"
                  errors={errors}
                  touched={touched}
                />
              ),
            }}
            disablePast
          />
          <DatePicker
            label="Return Date"
            value={dayjs(values.returnDate)}
            name="returnDate"
            disabled={values.isRoundTrip === false}
            onChange={(date) => setFieldValue("returnDate", date?.toDate())}
            slots={{
              textField: (params) => (
                <ComplexTextField
                  {...params}
                  className="bg-white"
                  errors={errors}
                  touched={touched}
                />
              ),
            }}
            disablePast
          />
          <TextField
            label="Number of Passengers"
            type="number"
            name="seats"
            value={values.seats}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-white"
            error={touched.seats && Boolean(errors.seats)}
            helperText={touched.seats && errors.seats}
          />
          <FormControlLabel
            control={
              <Switch
                name="isRoundTrip"
                checked={values.isRoundTrip}
                onChange={handleChange}
              />
            }
            label="Round Trip?"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="directFlightsOnly"
                checked={values.directFlightsOnly}
                onChange={handleChange}
              />
            }
            label="Direct Flights Only?"
          />
          <FormControl>
            <InputLabel id="cabinClass-label">Cabin Class</InputLabel>
            <Select
              labelId="cabinClass-label"
              label="Cabin Class"
              name="cabinClass"
              onChange={handleChange}
              className="w-36 bg-white"
              value={values.cabinClass}
            >
              <MenuItem value="">Any Class</MenuItem>
              <MenuItem value={CabinClass.Economy}>Economy</MenuItem>
              <MenuItem value={CabinClass.Business}>Business</MenuItem>
              <MenuItem value={CabinClass.FirstClass}>First</MenuItem>
              <MenuItem value={CabinClass.PremiumEconomy}>
                Premium Economy
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            disabled={!isValid || isSubmitting}
            type="submit"
            className="bg-background hover:bg-primary text-white disabled:bg-gray-500"
          >
            <Typography>Search</Typography>
            {isSubmitting ? (
              <CircularProgress className="text-white ml-5" size={15} />
            ) : null}
          </Button>
        </form>
      </Box>
    </Grid>
  );
};

export default RouteFiltersDesktop;
