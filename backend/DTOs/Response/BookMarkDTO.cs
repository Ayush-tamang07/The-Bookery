using System;

namespace backend.DTOs.Response;

public class BookMarkDTO
{
    public Guid BookMardId { get; set; }
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
}
