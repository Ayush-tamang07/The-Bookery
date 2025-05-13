using System;

namespace backend.DTOs.Request;

public class DiscountDTO
{
    public int Discount{ get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
