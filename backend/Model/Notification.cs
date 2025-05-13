using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Model;

public class Notification
{
    [Key]
    public Guid NotificationId { get; set; }
    public string Message { get; set; }
    public DateTime  CreatedAt { get; set;} = DateTime.UtcNow;
}
