using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Messages.DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Sockets;

namespace Player
{
    class Program
    {
        static void Main(string[] args)
        {
            MapperInitializer.InitializeMapper();

            if (args.Length < 3)
            {
                Console.WriteLine("player server_ip server_port -l\nplayer server_ip server_port game_name [config_file_path]");
                return;
            }
            var communicator = new Communicator(args[0], Int32.Parse(args[1]));

            GameService gameService;

            if (args[2] == "-l")
            {
                IList<Game> gamesList;
                try
                {
                    communicator.Connect();
                    gameService = new GameService(communicator);
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
                configObject.GameName = args[2];
            }
            catch (FileNotFoundException)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Error: Config file {configFilePath} does not exist!");
                Console.ResetColor();
                return;
            }
            catch (Exception e)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Error: {e.Message}");
                Console.ResetColor();
                return;
            }

            configObject.GameName = args[2];

            communicator.Connect();
            gameService = new GameService(communicator);

            var player = new Player(communicator, configObject, gameService);

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
