using Newtonsoft.Json;
using Player.Common;
using System;
using System.IO;
using System.Net.Sockets;
using System.Runtime.Serialization.Json;

namespace Player
{
    class Program
    {
        static void Main(string[] args)
        {
            var communicator = new Communicator("10.1.2.106", 4200);

            if (args.Length == 0)
            {
                Console.WriteLine("usage: ./player game_name config_file_path");
                return;
            }

            if (args[0] == "-l")
            {
                communicator.Connect();
                var gameService = new GameService(communicator);
                var gamesList = gameService.GetGamesList();

                foreach (var game in gamesList)
                    Console.WriteLine(game);

                return;
            }

            string configFilePath = args[1];
            var configObject = ReadConfigFile(configFilePath);
            configObject.GameName = args[0];
            // Console.Write(JsonConvert.SerializeObject(configObject));

            var player = new Player(communicator, configObject);

            BeginGame(player);
        }

        static PlayerConfig ReadConfigFile(string _configFilePath)
        {
            PlayerConfig configFileObject;
            using (StreamReader file = File.OpenText(_configFilePath))
            {
                JsonSerializer serializer = new JsonSerializer();
                configFileObject = (PlayerConfig)serializer.Deserialize(file, typeof(PlayerConfig));
            };

            return configFileObject;
        }

        static void BeginGame(Player player)
        {
            try
            {
                player.ConnectToServer();
            }
            catch (PlayerRejectedException e)
            {
                Console.WriteLine($"Connection rejected: {e.Message}");
            }
            catch (SocketException e)
            {
                Console.WriteLine($"Connection failed: {e.Message}");
            }
        }
    }
}
