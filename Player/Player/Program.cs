using Newtonsoft.Json;
using Player.Common;
using System;
using System.Collections.Generic;
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
                IList<Game> gamesList;
                try
                {
                    communicator.Connect();
                    var gameService = new GameService(communicator);
                    gamesList = gameService.GetGamesList();
                }
                catch (TimeoutException e)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine(e.Message);
                    Console.ResetColor();
                    communicator.Disconnect();
                    return;
                }
                catch (SocketException e)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Connection failed: {e.Message}");
                    Console.ResetColor();
                    communicator.Disconnect();
                    return;
                }
                catch (IOException e)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine(e.Message);
                    Console.ResetColor();
                    communicator.Disconnect();
                    return;
                }
                catch (OperationCanceledException e)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine(e.Message);
                    Console.ResetColor();
                    communicator.Disconnect();
                    return;
                }

                if (gamesList.Count == 0)
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("There are no games available.");
                    Console.ResetColor();
                    communicator.Disconnect();
                    return;
                }

                foreach (var game in gamesList)
                    Console.WriteLine(game);
                communicator.Disconnect();
                return;
            }


            PlayerConfig configObject;
            string configFilePath = "player.config.json";
            if (args.Length >= 4) configFilePath = args[3];

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

            try
            {
                player.Start();
            }
            catch (PlayerRejectedException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Connection rejected: {e.Message}");
                player.Disconnect();
                Console.ResetColor();
                return;
            }
            catch (OperationCanceledException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(e.Message);
                player.Disconnect();
                Console.ResetColor();
                return;
            }
            catch (TimeoutException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(e.Message);
                player.Disconnect();
                Console.ResetColor();
                return;
            }
            catch (SocketException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Connection failed: {e.Message}");
                player.Disconnect();
                Console.ResetColor();
                return;
            }
            catch (IOException e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(e.Message);
                player.Disconnect();
                Console.ResetColor();
                return;
            }
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

    }
}
