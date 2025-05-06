using System;

namespace backend.DTOs.Request;

public class Email
{
    public string Receptor { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }

}

