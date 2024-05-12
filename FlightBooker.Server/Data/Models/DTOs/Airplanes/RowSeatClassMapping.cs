namespace FlightBooker.Server.Data.Models.DTOs.Airplanes
{
    public class RowSeatClassMapping
    {
        public uint[] Rows { get; set; } = [];
        public int SeatClass { get; set; }
    }
}
