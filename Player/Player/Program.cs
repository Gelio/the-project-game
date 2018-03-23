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
            if (args.Length < 3)
            {
                Console.WriteLine("player server_ip server_port -l\nplayer server_ip server_port game_name [config_file_path]");
                return;
            }
            var communicator = new Communicator(args[0], Int32.Parse(args[1]));

            if (args[2] == "-l")
            {
                try
                {
                    communicator.Connect();
                }
                catch (SocketException e)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Connection failed: {e.Message}");
                    return;
                }
                var gameService = new GameService(communicator);
                var gamesList = gameService.GetGamesList();

                if (gamesList.Count == 0)
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("There are no games available.");
                    return;
                }

                foreach (var game in gamesList)
                    Console.WriteLine(game);
                return;
            }


            PlayerConfig configObject;
            string configFilePath = "player.config.json";
            if (args.Length >= 4)
            {
                configFilePath = args[3];
            }

            try
            {
                configObject = ReadConfigFile(configFilePath);
            }
            catch (FileNotFoundException)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Error: Config file {configFilePath} does not exist!");
                return;
            }

            configObject.GameName = args[2];
            var player = new Player(communicator, configObject);

            BeginGame(player);
        }

        static PlayerConfig ReadConfigFile(string configFilePath)
        {
            if (!File.Exists(configFilePath))
            {
                throw new FileNotFoundException();
            }

            PlayerConfig configFileObject;
            using (StreamReader file = File.OpenText(configFilePath))
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
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Connection rejected: {e.Message}");
                player.Disconnect();
                return;
            }
            catch (SocketException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Connection failed: {e.Message}");
                player.Disconnect();
                return;
            }
            player.WaitForGameStart();
        }
    }
}
