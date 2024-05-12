import {
  Box,
  ListItemText,
  List,
  ListItem,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import React, { useImperativeHandle, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { LabeledObject } from "../../models/tables/LabeledObject";

type MultiSelectProps = {
  entryTypeLabel: string;
  entries: LabeledObject[];
  currentEntries?: LabeledObject[];
};

export type MultiSelectHandle = {
  getSelectedEntriesIds: () => (string | number)[];
  clearMultiSelect: () => void;
};

const MultiSelect = React.forwardRef<MultiSelectHandle, MultiSelectProps>(
  ({ entryTypeLabel, entries, currentEntries }, ref) => {
    const [selectedEntries, setSelectedEntries] = useState<LabeledObject[]>(
      currentEntries ?? []
    );
    const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => {
        return {
          getSelectedEntriesIds() {
            return selectedEntries.map((entry) => entry.id);
          },
          clearMultiSelect() {
            setSelectedEntries([]);
          },
        };
      },
      [selectedEntries]
    );

    const handleAddSelection = (entry: LabeledObject) => {
      setSelectedEntries([...selectedEntries, entry]);
    };

    const handleRemoveSelection = (index: number) => {
      setSelectedEntries(selectedEntries.filter((_, i) => i !== index));
    };

    const retrieveUnselectedEntries = () => {
      return entries.filter(
        (entry) => !selectedEntries.some((e) => e.id === entry.id)
      );
    };

    return (
      <Box className="mx-2">
        <Button className="px-0" onClick={() => setIsAddEntryDialogOpen(true)}>
          Add {entryTypeLabel}
        </Button>

        <List
          className="w-full"
          sx={{
            borderTop: "1px solid #BBB",
          }}
        >
          {selectedEntries.map((entry, index) => (
            <ListItem
              key={index}
              className="flex justify-between w-full px-0 mx-0"
            >
              <ListItemText primary={entry.label} />
              <IconButton onClick={() => handleRemoveSelection(index)}>
                <ClearIcon className="text-lg" />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Dialog
          open={isAddEntryDialogOpen}
          onClose={() => setIsAddEntryDialogOpen(false)}
        >
          <DialogTitle className="text-xl text-background">
            Add New {entryTypeLabel}
          </DialogTitle>
          <DialogContent>
            <List className="w-full">
              {retrieveUnselectedEntries().length !== 0 ? (
                retrieveUnselectedEntries().map((entry) => (
                  <ListItem
                    key={entry.id}
                    className="flex justify-between w-full px-0 mx-0"
                  >
                    <ListItemText primary={entry.label} />
                    <IconButton onClick={() => handleAddSelection(entry)}>
                      <AddIcon className="text-lg" />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <Typography>No {entryTypeLabel} available to add.</Typography>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddEntryDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
);

export default MultiSelect;
