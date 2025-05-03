using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Model;

public class Announcement
{
    [Key]
    public Guid AnnouncementId { get; set; }

    [Required]
    public string message { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }
    public bool IsActive { get; set; } = false;

}
