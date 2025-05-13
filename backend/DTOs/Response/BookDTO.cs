using System;

namespace backend.DTOs.Response;

public class BookDTO
{
    public Guid BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public DateTime PublishDate { get; set; }
    public string Publisher { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public int Price { get; set; }
    public int Quantity { get; set; }
    public int Discount { get; set; }
    public DateTime CreatedAt { get; set; }
      public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
}
