using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Model;

namespace backend.Model;

public class Order
{
    [Key]
    public Guid OrderId { get; set; }

    [Required]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [Required]
    public decimal DiscountRate { get; set; }

    [Required]
    public decimal FinalAmount { get; set; }

    [Required]
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; }

    public string ClaimCode { get;  set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}
