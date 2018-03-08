using System;
using System.Runtime.Serialization.Json;

namespace Player
{
    class Program
    {
        static void Main(string[] args)
        {
            var playerCommunicator = new Communicator("localhost", 4200);

            var message = @"{
  ""type"": ""PLAYER_HELLO"",
  ""senderId"": -2,
  ""payload"": {
    ""teamId"": 1,
    ""isLeader"": true,
    ""temporaryId"": 12431253
  }
}";

            playerCommunicator.Send(message);
            while (true)
            {
                var recv = playerCommunicator.Receive();
                Console.WriteLine($"Received message: {recv}");
            }
        }
    }
}
