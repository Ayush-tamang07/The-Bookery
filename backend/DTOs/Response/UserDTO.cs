using System;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Response;

public class UserDTO
{
    // internal string Email;

    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // public string Password { get; set; } = string.Empty;
    public string Role { get; internal set; }
    public Guid UserId { get; internal set; }
}
