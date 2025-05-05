using System;

namespace backend.DTOs.Request;

public class AddAnnouncementDTO
{
    public string message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
    public bool IsActive    { get; set; }
}
