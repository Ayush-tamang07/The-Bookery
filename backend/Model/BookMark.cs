using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Model;

namespace backend.Model;

public class BookMark
{
    [Key]
    public Guid BookMarkId { get; set; }
    // Foreign Key for User
    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; }

    // Foreign Key for Book
    public Guid BookId { get; set; }
    [ForeignKey("BookId")]
    public Book Book { get; set; }


}
