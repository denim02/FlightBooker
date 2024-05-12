namespace FlightBooker.Server.Data.Models.DTOs.Airplanes
{
    public class AirplaneSeatDataDTO
    {
        public uint NrRows { get; set; }
        public uint NrColumns { get; set; }
        public ICollection<IndividualSeatDataDTO> Seats { get; set; } = [];
        public ICollection<RowSeatClassMapping> CabinClassMappings { get; set; } = [];
    }

    public class IndividualSeatDataDTO
    {
        public int Id { get; set; }
        public uint Row { get; set; }
        public char Column { get; set; }
        public int CabinClass { get; set; }

        public IndividualSeatDataDTO(AirplaneSeat seat)
        {
            Id = seat.AirplaneSeatId;
            Row = seat.SeatRow;
            Column = seat.SeatColumn;
            CabinClass = seat.SeatClassId;
        }
    }
}
