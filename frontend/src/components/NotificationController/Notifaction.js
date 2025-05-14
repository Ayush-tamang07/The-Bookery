import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection = null;

export const startSignalRConnection = async (onMessageReceived) => {
  connection = new HubConnectionBuilder()
    .withUrl("https://nwvcgf67-5175.inc1.devtunnels.ms/hub/notifications")
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", (user, message) => {
    console.log("Received:", message);
    onMessageReceived(`${user}: ${message}`);
  });

  try {
    await connection.start();
    console.log("SignalR Connected");
  } catch (err) {
    console.error("SignalR Connection Failed:", err);
  }
};