import { FC, useMemo } from "react";
import { RowSeatClassMapping } from "../../models/DTOs/SeatConfigurationData";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { getCabinClassColor } from "../../models/CabinClass";

interface SeatingChartProps {
  columns: number;
  rows: number;
  cabinClassMappings: RowSeatClassMapping[] | undefined;
  seatColorRule:
    | ((rowIndex: number, columnIndex: number) => string)
    | undefined;
  onClickSeat: ((rowIndex: number, columnIndex: number) => void) | undefined;
}

const SeatingChart: FC<SeatingChartProps> = ({
  columns,
  rows,
  cabinClassMappings,
  seatColorRule,
  onClickSeat,
}: SeatingChartProps) => {
  const columnsLayout = useMemo(() => {
    if (columns < 2 || columns > 9) {
      return [];
    }
    switch(columns) {
      case 2:
        return [1, 1];
      case 3:
        return [1, 1, 1];
      case 4:
        return [2, 2];
      case 5:
        return [2, 1, 2];
      case 6:
        return [2, 2, 2];
      case 7:
        return [2, 3, 2];
      case 8:
        return [3, 2, 3];
      case 9:
        return [3, 3, 3];
      default:
        return [];
    }
  }, [columns]);

  const seatColorCallback = useMemo(() => {
    if (seatColorRule) return seatColorRule;
    else if (cabinClassMappings)
      return (rowIndex: number) => {
        const mapping = cabinClassMappings.find((e) =>
          e.rows.includes(rowIndex)
        );
        return mapping ? getCabinClassColor(mapping.seatClass) : "inherit";
      };
    else return () => "inherit";
  }, [cabinClassMappings, seatColorRule]);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      spacing={0}
      className="gap-x-2 md:gap-x-6"
    >
      {columnsLayout.map((nrOfInnerCols, colGroupIndex) => (
        <Grid
          key={colGroupIndex}
          item
          sx={{
            borderLeftWidth: colGroupIndex === 0 ? "2px" : "0px",
            borderRightWidth:
              colGroupIndex === columnsLayout.length - 1 ? "2px" : "0px",
            borderLeftColor: "black",
            borderRightColor: "black",
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            padding: "0px 10px",
            borderRadius: "5px",
          }}
        >
          <Grid container className="gap-x-0">
            {Array.from({ length: nrOfInnerCols }).map(
              (_, innerColGroupIndex) => (
                <Grid key={innerColGroupIndex} item>
                  {Array.from({ length: rows }).map((_, rowId) => {
                    const colIndex =
                      innerColGroupIndex +
                      columnsLayout
                        .slice(0, colGroupIndex)
                        .reduce((acc, curr) => acc + curr, 0);
                    const rowIndex = rowId + 1;
                    const seatNumber = colIndex + 1;

                    return (
                      <Grid key={rowIndex} item>
                        <Tooltip
                          title={`Row ${rowIndex}, Seat ${seatNumber}`}
                          arrow
                        >
                          <IconButton
                            className="w-7"
                            onClick={
                              onClickSeat
                                ? () => onClickSeat(rowIndex, colIndex)
                                : undefined
                            }
                          >
                            <EventSeatIcon
                              style={{
                                color: seatColorCallback(rowIndex, colIndex),
                                fontSize: "20px",
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              )
            )}
          </Grid>
        </Grid>
      ))}
      <Grid key={columnsLayout.length + 1} item>
        {Array.from({ length: rows }).map((_, rowId) => (
          <Grid key={rowId} item className="h-9 py-1">
            <Typography>{rowId + 1}</Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default SeatingChart;
