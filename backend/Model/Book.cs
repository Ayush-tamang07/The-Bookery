using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Model;

public class Book
{
    [Key]
    public Guid BookId { get; set; }

    [Required(ErrorMessage = "Title is required")]
    [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
    public string Title { get; set; } = string.Empty;



    [Required(ErrorMessage = "Description is required")]
    public string Description { get; set; } = string.Empty;



    [Required(ErrorMessage = "Author is required")]
    public string Author { get; set; } = string.Empty;



    [Required(ErrorMessage = "Genre is required")]
    public string Genre { get; set; } = string.Empty;



    [Required(ErrorMessage = "Image is required")]
    public string Image { get; set; } = string.Empty;



    [Required(ErrorMessage = "Publication date is required")]
    public DateTime PublishDate { get; set; }

    public string Publisher { get; set; } = string.Empty;

    [Required(ErrorMessage = "Language is required")]
    public string Language { get; set; } = string.Empty;



    [Required(ErrorMessage = "Format is required")]
    public string Format { get; set; } = string.Empty;




    [Required(ErrorMessage = "ISBN is required")]
    public string ISBN { get; set; } = string.Empty;

    [Required(ErrorMessage = "Price is required")]
    public int Price { get; set; }


    [Required(ErrorMessage = "Quantity is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }


    [Required(ErrorMessage = "Discount is required")]
    public int Discount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    // public DateTime UpdateAt { get; set; }= DateTime.UtcNow;
    public ICollection<BookMark> BookMarks { get; set; }
    public ICollection<Cart> Carts { get; set; }
    public ICollection<Review> Reviews { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }

}
