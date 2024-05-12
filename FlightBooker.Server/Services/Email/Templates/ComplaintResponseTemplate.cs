namespace FlightBooker.Server.Services.Email.Templates
{
    public static class ComplaintResponseTemplate
    {
        public static string GenerateBody(string complaintId, string complaintDate, string response)
        {
            return $@"
        <!DOCTYPE html>
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
  
    <title>Ticket #{complaintId} - Response</title>
  <style>/* Tailwind CSS components */
/**
 * @import here any custom CSS components - that is, CSS that
 * you'd want loaded before the Tailwind utilities, so the
 * utilities can still override them.
*/
/*
 * Here is where you can add your global markdown CSS styles.
 *
 * This is preferred over using the @tailwindcss/typography
 * plugin, because that plugin contains selectors
 * that are not supported in HTML emails.
*/
h1{{
  font-size: 30px;
  line-height: 36px;
  color: #0f172a;
}}
@media (max-width: 600px){{
  h1{{
    font-size: 24px !important;
    line-height: 32px !important;
  }}
}}
h2{{
  font-size: 24px;
  line-height: 32px;
  color: #0f172a;
}}
@media (max-width: 600px){{
  h2{{
    font-size: 20px !important;
    line-height: 28px !important;
  }}
}}
h3{{
  font-size: 20px;
  line-height: 28px;
  color: #0f172a;
  margin: 0;
  margin-bottom: 16px;
}}
@media (max-width: 600px){{
  h3{{
    font-size: 18px !important;
    line-height: 24px !important;
  }}
}}
h4{{
  font-size: 18px;
  line-height: 24px;
  color: #0f172a;
}}
@media (max-width: 600px){{
  h4{{
    font-size: 16px !important;
    line-height: 20px !important;
  }}
}}
h5{{
  font-size: 16px;
  line-height: 20px;
  color: #0f172a;
}}
@media (max-width: 600px){{
  h5{{
    font-size: 14px !important;
  }}
}}
h6{{
  font-size: 16px;
  text-transform: uppercase;
  line-height: 20px;
  color: #0f172a;
}}
@media (max-width: 600px){{
  h6{{
    font-size: 14px !important;
  }}
}}
p{{
  font-size: 16px;
  line-height: 24px;
  color: #475569;
  margin: 0;
  margin-bottom: 32px;
}}
ul, ol{{
  line-height: 24px;
  color: #475569;
}}
blockquote p{{
  margin: 0;
  font-size: 18px;
  line-height: 28px;
}}
blockquote{{
  border-left: 4px solid #6366f1;
  margin: 0;
  margin-bottom: 32px;
  padding-left: 16px;
}}
hr{{
  height: 1px;
  border-width: 0px;
  background-color: #cbd5e1;
  color: #cbd5e1;
  margin-top: 32px;
  margin-bottom: 32px;
}}
img{{
  max-width: 100%;
  vertical-align: middle;
  line-height: 100%;
  border: 0;
}}
a{{
  color: #2563eb;
  text-decoration: underline;
}}
pre{{
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
/* Inline code */
:not(pre) > code{{
  border-radius: 4px;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  white-space: normal;
  font-size: 14px;
  border-width: 1px;
  border-style: solid;
  border-color: #e2e8f0;
  background-color: #f8fafc;
  color: #ec4899;
}}
/* Tailwind CSS utility classes */
.absolute{{
  position: absolute;
}}
.m-0{{
  margin: 0;
}}
.mb-10{{
  margin-bottom: 40px;
}}
.mb-2{{
  margin-bottom: 8px;
}}
.mb-8{{
  margin-bottom: 32px;
}}
.inline-block{{
  display: inline-block;
}}
.table{{
  display: table;
}}
.hidden{{
  display: none;
}}
.w-150{{
  width: 600px;
}}
.w-\[600px\]{{
  width: 600px;
}}
.w-full{{
  width: 100%;
}}
.max-w-full{{
  max-width: 100%;
}}
.rounded{{
  border-radius: 4px;
}}
.rounded-lg{{
  border-radius: 8px;
}}
.rounded-xl{{
  border-radius: 12px;
}}
.bg-\[\#0F172A\]{{
  background-color: #0F172A;
}}
.bg-amber-100{{
  background-color: #fef3c7;
}}
.bg-blue-100{{
  background-color: #dbeafe;
}}
.bg-indigo-600{{
  background-color: #4f46e5;
}}
.bg-rose-100{{
  background-color: #ffe4e6;
}}
.bg-slate-100{{
  background-color: #f1f5f9;
}}
.bg-slate-300{{
  background-color: #cbd5e1;
}}
.bg-white{{
  background-color: #fff;
}}
.bg-cover{{
  background-size: cover;
}}
.bg-top{{
  background-position: top;
}}
.bg-no-repeat{{
  background-repeat: no-repeat;
}}
.p-0{{
  padding: 0;
}}
.px-4{{
  padding-left: 16px;
  padding-right: 16px;
}}
.px-8{{
  padding-left: 32px;
  padding-right: 32px;
}}
.py-3{{
  padding-top: 12px;
  padding-bottom: 12px;
}}
.py-4{{
  padding-top: 16px;
  padding-bottom: 16px;
}}
.py-8{{
  padding-top: 32px;
  padding-bottom: 32px;
}}
.text-left{{
  text-align: left;
}}
.text-center{{
  text-align: center;
}}
.text-right{{
  text-align: right;
}}
.align-top{{
  vertical-align: top;
}}
.font-sans{{
  font-family: ui-sans-serif, system-ui, -apple-system, ""Segoe UI"", sans-serif;
}}
.text-base{{
  font-size: 16px;
}}
.text-sm{{
  font-size: 14px;
}}
.font-semibold{{
  font-weight: 600;
}}
.leading-10{{
  line-height: 40px;
}}
.leading-6{{
  line-height: 24px;
}}
.leading-none{{
  line-height: 1;
}}
.text-amber-600{{
  color: #d97706;
}}
.text-blue-600{{
  color: #2563eb;
}}
.text-rose-600{{
  color: #e11d48;
}}
.text-slate-400{{
  color: #94a3b8;
}}
.text-slate-50{{
  color: #f8fafc;
}}
.text-slate-600{{
  color: #475569;
}}
.text-slate-700{{
  color: #334155;
}}
.mso-font-width-\[-100\%\]{{
  mso-font-width: -100%;
}}
.\[-webkit-font-smoothing\:antialiased\]{{
  -webkit-font-smoothing: antialiased;
}}
.\[text-decoration\:none\]{{
  text-decoration: none;
}}
.\[word-break\:break-word\]{{
  word-break: break-word;
}}
/* Your custom utility classes */
/*
 * Here is where you can define your custom utility classes.
 *
 * We wrap them in the `utilities` @layer directive, so
 * that Tailwind moves them to the correct location.
 *
 * More info:
 * https://tailwindcss.com/docs/functions-and-directives#layer
*/
.hover\:bg-indigo-700:hover{{
  background-color: #4338ca !important;
}}
.hover\:text-slate-300:hover{{
  color: #cbd5e1 !important;
}}
@media (max-width: 600px){{
  .sm\:block{{
    display: block !important;
  }}
  .sm\:w-12{{
    width: 48px !important;
  }}
  .sm\:w-full{{
    width: 100% !important;
  }}
  .sm\:px-0{{
    padding-left: 0 !important;
    padding-right: 0 !important;
  }}
  .sm\:px-4{{
    padding-left: 16px !important;
    padding-right: 16px !important;
  }}
  .sm\:pb-8{{
    padding-bottom: 32px !important;
  }}
}}</style>
  
</head>
<body class=""m-0 p-0 w-full [word-break:break-word] [-webkit-font-smoothing:antialiased] bg-slate-100"">
  <div align=""center"" role=""article"" aria-roledescription=""email"" lang=""en"" class=""bg-slate-100"" aria-label=""Ticket #{complaintId} - Response"">
    <table class=""font-sans"" cellpadding=""0"" cellspacing=""0"" role=""none"">
      <tr>
        <td class=""w-[600px] max-w-full bg-white rounded-xl"">
          <table class=""w-full"" cellpadding=""0"" cellspacing=""0"" role=""none"">
            <tr>
              <td class=""px-8 sm:px-4 text-base leading-6 text-slate-700"">
                
          <h1>Ticket #{complaintId} - Response</h1>
<p>In relation to ticket #{complaintId}, issued {complaintDate}, a website administrator has reviewed the issue and provided<br>
the response attached below.<br>
If any further problems arise, please issue another ticket.</p>
<blockquote>
<p>{response}</p>
</blockquote>
<p>Thank you for your patience and support in improving our system!</p>
<p>Safe travels,<br>
FlightBooker</p>

        
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>

";
        }
    }
}
