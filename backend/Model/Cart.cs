using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Model;

namespace backend.Model;

public class Cart
{
    [Key]
    public Guid CartId { get; set; }
    [Required]
    public int Quantity { get; set; }
    [Required]
    public int PricePerUnit { get; set; }
    public DateTime DateAdded { get; set; } = DateTime.UtcNow;

    // Foreign Key for User
    [Required]
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; }

    // Foreign Key for Book
    [Required]
    public Guid BookId { get; set; }
    [ForeignKey("BookId")]
    public Book Book { get; set; }
    public bool IsCheckedOut { get; set; } = false;

}
