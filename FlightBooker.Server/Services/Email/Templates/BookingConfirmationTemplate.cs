namespace FlightBooker.Server.Services.Email.Templates
{
    public class BookingConfirmationTemplate
    {
        public static string GenerateBody(int reservationId, string firstName, string departureAirportCode, string arrivalAirportCode, DateTime departureTime, DateTime arrivalTime)
        {
            return $@"<!DOCTYPE html>
<html lang=""en"" xmlns:v=""urn:schemas-microsoft-com:vml"">
<head>
  <meta charset=""utf-8"">
  <meta name=""x-apple-disable-message-reformatting"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1"">
  <meta name=""format-detection"" content=""telephone=no, date=no, address=no, email=no, url=no"">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings xmlns:o=""urn:schemas-microsoft-com:office:office"">
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {{font-family: ""Segoe UI"", sans-serif; mso-line-height-rule: exactly;}}
  </style>
  <![endif]-->
  <title>Booking #{reservationId} - Successful</title>
  <style>
    @media (max-width: 600px) {{
      h1 {{
        font-size: 24px !important;
        line-height: 32px !important;
      }}
    }}
    h2 {{
      font-size: 24px;
      line-height: 32px;
      color: #0f172a;
    }}
    @media (max-width: 600px) {{
      h2 {{
        font-size: 20px !important;
        line-height: 28px !important;
      }}
    }}
    h3 {{
      font-size: 20px;
      line-height: 28px;
      color: #0f172a;
      margin: 0 0 16px;
    }}
    @media (max-width: 600px) {{
      h3 {{
        font-size: 18px !important;
        line-height: 24px !important;
      }}
    }}
    h4 {{
      font-size: 18px;
      line-height: 24px;
      color: #0f172a;
    }}
    @media (max-width: 600px) {{
      h4 {{
        font-size: 16px !important;
        line-height: 20px !important;
      }}
    }}
    h5 {{
      font-size: 16px;
      line-height: 20px;
      color: #0f172a;
    }}
    @media (max-width: 600px) {{
      h5 {{
        font-size: 14px !important;
      }}
    }}
    h6 {{
      font-size: 16px;
      text-transform: uppercase;
      line-height: 20px;
      color: #0f172a;
    }}
    @media (max-width: 600px) {{
      h6 {{
        font-size: 14px !important;
      }}
    }}
    ul,
    ol {{
      line-height: 24px;
      color: #475569;
    }}
    blockquote p {{
      margin: 0;
      font-size: 18px;
      line-height: 28px;
    }}
    blockquote {{
      border-left: 4px solid #6366f1;
      margin: 0 0 32px;
      padding-left: 16px;
    }}
    hr {{
      height: 1px;
      border-width: 0px;
      background-color: #cbd5e1;
      color: #cbd5e1;
      margin-top: 32px;
      margin-bottom: 32px;
    }}
    img {{
      max-width: 100%;
      vertical-align: middle;
      line-height: 100%;
      border: 0;
    }}
    a {{
      color: #2563eb;
      text-decoration: underline;
    }}
    pre {{
      margin-bottom: 24px;
      overflow: auto;
      white-space: pre;
      border-radius: 8px;
      padding: 24px;
      text-align: left;
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 16px;
      color: #cbd5e1;
      hyphens: none;
      tab-size: 2;
      word-break: normal;
      word-spacing: normal;
      word-wrap: normal;
    }}
    :not(pre) > code {{
      border-radius: 4px;
      padding: 2px 6px;
      white-space: normal;
      font-size: 14px;
      border: 1px solid #e2e8f0;
      background-color: #f8fafc;
      color: #ec4899;
    }}
    @media (max-width: 600px) {{
      .sm-px-4 {{
        padding-left: 16px !important;
        padding-right: 16px !important;
      }}
    }}
  </style>
</head>
<body style=""margin: 0; width: 100%; background-color: #f1f5f9; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word"">
  <div align=""center"" role=""article"" aria-roledescription=""email"" lang=""en"" aria-label=""Booking #{reservationId} - Successful"" style=""background-color: #f1f5f9;"">
    <table style=""font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"" cellpadding=""0"" cellspacing=""0"" role=""none"">
      <tr>
        <td style=""width: 600px; max-width: 100%; border-radius: 12px; background-color: #fff"">
          <table style=""width: 100%;"" cellpadding=""0"" cellspacing=""0"" role=""none"">
            <tr>
              <td class=""sm-px-4"" style=""padding-left: 32px; padding-right: 32px; font-size: 16px; line-height: 24px; color: #334155"">
                <h1 style=""font-size: 30px; line-height: 36px; color: #0f172a; margin: 0 0 40px"">Booking #{reservationId} - Successful</h1>
                <p style=""font-size: 16px; line-height: 24px; color: #475569; margin: 0 0 32px"">Hello {firstName},<br>
                  A successful reservation for route {departureAirportCode}-{arrivalAirportCode} ({departureTime.Date}-{arrivalTime.Date}) was made.<br>
                  Reservation ID: {reservationId}</p>
                <p style=""font-size: 16px; line-height: 24px; color: #475569; margin: 0 0 32px;"">Thank you for using FlightBooker!</p>
                <p style=""font-size: 16px; line-height: 24px; color: #475569; margin: 0 0 32px;"">Safe travels,<br>
                  FlightBooker</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>";
        }
    }
}
