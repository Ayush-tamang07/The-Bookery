using System;
using backend.Model;

namespace backend.DTOs.Response;

public class CartItemDTO
{
    public int Quantity { get; set; }
    public Guid BookId { get; set; }
    public BookDTO Book { get; set; } = new BookDTO();
}
