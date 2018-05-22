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
    struct Arguments
    {
        public string CommunicationServerAddress;
        public int CommunicationServerPort;
        public bool ListGames;
        public string GameName;
        public string ConfigPath;
    }

    class Program
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        static void PrintUsageWithMessage(string message)
        {
            Console.WriteLine(message);
            Console.WriteLine("usage:\n\tdotnet run comm_server_addr comm_serv_port -l\n\tdotnet run comm_server_addr comm_serv_port game_name [config_file_path]");
            return;
        }
        static Arguments ParseArguments(string[] args)
        {
            var address = args[0];
            var port = Int32.Parse(args[1]);
            var flag = args[2] == "-l";
            var gameName = flag ? "" : args[2];
            var configPath = args.Length < 4 ? "" : args[3];

            return new Arguments { CommunicationServerAddress = address, CommunicationServerPort = port, ListGames = flag, GameName = gameName, ConfigPath = configPath };
        }
        static void ListGames(Arguments args)
        {
            IList<GameInfo> gamesList;
            GameService gameService;
            using (var communicator = new Communicator(args.CommunicationServerAddress, args.CommunicationServerPort))
            {
                try
                {
                    gameService = new GameService(communicator);
                    gamesList = gameService.GetGamesList();
                }
                catch (TimeoutException e)
                {
                    logger.Fatal(e, "Connection failed:");
                    return;
                }
                catch (SocketException e)
                {
                    logger.Fatal(e, "Connection failed:");
                    return;
                }
                catch (IOException e)
                {
                    logger.Fatal(e.Message);
                    return;
                }
                catch (OperationCanceledException e)
                {
                    logger.Fatal(e.Message);
                    return;
                }

                if (gamesList.Count == 0)
                {
                    logger.Info("There are no games available.");
                    return;
                }
                Console.WriteLine("GAMES LIST:");
                foreach (var game in gamesList)
                {
                    Console.WriteLine(new string('-', 60));
                    Console.WriteLine(game);
                }
            }
            return;
        }
        static void StartGame(Arguments args)
        {
            PlayerConfig playerConfig;
            try
            {
                playerConfig = new ConfigFileReader().ReadConfigFile(args.ConfigPath);
            }
            catch (FileNotFoundException)
            {
                logger.Fatal($"Error: Config file {args.ConfigPath} does not exist!");
                return;
            }
            catch (InvalidDataException)
            {
                logger.Fatal($"Error: File {args.ConfigPath} is invalid!");
                return;
            }
            catch (Exception e)
            {
                logger.Fatal(e.Message);
                return;
            }
            playerConfig.GameName = args.GameName;

            using (var communicator = new Communicator(args.CommunicationServerAddress, args.CommunicationServerPort))
            {
                var gameService = new GameService(communicator);
                var playerState = new PlayerState(playerConfig);
                var messageProvider = new MessageProvider(playerState, communicator);
                var actionExecutor = new ActionExecutor(messageProvider, playerState);
                var player = new Player(playerConfig, gameService, messageProvider, playerState, actionExecutor);

                try
                {
                    player.Start();
                }
                catch (PlayerRejectedException e)
                {
                    logger.Fatal("Connection rejected: " + e.Message);
                }
                catch (OperationCanceledException e)
                {
                    logger.Fatal(e.Message);
                }
                catch (TimeoutException e)
                {
                    logger.Fatal(e.Message);
                }
                catch (SocketException e)
                {
                    logger.Fatal("Connection failed: " + e.Message);
                }
                catch (IOException e)
                {
                    logger.Fatal(e.Message);
                }
                catch (GameAlreadyFinishedException e)
                {
                    logger.Info(e.Message);
                }
                finally
                {
                    logger.Info("Player disconnected.");
                }
            }
        }

        static void Main(string[] args)
        {
            MapperInitializer.InitializeMapper();
            LoggerInitializer.InitializeLogger();

            if (args.Length < 3)
            {
                PrintUsageWithMessage("Not enough arguments!");
                return;
            }

            Arguments arguments;
            try
            {
                arguments = ParseArguments(args);
            }
            catch (FormatException)
            {
                PrintUsageWithMessage("Server port has to be a number!");
                return;
            }

            if (arguments.ListGames)
                ListGames(arguments);
            else
                StartGame(arguments);
        }
    }
}
