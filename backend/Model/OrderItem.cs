using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model;

public class OrderItem
{
    [Key]
    public Guid OrderItemId { get; set; }
    [Required]
    public int Quantity { get; set; }
    
    [Required]
    public decimal PricePerUnit { get; set; }

    [Required]
    public Guid BookId { get; set; }
    [ForeignKey("BookId")]
    public Book Book { get; set; }

    [Required]
    public Guid OrderId { get; set; }
    [ForeignKey("OrderId")]
    public Order Order { get; set; }

}
