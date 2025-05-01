using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Model;
using Microsoft.IdentityModel.Tokens;

namespace backend.Service;

public class TokenService(IConfiguration configuration)
{

    private readonly IConfiguration _configuration = configuration;

    public string GenerateToken(User user)
          {
                    var secret = _configuration["JwtSettings:Secret"] ?? "YourKeyHere";
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

                    var claims = new[]
                    {
                              new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                              new Claim(ClaimTypes.Name, user.UserName),
                              new Claim(ClaimTypes.Email, user.Email),
                              new Claim(ClaimTypes.Role, user.Role)
                    };

                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                              claims: claims,
                              expires: DateTime.UtcNow.AddDays(1),
                              signingCredentials: creds
                    );

                    return new JwtSecurityTokenHandler().WriteToken(token);
          }

    internal object GenerateJwtToken(User user)
    {
        throw new NotImplementedException();
    }
}
