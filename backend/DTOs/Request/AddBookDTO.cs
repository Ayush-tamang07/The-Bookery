using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Request;

public class AddBookDTO
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public DateTime PublishDate { get; set; }
    public string Publisher { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public int Price { get; set; }
    public int Quantity { get; set; }
    public int Discount { get; set; }
    public DateTime CreatedAt { get; set; }= DateTime.UtcNow;
    public bool AwardWinner { get; set; }
    // public string imageUrl { get; set; }

}
