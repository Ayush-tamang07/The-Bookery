using System;

namespace backend.DTOs.Request;

public class UpdateRoleDTO
{
    public Guid UserId { get;  set; }

    public string Role { get;  set; }

}
