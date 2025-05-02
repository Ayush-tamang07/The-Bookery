using System;

namespace backend.DTOs.Response;

public class BookMarkDTO
{
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
}
