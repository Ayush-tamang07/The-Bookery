using System;
using Microsoft.AspNetCore.SignalR;

namespace backend.Service;

public class NotificationHub: Hub
{
      public async Task SendNotification(string user, string message)
    {
        await Clients.All.SendAsync("RecieveMessage", user, message);
    }


}
