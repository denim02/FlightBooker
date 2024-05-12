namespace FlightBooker.Server.Data.Models.DTOs
{
    public class FormValidationResponse
    {
        public bool IsSuccessful { get; set; }
        public Dictionary<string, string>? Entries { get; set; }
        public Dictionary<string, string[]>? Errors { get; set; }
    }

    public class FieldError
    {
        public string FieldName { get; set; }
        public string Error { get; set; }
    }
}
