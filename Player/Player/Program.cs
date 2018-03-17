using System;
using System.Runtime.Serialization.Json;

namespace Player
{
    class Program
    {
        static void Main(string[] args)
        {
            if(args.Length == 0)
            {
                var communicator = new Communicator("10.1.2.106", 4200);
                communicator.Connect();
                var gameService = new GameService(communicator);
                var gamesList = gameService.GetGamesList();

                foreach (var game in gamesList)
                {
                    Console.WriteLine(game);
                }
            }
            else
            {

            }
        }
    }
}
