import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Divider,
  Typography,
  DialogContentText,
  Grid,
} from "@mui/material";
import { FlightRoute } from "../../models/tables/FlightRoute";
import { FC, useCallback } from "react";
import axiosInstance from "../../utils/axios";

export interface DeleteRowDialogProps {
  open: boolean;
  onClose: () => void;
  route: FlightRoute;
}

const DeleteRowDialog: FC<DeleteRowDialogProps> = ({
  open,
  onClose,
  route,
}) => {
  const deleteEntireRouteGroup = useCallback(async () => {
    try {
      await axiosInstance.delete(`/routes/group/${route.routeGroupId}`);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [onClose, route.routeGroupId]);

  const deleteRow = useCallback(async () => {
    try {
      await axiosInstance.delete(`/routes/${route.id}`);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [onClose, route.id]);

  return (
    <Dialog open={open} onClose={() => onClose()} className="max-h-[100%]">
      <DialogTitle className="text-3xl text-background">
        Delete Route
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText className="text-black">
          Are you sure you want to delete the route with id <span className="font-bold">{route.id}</span>? This
          action cannot be undone. Additionally, any associated flights and
          reservations will be removed.
          {route.hasReservations && (
            <span className="text-red-500">
              This route currently has reservations.
            </span>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="space-between" alignItems="center">
          <Button onClick={() => onClose()}>Cancel</Button>
          <Grid item>
            <Button
              variant="contained"
              className="bg-background hover:bg-primary text-white mr-5"
              onClick={deleteEntireRouteGroup}
            >
              <Typography>Delete all associated routes</Typography>
            </Button>
            <Button
              variant="contained"
              className="bg-background hover:bg-primary text-white"
              onClick={deleteRow}
            >
              <Typography>Delete this route</Typography>
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRowDialog;
