using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Sockets;
using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Messages.DTO;

namespace Player
{
    class Program
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();
        static void Main(string[] args)
        {
            MapperInitializer.InitializeMapper();
            LoggerInitializer.InitializeLogger();

            if (args.Length < 3)
            {
                Console.WriteLine("usage:\ndotnet run comm_server_addr comm_serv_port -l\ndotnet run comm_server_addr comm_serv_port game_name [config_file_path]");
                return;
            }
            var communicator = new Communicator(args[0], Int32.Parse(args[1]));

            GameService gameService;

            if (args[2] == "-l")
            {
                IList<GameInfo> gamesList;
                try
                {
                    communicator.Connect();
                    gameService = new GameService(communicator);
                    gamesList = gameService.GetGamesList();
                }
                catch (TimeoutException e)
                {
                    logger.Fatal(e, "Connection failed:");
                    communicator.Disconnect();
                    return;
                }
                catch (SocketException e)
                {
                    logger.Fatal(e, "Connection failed:");
                    communicator.Disconnect();
                    return;
                }
                catch (IOException e)
                {
                    logger.Fatal(e.Message);
                    communicator.Disconnect();
                    return;
                }
                catch (OperationCanceledException e)
                {
                    logger.Fatal(e.Message);
                    communicator.Disconnect();
                    return;
                }

                if (gamesList.Count == 0)
                {
                    logger.Info("There are no games available.");
                    communicator.Disconnect();
                    return;
                }
                Console.WriteLine("GAMES LIST:");
                foreach (var game in gamesList)
                {
                    Console.WriteLine(new string('-', 60));
                    Console.WriteLine(game);
                }
                communicator.Disconnect();
                return;
            }

            ConfigFileReader configFileReader = new ConfigFileReader();
            PlayerConfig configObject;
            string configFilePath = String.Empty;
            if (args.Length >= 4) configFilePath = args[3];

            try
            {
                configObject = configFileReader.ReadConfigFile(configFilePath);
                configObject.GameName = args[2];
            }
            catch (FileNotFoundException)
            {
                logger.Fatal($"Error: Config file {configFilePath} does not exist!");
                return;
            }
            catch (InvalidDataException)
            {
                logger.Fatal($"Error: File {configFilePath} is invalid!");
                return;
            }
            catch (Exception e)
            {
                logger.Fatal(e);
                return;
            }

            configObject.GameName = args[2];

            communicator.Connect();  //FIXME: Should be wrapped in try-catch!!
            gameService = new GameService(communicator);

            var player = new Player(communicator, configObject, gameService, new MessageProvider(communicator));

            try
            {
                player.Start();
            }
            catch (PlayerRejectedException e)
            {
                logger.Fatal(e, "Connection rejected:");
                player.Disconnect();
                return;
            }
            catch (OperationCanceledException e)
            {
                logger.Fatal(e);
                player.Disconnect();
                return;
            }
            catch (TimeoutException e)
            {
                logger.Fatal(e);
                player.Disconnect();
                return;
            }
            catch (SocketException e)
            {
                logger.Fatal(e, "Connection failed:");
                player.Disconnect();
                return;
            }
            catch (IOException e)
            {
                logger.Fatal(e);
                player.Disconnect();
                return;
            }
            catch (GameAlreadyFinishedException e)
            {
                logger.Info(e.Message);
                player.Disconnect();
                return;
            }
        }
    }
}
