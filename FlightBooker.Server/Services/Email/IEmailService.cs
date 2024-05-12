namespace FlightBooker.Server.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailData emailData);
    }
}
