using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

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

    //public void SendRequest()
    //{
    //  throw new NotImplementedException();
    //}

    //public void SendResponse()
    //{
    //  throw new NotImplementedException();
    //}

    public void Send(string message)
    {
      var stream = tcpClient.GetStream();

      var lol = new
      {
        type = "PLAYER_HELLO",
        senderId = -2,
        payload = new
        {
          teamId = 1,
          isLeader = true,
          temporaryId = 848573
        }
      };

      var j = JsonConvert.SerializeObject(lol);
      var buffer = System.Text.Encoding.ASCII.GetBytes(j);

      Console.WriteLine(j);
      for (int i = 0; i < 5; i++)
      {
        stream.Write(buffer, 0, buffer.Length);

      }
      //await stream.WriteAsync(buffer, 0, buffer.Length);

      stream.Read(buffer, 0, buffer.Length);

    }
  }
}
