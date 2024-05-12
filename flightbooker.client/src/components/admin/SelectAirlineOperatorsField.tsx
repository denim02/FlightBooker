import React, {
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { AirlineOperatorData } from "../../models/DTOs/AirlineOperatorData";
import MultiSelect, { MultiSelectHandle } from "../core/MultiSelect";

export type SelectAirlineOperatorsFieldHandle = {
  getSelectedOperatorIds: () => (number | string)[];
  clearField: () => void;
};

interface SelectAirlineOperatorsFieldProps {
  operators: AirlineOperatorData[];
  airlineId?: number;
}

const SelectAirlineOperatorsField = React.forwardRef<
  SelectAirlineOperatorsFieldHandle,
  SelectAirlineOperatorsFieldProps
>(({ airlineId, operators }, ref) => {
  const multiSelectHandle = useRef<MultiSelectHandle>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        getSelectedOperatorIds() {
          return multiSelectHandle.current?.getSelectedEntriesIds() ?? [];
        },
        clearField() {
          multiSelectHandle.current?.clearMultiSelect();
        },
      };
    },
    []
  );

  const operatorsForCurrentAirline = useMemo(() => {
    return operators.filter((o) => o.airlineId === airlineId);
  }, [airlineId, operators]);

  const selectableOperators = useMemo(() => {
    return operators.filter(
      (o) => o.airlineId === airlineId || o.airlineId === null
    );
  }, [airlineId, operators]);

  const entriesToLabeledObject = useCallback((ops: AirlineOperatorData[]) => {
    return ops.map((o) => ({ ...o, label: o.firstName + " " + o.lastName }));
  }, []);

  return (
    <MultiSelect
      ref={multiSelectHandle}
      entryTypeLabel={"Airline Operator"}
      entries={entriesToLabeledObject(selectableOperators)}
      currentEntries={
        airlineId
          ? entriesToLabeledObject(operatorsForCurrentAirline)
          : undefined
      }
    />
  );
});

export default SelectAirlineOperatorsField;
