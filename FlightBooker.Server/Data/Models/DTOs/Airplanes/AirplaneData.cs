namespace FlightBooker.Server.Data.Models.DTOs.Airplanes
{
    public class AirplaneData
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public uint NrRows { get; set; }
        public uint NrColumns { get; set; }
        public uint TotalSeats { get; set; }

        public AirplaneData(Airplane plane)
        {
            Id = plane.AirplaneId;
            Brand = plane.AirplaneBrand;
            Model = plane.AirplaneModel;
            NrRows = plane.NrRows;
            NrColumns = plane.NrColumns;
            TotalSeats = plane.TotalCapacity;
        }
    }
}
