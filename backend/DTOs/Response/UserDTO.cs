using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Response;

public class UserDTO
{
    internal string Email;

    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
    public string Role { get; internal set; }
}
