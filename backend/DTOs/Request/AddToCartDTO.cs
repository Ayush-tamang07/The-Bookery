using System;

namespace backend.DTOs.Request;

public class AddToCartDTO
{
    // public Guid CartId { get; set; }
    public int Quantity { get; set; }
    // public Guid UserId { get; set; }
    public Guid BookId { get; set; }
    // public int TotalAmount { get; set; }

}
