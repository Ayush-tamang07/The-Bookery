using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Model;

namespace backend.Model;

public class Review
{
    [Key]
    public Guid ReviewId { get; set; }

    [Required]
    public string Comment { get; set; } = string.Empty;
    [Required]
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key for User
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; }

    // Foreign Key for Book
    public Guid BookId { get; set; }
    [ForeignKey("BookId")]
    public Book Book { get; set; }
}
