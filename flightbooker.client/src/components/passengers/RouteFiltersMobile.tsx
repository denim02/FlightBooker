import {
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
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
  open: boolean;
  onClose: () => void;
};

const RouteFiltersMobile = ({
  formik,
  open,
  onClose,
}: RouteFiltersDesktopProps) => {
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
    <Dialog
      open={open}
      onClose={() => onClose()}
      className="block lg:hidden max-h-[100%]"
    >
      <form
        onSubmit={(e) => {
          onClose();
          handleSubmit(e);
        }}
      >
        <DialogTitle className="text-3xl text-background">
          Route Filters
        </DialogTitle>
        <Divider />
        <DialogContent className="space-y-6 overflow-hidden py-3">
          <AsyncSelect<FilterOptions>
            errors={errors}
            touched={touched}
            fetchOptions={fetchAirports}
            name="departureAirportCode"
            label="Departure Airport"
            value={values.departureAirportCode}
            className="w-3/4 sm:w-5/6"
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
            className="w-3/4 sm:w-5/6"
            value={values.arrivalAirportCode}
            handleChange={(newValue: string | number | null) => {
              setFieldValue("arrivalAirportCode", newValue);
            }}
          />
          <div className="space-y-6 sm:space-y-0 sm:space-x-5">
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
                    errors={errors}
                    touched={touched}
                  />
                ),
              }}
              disablePast
            />
          </div>
          <TextField
            label="Number of Passengers"
            type="number"
            name="seats"
            value={values.seats}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.seats && Boolean(errors.seats)}
            helperText={touched.seats && errors.seats}
            sx={{
              input: {
                background: "white",
              },
            }}
          />
          <FormControlLabel
            className="md:ml-5"
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
              value={values.cabinClass}
              className="w-36"
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
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            disabled={!isValid || isSubmitting}
            type="submit"
            className="bg-background hover:bg-primary text-white disabled:bg-gray-500"
            fullWidth
          >
            <Typography>Filter</Typography>
            {isSubmitting ? (
              <CircularProgress className="text-white ml-5" size={15} />
            ) : null}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RouteFiltersMobile;
