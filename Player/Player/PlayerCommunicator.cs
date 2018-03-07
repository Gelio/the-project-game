using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;

namespace Player
{
  public class PlayerCommunicator
  {
    public TcpClient tcpClient;

    public PlayerCommunicator(string hostname, int port)
    {
      tcpClient = new TcpClient(hostname, port);

      Console.WriteLine(tcpClient.Connected);
    }

    public void Send(string message)
    {
      var stream = tcpClient.GetStream();

      var lol = new
      {
        type = "PLAYER_HELLO",
        senderId = -2,
        payload = new
        {
          isLeader = true,
	        teamId = 1,
          temporaryId = 8485732109876543
        }
      };

      var j = JsonConvert.SerializeObject(lol);
      var buffer = System.Text.Encoding.ASCII.GetBytes(j);

      // Send message length
      var len =  BitConverter.GetBytes(IPAddress.HostToNetworkOrder(buffer.Length));
      stream.Write(len, 0, len.Length);

      // Send message
      stream.Write(buffer, 0, buffer.Length);


      var readBuffer = new byte[200];
      while(true)
      {
        stream.Read(readBuffer, 0, readBuffer.Length);
        Console.WriteLine(System.Text.Encoding.ASCII.GetString(readBuffer));
      }
    }
  }
}
