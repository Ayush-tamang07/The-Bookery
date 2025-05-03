using System;

namespace backend.DTOs.Response;

public class AnnouncementDTO
{
    public Guid AnnouncementId  {get; set;}
    public string message { get; set; } 

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
