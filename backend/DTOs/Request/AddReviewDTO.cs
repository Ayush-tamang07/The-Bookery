using System;

namespace backend.DTOs.Request;

public class AddReviewDTO
{
    public Guid ReviewId { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    // public DateTime CreatedAt { get; set; }
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
}
