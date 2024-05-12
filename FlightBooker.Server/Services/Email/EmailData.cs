namespace FlightBooker.Server.Services
{
    public class EmailData
    {
        public string EmailToId { get; set; } = null!;
        public string EmailToName { get; set; } = null!;
        public string EmailSubject { get; set; } = null!;
        public string EmailTextBody { get; set; } = null!;
        public string? EmailHtmlBody { get; set; }
    }
}
