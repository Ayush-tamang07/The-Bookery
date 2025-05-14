using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace backend.Service
{
    public class EmailServices : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmail(string receptor, string subject, string body)
        {
            var email = _configuration.GetValue<string>("EMAIL_CONFIGURATION:EMAIL");
            var password = _configuration.GetValue<string>("EMAIL_CONFIGURATION:PASSWORD");
            var host = _configuration.GetValue<string>("EMAIL_CONFIGURATION:HOST");
            var port = _configuration.GetValue<int>("EMAIL_CONFIGURATION:PORT");

            var smtpClient = new SmtpClient(host, port)
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(email, password)
            };

            var message = new MailMessage
            {
                From = new MailAddress(email!),
                Subject = subject,
                Body = body,
                IsBodyHtml = true // ✅ Enable HTML formatting
            };

            message.To.Add(receptor);

            await smtpClient.SendMailAsync(message);
        }
    }
}
