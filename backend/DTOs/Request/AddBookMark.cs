using System;

namespace backend.DTOs.Request;

public class AddBookMark
{
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }

}
